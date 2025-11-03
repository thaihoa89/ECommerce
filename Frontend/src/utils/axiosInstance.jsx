import axios from 'axios';
import useAuthenStore from '../store/authenStore';

// Tạo một public instance axios không cần interceptor
export const axiosPublic = axios.create({
    baseURL: import.meta.env.MODE === 'development' ? 'http://localhost:5001' : "",
    withCredentials: true   // axios tự động gửi kèm cookie liên quan đến domain của request theo request
    /*  Khi withCredentials: true thì backend không được thiết lập app.use(cors()) mặc định nữa vì 
        tương đương với cho phép mọi website (bất kỳ domain nào) gọi API của backend -> backend chấp nhận
        mọi request đến từ bất kì origin/refere nào (ghi trong header request do trình duyệt thêm vào khi
        gửi) -> như vậy người dùng sẽ dễ bị tấn công CSRF. Do đó browser phải không cho phép backend
        thiết lập app.use(cors()) mặc định mà phải bắt backend thiết lập origin cụ thể nào được cho phép
        gọi API của backend mà còn gửi kèm cookie, nếu không browser sẽ chặn request để bảo vệ người dùng.
    */
});

// Tạo một private instance axios mới có interceptor (không phải là React component vì không render ra UI)
export const axiosInstance = axios.create({
    baseURL: import.meta.env.MODE === 'development' ? 'http://localhost:5001' : "",
    withCredentials: true
});

// Interceptor cho request: Tự động thêm token vào header
axiosInstance.interceptors.request.use(   // Interceptor can thiệp trước khi request đi ra
    // Hàm onFulfilled
    (config) => {   // config là object chứa tất cả thông tin request (URL, method, headers, data…), mỗi request chỉ có 1 config gốc xuyên suốt
        const token = localStorage.getItem('accessToken');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
        /*  Bắt buộc phải return config vì axios cần object này để tiếp tục thực hiện request.
            Nếu không return → request sẽ dừng lại hoặc không có header gì cả.
            Tóm lại: return config nghĩa là “ok, mình đã chỉnh sửa xong, bây giờ cho request đi tiếp”.
        */
    },
    // Hàm onRejected
    (error) => {   // Nếu có lỗi trong quá trình interceptor
        return Promise.reject(error);
        /*  Tạo một Promise bị từ chối với lỗi error (đi tiếp tới .catch())
            Khi đó, ở nơi gọi axiosInstance.get/post(...)
            bạn có thể bắt lỗi bằng .catch().
        */
    }
);

// Interceptor cho response: Xử lý lỗi tập trung
axiosInstance.interceptors.response.use(
    // onFulfilled - Hàm chạy khi response là thành công
    (response) => {   // Object response chứa tất cả thông tin response (data, status, headers...)
        // Bất kỳ mã trạng thái nào nằm trong phạm vi 2xx sẽ kích hoạt hàm này
        return response;
        /*  Trả về đối tượng response cho chỗ gọi axiosInstance.get/post(...)
            đi tiếp tới: .then((res) => {...}) - tiếp tục sử dụng
            res ở đây chính là response.
            Có thể viết gọn hàm onFulfilled này là: (response) => response
        */
    },
    // onRejected - Hàm chạy khi response là lỗi
    async (error) => {   // error là đối tượng mà axios sinh ra mới mỗi lần response nhận là lỗi nhưng thuộc tính config của error vẫn tham chiếu đến config gốc của request
        // Bất kỳ mã trạng thái nào nằm ngoài phạm vi 2xx sẽ kích hoạt hàm này

        // Lấy object config chứa tất cả thông tin request gốc đã gọi (URL, headers, data, method,…)
        const originalRequest = error.config;

        // Kiểm tra lỗi 401 và tránh vòng lặp vô hạn
        if (error.response?.status === 401 && !originalRequest._retry) {   // Lần đầu _retry chưa tồn tại: undefined
            originalRequest._retry = true; // đánh dấu đã thử refresh trên config gốc thì lần hai config._retry đã = true rồi nên không refresh nữa mà xuống thẳng lệnh cuối trả lỗi ra ngoài để .catch() xử lý

            try {
                // Gửi request refresh token (cookie tự động gửi)
                const res = await axios.get(   // axios.get(url[, config]), axios.post(url, data[, config])
                    'http://localhost:5001/authen/refresh',
                    { withCredentials: true } // đảm bảo cookie refreshToken được gửi kèm theo
                );   // axios sẽ ném lỗi mới vào .catch(refreshError) nếu request này thất bại

                const newToken = res.data.token;
                localStorage.setItem('accessToken', newToken);

                // Cập nhật lại header của request gốc và gửi lại
                originalRequest.headers.Authorization = `Bearer ${newToken}`;
                return axiosInstance(originalRequest);
            } catch (refreshError) {
                // Refresh thất bại do refresh token hết hạn/bị xóa → logout hoặc redirect login chứ không retry
                localStorage.removeItem('accessToken');
                useAuthenStore.getState().logout();

                // Phát event để React Router xử lý việc redirect đến trang login
                window.dispatchEvent(new CustomEvent('auth:unauthorized'));

                return Promise.reject(refreshError);
            }
        }

        // Nếu không phải lỗi 401 hoặc đã thử refresh rồi nhưng vẫn thất bại thì trả lỗi ra ngoài để .catch() xử lý
        return Promise.reject(error);
    }
);
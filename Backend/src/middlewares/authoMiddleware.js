import jwt from 'jsonwebtoken';
import User from '../models/user.js';

const protectedRoute =  async (req, res, next) => {
    try {
        // Lấy JWT token từ header
        const authoHeader = req.header('Authorization');
        const token = authoHeader && authoHeader.split(" ")[1];   // Bearer <token>
        if (!token) {
            console.log('Thiếu JWT token');
            return res.status(401).json({ 
                success: false,
                message: "Truy cập bị từ chối"
            });
        }

        // Xác nhận token hợp lệ
        const decodedPayload = jwt.verify(token, process.env.JWT_SECRET);   // không dùng hàm callback ở tham số thứ 3 vì try catch sẽ không bắt được

        // Tìm user hiện tại loại bỏ trường password
        const user = await User.findById(decodedPayload.userId).select('-password');
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "Người dùng không tồn tại"
            })
        }

        // Gắn user tìm thấy vào trong request để truyền đến route handler phía sau
        req.user = user;
        /*
            Trong Express, mỗi request (req) là một đối tượng JavaScript mà bạn có thể gắn thêm thuộc tính tùy ý.
            Thì ở bất kỳ middleware hoặc controller nào chạy sau đó, bạn đều có thể truy cập lại thuộc tính đó.
            Đây là một cách truyền dữ liệu rất phổ biến giữa middleware và controller,
        */

        next();

    } catch (error) {
        console.log('Lỗi khi xác minh JWT trong authoMiddleware: ', error.message)

        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({
                success: false,
                message: 'JWT token không hợp lệ',
            });
        }

        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({
                success: false,
                message: 'JWT token đã hết hạn',
            });
        }

        res.status(500).json({
            success: false,
            message: 'Lỗi server',
            error: error.message
        });
    }
}

export default protectedRoute;
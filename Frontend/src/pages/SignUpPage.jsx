// import { z } from 'zod';
// import { toast } from 'sonner';
// import { useState } from 'react';

// const signUpSchema = z.object({
//     email: z.string().regex(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Email không hợp lệ'),
//     username: z.string().min(2, 'Tên đăng nhập phải có ít nhất 2 ký tự')
//                         .max(30, 'Tên đăng nhập không được vượt quá 30 ký tự')
//                         .regex(/^[a-zA-Z0-9_]+$/, 'Tên đăng nhập chỉ được chứa chữ cái, số và dấu gạch dưới'),
//     password: z.string().min(6, 'Mật khẩu phải có ít nhất 6 ký tự')
//                         .regex(/[a-z]/, 'Mật khẩu phải có ít nhất 1 ký tự viết thường')
//                         .regex(/[A-Z]/, 'Mật khẩu phải có ít nhất 1 ký tự viết hoa')
//                         .regex(/[0-9]/, 'Mật khẩu phải có ít nhất 1 chữ số')
//                         .regex(/[!@#$%^&*(),.?":{}|<>]/, 'Mật khẩu phải có ít nhất 1 ký tự đặc biệt'),
// });

// const SignUpPage = () => {
//     const [formData, setFormData] = useState({ email: '', username: '', password: '' });
//     const [errors, setErrors] = useState({});

//     const handleChange = (e) => {
//         const { name, value } = e.target;
//         setFormData(prev => ({
//             ...prev,
//             [name]: value
//         }));
//         // Nếu field đang nhập có lỗi thì xóa lỗi đó để không hiển thị message lỗi nữa
//         if (errors[name]) {
//             setErrors(prev => ({
//                 ...prev,
//                 [name]: ''
//             }));
//         }
//     };

//     // const validateForm = () => {
//     //     const newErrors = {};

//     //     // Email validation
//     //     if (!formData.email) {
//     //         newErrors.email = 'Email không được để trống';
//     //     } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
//     //         newErrors.email = 'Email không hợp lệ';
//     //     }

//     //     // Username validation
//     //     if (!formData.username) {
//     //         newErrors.username = 'Tên đăng nhập không được để trống';
//     //     } else if (formData.username.length < 3) {
//     //         newErrors.username = 'Tên đăng nhập phải có ít nhất 3 ký tự';
//     //     } else if (formData.username.length > 30) {
//     //         newErrors.username = 'Tên đăng nhập không được vượt quá 30 ký tự';
//     //     } else if (!/^[a-zA-Z0-9_]+$/.test(formData.username)) {
//     //         newErrors.username = 'Tên đăng nhập chỉ được chứa chữ cái, số và dấu gạch dưới';
//     //     }

//     //     // Password validation
//     //     if (!formData.password) {
//     //         newErrors.password = 'Mật khẩu không được để trống';
//     //     } else if (formData.password.length < 6) {
//     //         newErrors.password = 'Mật khẩu phải có ít nhất 6 ký tự';
//     //     } else if (!/[a-z]/.test(formData.password)) {
//     //         newErrors.password = 'Mật khẩu phải có ít nhất 1 ký tự viết thường';
//     //     } else if (!/[A-Z]/.test(formData.password)) {
//     //         newErrors.password = 'Mật khẩu phải có ít nhất 1 ký tự viết hoa';
//     //     } else if (!/[0-9]/.test(formData.password)) {
//     //         newErrors.password = 'Mật khẩu phải có ít nhất 1 chữ số';
//     //     } else if (!/[!@#$%^&*(),.?":{}|<>]/.test(formData.password)) {
//     //         newErrors.password = 'Mật khẩu phải có ít nhất 1 ký tự đặc biệt';
//     //     }

//     //     return newErrors;
//     // };

//     const handleSubmit = () => {
//         // Cách 1 - dùng hàm validateForm() tự định nghĩa
//         // const newErrors = validateForm();   // Gọi hàm validateForm() để kiểm tra tất cả các field và trả về object chứa các lỗi (nếu có), nếu không có lỗi = {}
//         // if (Object.keys(newErrors).length === 0) {   // Object.keys(newErrors): Lấy mảng các key của object newErrors
//         //     console.log('Form submitted:', formData);   // Submit form
//         //     toast.success('Đăng ký thành công!');
//         //     setFormData({ email: '', username: '', password: '' });   // Reset form
//         // } else {
//         //     setErrors(newErrors);
//         // }

//         // Cách 2 - dùng thư viện zod để validate form input
//         try {
//             signUpSchema.parse(formData);
//             // Nếu không có lỗi => submit form
//             console.log('Form submitted:', formData);
//             toast.success('Đăng ký thành công!');
//             setFormData({ email: '', username: '', password: '' });
//         } catch (error) {   // Chuyển lỗi Zod thành object dạng { field: message, ... } để cập nhật vào state errors
//             if (error instanceof z.ZodError) {   // Nếu lỗi được zod ném ra khi signUpSchema.parse(formData) dữ liệu không hợp lệ
//                 const fieldErrors = {};   // Tạo một object rỗng để lưu lỗi theo từng field. VD: { email: "Email không hợp lệ", password: "Mật khẩu quá ngắn" }
//                 error.issues.forEach(e => {   // mỗi ZodError có thuộc tính issues là 1 mảng chứa các lỗi chi tiết
//                     if (e.path[0]) {   // e.path[0] là thuộc tính path của 1 lỗi, cũng là 1 mảng, [0] là tên field đầu tiên chứa lỗi
//                         fieldErrors[e.path[0]] = e.message;   // Lấy tên field đầu tiên chứa lỗi làm key và message của lỗi làm value cho đối tượng fieldErrors
//                     }
//                 });
//                 setErrors(fieldErrors);
//             } else {
//                 console.error("Unexpected error:", error);
//                 toast.error("Đã xảy ra lỗi không mong muốn");
//             }
//         }
//     };

//     const handleKeyPress = (e) => {
//         if (e.key === 'Enter') {
//             handleSubmit();
//         }
//     };

//     return (
//         <>
//             <title>Đăng ký</title>

//             <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100 flex items-center justify-center p-4">
//                 <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-8">
//                     <div className="text-center mb-6">
//                         <h1 className="text-3xl font-bold text-green-800 mb-2">Đăng Ký</h1>
//                         <p className="text-gray-600">Tạo tài khoản mới của bạn</p>
//                     </div>

//                     <div className="space-y-5">
//                         {/* Email Field */}
//                         <div>
//                             <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">Email <span className="text-red-500">*</span></label>
//                             <input
//                                 type="email"
//                                 id="email"
//                                 name="email"
//                                 value={formData.email}
//                                 onChange={handleChange}
//                                 onKeyDown={handleKeyPress}
//                                 className={`w-full px-4 py-3 rounded-lg border ${errors.email ? 'border-red-500' : 'border-gray-300'} focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition placeholder-gray-400`}
//                                 placeholder="example@email.com"
//                             />
//                             {errors.email && (<p className="mt-1 text-sm text-red-500">{errors.email}</p>)}
//                         </div>

//                         {/* Username Field */}
//                         <div>
//                             <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-2">Tên người dùng <span className="text-red-500">*</span></label>
//                             <input
//                                 type="text"
//                                 id="username"
//                                 name="username"
//                                 value={formData.username}
//                                 onChange={handleChange}
//                                 onKeyDown={handleKeyPress}
//                                 className={`w-full px-4 py-3 rounded-lg border ${errors.username ? 'border-red-500' : 'border-gray-300'} focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition placeholder-gray-400`}
//                                 placeholder="Nhập tên người dùng"
//                             />
//                             {errors.username && (<p className="mt-1 text-sm text-red-500">{errors.username}</p>)}
//                         </div>

//                         {/* Password Field */}
//                         <div>
//                             <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">Mật khẩu <span className="text-red-500">*</span></label>
//                             <input
//                                 type="password"
//                                 id="password"
//                                 name="password"
//                                 value={formData.password}
//                                 onChange={handleChange}
//                                 onKeyDown={handleKeyPress}
//                                 className={`w-full px-4 py-3 rounded-lg border ${errors.password ? 'border-red-500' : 'border-gray-300'} focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition placeholder-gray-400`}
//                                 placeholder="Nhập mật khẩu"
//                             />
//                             {errors.password && (<p className="mt-1 text-sm text-red-500">{errors.password}</p>)}
//                         </div>

//                         {/* Submit Button */}
//                         <button onClick={handleSubmit} className="w-full bg-green-800 text-white py-3 rounded-lg font-semibold hover:bg-green-900 transition duration-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2">Đăng Ký</button>
//                     </div>

//                     {/* Login Link */}
//                     <div className="mt-6 text-center">
//                         <p className="text-gray-600">
//                             Đã có tài khoản?{' '}
//                             <a href="#" className="text-green-800 font-semibold hover:underline">Đăng nhập</a>
//                         </p>
//                     </div>
//                 </div>
//             </div>
//         </>
//     );
// };

// export default SignUpPage;

//---------------------------------------------------------------------------------------------------------------------------------------

import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { axiosPublic } from '../utils/axiosInstance';

const signUpSchema = z.object({
    email: z.string()
        .min(1, 'Email không được để trống')
        .regex(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Email không hợp lệ'),
    username: z.string()
        .min(2, 'Tên người dùng phải có ít nhất 2 ký tự')
        .max(30, 'Tên người dùng không được vượt quá 30 ký tự')
        .regex(/^[a-zA-Z0-9_]+$/, 'Tên người dùng chỉ được chứa chữ cái, số và dấu gạch dưới'),
    password: z.string()
        .min(6, 'Mật khẩu phải có ít nhất 6 ký tự')
        .regex(/[a-z]/, 'Mật khẩu phải có ít nhất 1 ký tự viết thường')
        .regex(/[A-Z]/, 'Mật khẩu phải có ít nhất 1 ký tự viết hoa')
        .regex(/[0-9]/, 'Mật khẩu phải có ít nhất 1 chữ số')
        .regex(/[!@#$%^&*(),.?":{}|<>]/, 'Mật khẩu phải có ít nhất 1 ký tự đặc biệt'),
    confirmPassword: z.string()
}).refine(data => data.password === data.confirmPassword, {
    // nếu điều kiện false, Zod và zodResolver sẽ dùng object lỗi này gán cho object errors của formState
    message: "Mật khẩu không khớp",
    path: ["confirmPassword"],   // chỉ định object lỗi này gán cho trường confirmPassword của object errors
});

const SignUpPage = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    // Khởi tạo React Hook Form với zodResolver
    const {
        register,        // Hàm để đăng ký input fields
        handleSubmit,    // Hàm wrapper cho form submission
        formState: { errors, isSubmitting },  // Object để lấy errors và trạng thái submit
        reset            // Hàm reset form
    } = useForm({
        resolver: zodResolver(signUpSchema),  // Kết nối Zod schema với React hook form
        mode: 'onSubmit',  // Validate khi submit (có thể đổi thành 'onChange', 'onBlur')
        defaultValues: {
            email: '',
            username: '',
            password: '',
            confirmPassword: ''
        }
    });

    const navigate = useNavigate();
    const timerRef = useRef(null);
    /*  useRef là hook để lưu (tham chiếu bền vững) 1 giá trị qua nhiều lần render mà khi
        thay đổi giá trị thì không re-render component. Đối tượng tham chiếu của useRef chỉ
        có 1 thuộc tính là current: { current: null }
        timerRef.current có thể lưu bất kì giá trị gì (component, id, giá trị biến...)
    */
    /*  1. Component mount xong → useEffect chạy → chưa có gì đặc biệt.
        2. Người dùng submit → setTimeout được tạo → id của settimeout được lưu vào timerRef.current.
        3. Component unmount (ví dụ user chuyển trang) trong 5s → React gọi cleanup function → clearTimeout(timerRef.current) → settimeout bị huỷ trước khi chạy.
    */
    useEffect(() => {
        return () => {   // Hàm cleanup settimeout khi unmount
            if (timerRef.current) clearTimeout(timerRef.current);
        };
    }, []);

    // Xử lý submit - chỉ chạy khi validation pass
    const onSubmit = async (data) => {
        // Toán tử rest operator trong destructuring object (chứ không phải spread operator), gom phần còn lại vào 1 biến mới
        const { confirmPassword: _, ...submissionData } = data;
        /*  cú pháp destructuring: const { thuộcTínhGốc: tênBiếnMới } = đốiTượng;
            tên biến _ là chỉ cố tính không dùng */

        try {
            const res = await axiosPublic.post('/authen/register', submissionData);
            if (res.status === 201) {
                toast.success('Đăng ký thành công! Đang chuyển hướng đến trang đăng nhập...');
                reset();
                timerRef.current = setTimeout(() => {
                    navigate('/signin');
                }, 1000);
            }
        } catch (error) {
            toast.error(
                error.response?.data?.message ||
                error.response?.data?.error ||
                'Đã có lỗi xảy ra, vui lòng thử lại sau'
            );
        }
    };

    return (
        <>
            <title>Đăng ký</title>

            <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100 flex items-center justify-center p-4">
                <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8">
                    <div className="text-center mb-6">
                        <h1 className="text-3xl font-bold text-green-800 mb-2">Đăng ký</h1>
                        <p className="text-gray-600">Tạo tài khoản mới của bạn trên <Link to="/products" className="text-blue-400 hover:underline hover:text-blue-600">web</Link></p>
                    </div>

                    {/* handleSubmit tự động preventDefault reload trang của form và validate input data trước khi gọi onSubmit */}
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                        {/* Email Field */}
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">Email <span className="text-red-500">*</span></label>
                            <input
                                type="email"
                                id="email"
                                {...register('email')}   // copy các thuộc tính (gồm hàm và giá trị) của đối tượng trả về của hàm register('email') cho input email
                                className={`w-full px-4 py-3 rounded-lg border ${errors.email ? 'border-red-500 bg-red-50' : 'border-gray-300'} focus:outline-none focus:ring-2 focus:ring-emerald-500 transition placeholder-gray-400`}
                                placeholder="example@email.com"
                            />
                            {errors.email && (
                                <p className="mt-1 text-sm text-red-500 flex items-center">
                                    <span className="mr-1">⚠</span> {errors.email.message}
                                </p>
                            )}
                        </div>

                        {/* Username Field */}
                        <div>
                            <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-2">Tên người dùng <span className="text-red-500">*</span></label>
                            <input
                                type="text"
                                id="username"
                                {...register('username')}
                                className={`w-full px-4 py-3 rounded-lg border ${errors.username ? 'border-red-500 bg-red-50' : 'border-gray-300'} focus:outline-none focus:ring-2 focus:ring-emerald-500 transition placeholder-gray-400`}
                                placeholder="Nhập tên người dùng"
                            />
                            {errors.username && (
                                <p className="mt-1 text-sm text-red-500 flex items-center">
                                    <span className="mr-1">⚠</span> {errors.username.message}
                                </p>
                            )}
                        </div>

                        {/* Password Field */}
                        <div className="relative">
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">Mật khẩu <span className="text-red-500">*</span></label>
                            <input
                                type={showPassword ? 'text' : 'password'}
                                id="password"
                                {...register('password')}
                                className={`w-full px-4 py-3 rounded-lg border ${errors.password ? 'border-red-500 bg-red-50' : 'border-gray-300'} focus:outline-none focus:ring-2 focus:ring-emerald-500 transition placeholder-gray-400`}
                                placeholder="Nhập mật khẩu"
                            />
                            <button type="button" tabIndex={-1} onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 right-0 top-7 px-3 flex items-center text-gray-500">
                                {showPassword ? (
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                                    </svg>
                                ) : (
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.243 4.243L6.228 6.228" />
                                    </svg>
                                )}
                            </button>
                        </div>
                        {errors.password && (
                            <p className="-mt-4 text-sm text-red-500 flex items-center">
                                <span className="mr-1">⚠</span> {errors.password.message}
                            </p>
                        )}

                        {/* Confirm Password Field */}
                        <div className="relative">
                            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">Xác nhận mật khẩu <span className="text-red-500">*</span></label>
                            <input
                                type={showConfirmPassword ? 'text' : 'password'}
                                id="confirmPassword"
                                {...register('confirmPassword')}
                                className={`w-full px-4 py-3 rounded-lg border ${errors.confirmPassword ? 'border-red-500 bg-red-50' : 'border-gray-300'} focus:outline-none focus:ring-2 focus:ring-emerald-500 transition placeholder-gray-400`}
                                placeholder="Nhập lại mật khẩu"
                            />
                            <button type="button" tabIndex={-1} onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute inset-y-0 right-0 top-7 px-3 flex items-center text-gray-500">
                                {showConfirmPassword ? (
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                                    </svg>
                                ) : (
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.243 4.243L6.228 6.228" />
                                    </svg>
                                )}
                            </button>
                        </div>
                        {errors.confirmPassword && (
                            <p className="-mt-4 text-sm text-red-500 flex items-center">
                                <span className="mr-1">⚠</span> {errors.confirmPassword.message}
                            </p>
                        )}

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full bg-green-800 text-white py-3 rounded-lg font-semibold hover:bg-green-900 transition duration-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                        >{isSubmitting ? 'Đang xử lý...' : 'Đăng ký'}</button>
                    </form>

                    {/* Login Link */}
                    <div className="mt-6 text-center">
                        <p className="text-gray-600">Đã có tài khoản?{' '}
                            <Link to="/signin" className="text-green-800 font-semibold hover:underline">Đăng nhập</Link>
                        </p>
                    </div>
                </div>
            </div>
        </>
    );
};

export default SignUpPage;
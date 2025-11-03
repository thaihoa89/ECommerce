import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { axiosPublic } from '../utils/axiosInstance';
import useAuthenStore from '../store/authenStore';

const signInSchema = z.object({
    username: z.string().min(2, 'Tên đăng nhập phải có ít nhât 2 ký tự'),
    password: z.string().min(6, 'Mật khẩu phải có ít nhất 6 ký tự')
});

const SignInPage = () => {
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();
    const login = useAuthenStore((state) => state.login);   // Lấy action login từ global store

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
        reset
    } = useForm({
        resolver: zodResolver(signInSchema),
        mode: 'onSubmit',
        defaultValues: {
            username: '',
            password: ''
        }
    });

    const onSubmit = async (data) => {
        try {
            const res = await axiosPublic.post('/authen/login', data);
            if (res.status === 200) {
                localStorage.setItem('accessToken', res.data.token);
                login(res.data.user);   // Gọi action login và truyền vào thông tin user
                toast.success('Đăng nhập thành công! Đang chuyển hướng đến trang chủ...');
                reset();
                navigate('/products');
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
            <title>Đăng nhập</title>

            <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100 flex items-center justify-center p-4">
                <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8">
                    <div className="text-center mb-6">
                        <h1 className="text-3xl font-bold text-green-800 mb-2">Đăng nhập</h1>
                        <p className="text-gray-600">Chào mừng trở lại! Đăng nhập vào tài khoản của bạn</p>
                    </div>

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
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

                        <div className="relative">
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">Mật khẩu <span className="text-red-500">*</span></label>
                            <input
                                type={showPassword ? 'text' : 'password'}
                                id="password"
                                {...register('password')}
                                className={`w-full px-4 py-3 rounded-lg border ${errors.password ? 'border-red-500 bg-red-50' : 'border-gray-300'} focus:outline-none focus:ring-2 focus:ring-emerald-500 transition placeholder-gray-400`}
                                placeholder="Nhập mật khẩu"
                            />
                            <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 right-0 top-7 px-3 flex items-center text-gray-500">
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

                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full bg-green-800 text-white py-3 rounded-lg font-semibold hover:bg-green-900 transition duration-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                        >{isSubmitting ? 'Đang xử lý...' : 'Đăng nhập'}</button>
                    </form>

                    <div className="mt-6 text-center">
                        <p className="text-gray-600">Chưa có tài khoản?{' '}
                            <Link to="/signup" className="text-green-800 font-semibold hover:underline">Đăng ký</Link>
                        </p>
                    </div>
                </div>
            </div>
        </>
    );
};

export default SignInPage;
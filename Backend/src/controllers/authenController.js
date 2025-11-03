import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';   // Không phải cài
import User from '../models/user.js';
import Session from "../models/session.js";
import validatePassword from '../utils/validatePassword.js';

const JWT_TTL = '15m';
const REFRESH_TOKEN_TTL = 7 * 24 * 60 * 60 * 1000;

export const register = async (req, res) => {
    try {
        const { email, password, username } = req.body;

        // Validate password
        const passwordValidation = validatePassword(password);
        if (!passwordValidation.isValid) {
            return res.status(400).json({
                success: false,
                errors: passwordValidation.errors
            });
        }

        // Kiểm tra email đã tồn tại
        if (!email) {
            return res.status(400).json({
                message: 'Thiếu email'
            })
        } else {
            const existingEmail = await User.findOne({ email });
            if (existingEmail) {
                return res.status(400).json({
                    success: false,
                    message: 'Email đã được sử dụng'
                });
            }
        }

        // Kiểm tra username đã tồn tại
        if (!username) {
            return res.status(400).json({
                message: 'Thiếu username'
            })
        } else {
            const existingUsername = await User.findOne({ username });
            if (existingUsername) {
                return res.status(400).json({
                    success: false,
                    message: 'Username đã được sử dụng'
                });
            }
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Tạo user mới trong Nodejs
        const user = new User({
            email,
            password: hashedPassword,
            username
        });

        // Gửi dữ liệu đến MongoDB, MongoDB gán _id và Mongoose cập nhật _id vào object user
        await user.save();

        // Tạo JWT token
        // const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: JWT_TTL });

        // Vì đăng ký xong vẫn phải đăng nhập nên chưa tạo refresh token trong logic xử lý register
        res.status(201).json({
            success: true,
            message: 'Đăng ký thành công',
            // token,
            user: {
                id: user._id,
                email: user.email,
                username: user.username
            }
        });

    } catch (error) {
        // Nếu dữ liệu .save() không hợp lệ theo schema, Mongoose ném ra lỗi có kiểu ValidationError
        if (error.name === 'ValidationError') {
            console.log('Lỗi dữ liệu không hợp lệ theo schema: ', error.message)
            const errors = Object.values(error.errors).map(err => err.message);
            // Object.values(obj) chuyển tất cả value của các trường của obj thành 1 mảng theo thứ tự các trường trong obj
            return res.status(400).json({
                success: false,
                message: 'Thông tin đăng ký không hợp lệ',
                errors: error.message
            });
        }

        res.status(500).json({
            success: false,
            message: 'Lỗi server',
            error: error.message
        });
    }
};

export const login = async (req, res) => {
    try {
        const { username, password } = req.body;

        // Validate input
        if (!username || !password) {
            return res.status(400).json({
                success: false,
                message: 'Vui lòng nhập username và mật khẩu'
            });
        }

        // Tìm user theo username
        const user = await User.findOne({username});
        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'Username hoặc mật khẩu không đúng'
            });
        }

        // So sánh password
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({
                success: false,
                message: 'Username hoặc mật khẩu không đúng'
            });
        }

        // Tạo JWT token: jwt.sign(payload, #secretKey, {expiresIn})
        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: JWT_TTL });   // node -> require('crypto').randomBytes(64).toString('hex') -> Ctrl+C

        // Tạo refresh token
        const refreshToken = crypto.randomBytes(64).toString('hex')

        /*
            Lưu refresh token vào db vì nó sống lâu và để có cách vô hiệu nó. JWT token chỉ sống 15m nên không cần thiết phải lưu vào db.
            Refresh token phải dùng với sessionSchema vì nếu dùng với thư viện express-session thì Single Page App không thể chỉ dùng header
            Authorzation mà phải dùng thêm cả cookie để gửi session ID, hơn nữa dùng thư viện express-session thì mặc định lưu session store
            trong bộ nhớ RAM của server, nếu muốn lưu session store trong MongoDB phải cài thêm thư viện connect-mongo. Dùng sessionSchema
            thì phải có trường userID để liên kết session với user.
        */
        await Session.create({
            userId: user._id,
            refreshToken,
            expiresAt: new Date(Date.now() + REFRESH_TOKEN_TTL)
        });

        // Gửi refresh token về client trong cookie
        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,     // Cookie không thể bị truy cập bởi javascript ở browser
            secure: true,       // HTTPS
            sameSite: 'none',   // cho phép backend, frontend deploy trên 2 domain khác nhau
            maxAge: REFRESH_TOKEN_TTL
        })

        // Gửi JWT token về client trong body response
        res.status(200).json({
            success: true,
            message: 'Đăng nhập thành công',
            token,
            user: {
                id: user._id,
                email: user.email,
                username: user.username
            }
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Lỗi server',
            error: error.message
        });
    }
};

export const signOut = async (req, res) => {
   try {
        // Lấy refresh token từ cookie
        const refreshToken = req.cookies?.refreshToken;
        if (refreshToken) {
            // Xóa refresh token trong Session → xóa luôn session trong db
            await Session.deleteOne({ refreshToken });

            // Xóa cookie refresh token phía browser
            res.clearCookie('refreshToken')
        }

        // Gửi mã trạng thái HTTP báo đăng xuất thành công và không gửi dữ liệu gì về hết
        return res.sendStatus(204);

        // Chỉ xử lý refresh token phía server còn JWT token sẽ xử lý phía client
   } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Lỗi server',
            error: error.message
        });
   } 
};

export const refreshToken = async (req, res) => {
    try {
        // Lấy refresh token từ cookie
        const refreshToken = req.cookies?.refreshToken;
        if (!refreshToken) {
            return res.status(401).json({
                success: false,
                message: 'Thiếu refresh token'
            });
        }

        // Tra refresh token trong db ở session nào
        const session = await Session.findOne({ refreshToken });
        if (!session) {
            return res.status(403).json({
                success: false,
                message: 'Refresh token không hợp lệ hoặc đã bị thu hồi'
            });
        }

        // Lấy thông tin user của session tương ứng
        const user = await User.findById(session.userId);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'Không tìm thấy người dùng'
            });
        }

        // Tạo JWT token mới
        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: JWT_TTL });

        // Gửi JWT token về client trong body response
        res.status(200).json({
            success: true,
            message: 'Tạo JWT token mới thành công',
            token,
            user: {
                id: user._id,
                email: user.email,
                username: user.username
            }
        });
    } catch (error) {
        console.error('Refresh error:', error);
        res.status(500).json({
            success: false,
            message: 'Lỗi khi refresh token',
            error: error.message
        });
    }
};
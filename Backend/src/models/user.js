import mongoose from "mongoose";
import validator from "validator";
import Cart from './cart.js';
import Session from './session.js';

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: [true, 'Email là bắt buộc'],
        unique: true,
        trim: true,
        validate: {
            validator: function (value) {
                return validator.isEmail(value);
            },
            message: 'Email không hợp lệ'
        }
    },
    password: {
        type: String,
        required: [true, 'Mật khẩu là bắt buộc'],
    },
    username: {
        type: String,
        required: [true, 'Username là bắt buộc'],
        unique: true,
        trim: true,
        minlength: [2, 'Username phải có ít nhất 2 ký tự'],
        maxlength: [30, 'Username không được quá 30 ký tự'],
        validate: {
            validator: function (value) {
                return /^[a-zA-Z0-9_]+$/.test(value);
            },
            message: 'Username chỉ được chứa chữ cái, số và dấu gạch dưới'
        }
    }
}, {
    timestamps: true
});

// Hàm callback của middleware cho model
const callbackMiddleware = async function (next) {   // pre là chạy trước khi lệnh chính thực hiện, post middleware là chạy sau
    try {
        const user = await this.model.findOne(this.getFilter());   // this là query đang thực hiện, this.getFilter() lấy điều kiện lọc của query là { _id: ...}
        if (user) {
            await Cart.findOneAndDelete({ userId: user._id });
            await Session.deleteMany({ userId: user._id });
        }

        // Gọi next() để tiếp tục thực hiện lệnh chính thực sự để xóa chính user sau khi đã xóa giỏ hàng và các session của user
        next();
    } catch (error) {   // Nếu có lỗi xảy ra, catch sẽ gọi next(error) để Mongoose biết và dừng query
        next(error);
    }
};

/*
    Middleware pre áp dụng trước khi thực hiện findOneAndDelete() trên model User để xóa cart và sessions.
    findByIdAndDelete() không trigger middleware pre vì nó là một phương thức tiện ích và có thể không
    trigger middleware pre trong một số phiên bản Mongoose (findByIdAndDelete() thực chất gọi findOneAndDelete()
    bên dưới, nhưng không phải tất cả phiên bản Mongoose đều trigger hook này). Thay vào đó, hãy sử dụng findOneAndDelete().
*/
userSchema.pre('findOneAndDelete', callbackMiddleware);

const User = mongoose.model('User', userSchema);
export default User;
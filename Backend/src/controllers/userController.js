import User from '../models/user.js';
import Cart from '../models/cart.js';
import Session from '../models/session.js';

export const getMe = async (req, res) => {
    try {
        res.status(200).json({
            success: true,
            user: req.user
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Lỗi server',
            error: error.message
        });
    }
};

export const deleteMe = async (req, res) => {
    try {
        // Xóa user
        const user = await User.findOneAndDelete({ _id: req.user._id});
        if (!user) {
            return res.status(404).json({
                message: 'Không tìm thấy user để xóa'
            });
        }

        // Xóa giỏ hàng tương ứng với user
        // await Cart.findOneAndDelete({ userId: req.user._id });

        // Xóa các session tương ứng với user
        // await Session.deleteMany({ userId: req.user._id });

        res.status(200).json({
            message: 'Đã xóa user thành công',
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Lỗi server',
            error: error.message
        });
    }
}
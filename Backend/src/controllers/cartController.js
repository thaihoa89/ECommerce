import Cart from '../models/cart.js';
import Product from '../models/product.js';

// Lấy thông tin giỏ hàng
export const getCart = async (req, res) => {
    const userId = req.user._id;
    try {
        const cart = await Cart.findOne({ userId }).populate('items.productId', 'name price imageUrl'); // Lấy thêm thông tin chi tiết của sản phẩm
        if (!cart) {
            return res.status(404).json({ message: 'Không tìm thấy giỏ hàng' });
        }
        res.status(200).json(cart);
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Lỗi server',
            error: error.message
        });
    }
};

// Thêm sản phẩm vào giỏ hàng
export const addToCart = async (req, res) => {
    const { productId, quantity } = req.body;
    const userId = req.user._id; // Lấy từ middleware xác thực

    try {
        // Kiểm tra xem sản phẩm có tồn tại không
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ message: 'Sản phẩm không tồn tại' });
        }

        // Tìm giỏ hàng của user theo userId là một lựa chọn hiệu quả và an toàn nhất
        let cart = await Cart.findOne({ userId });
        if (!cart) {
            cart = new Cart({ userId, items: [] });
        }

        // Kiểm tra xem sản phẩm đã có trong giỏ hàng chưa
        const itemIndex = cart.items.findIndex(item => item.productId.toString() === productId);
        if (itemIndex > -1) {
            // Nếu sản phẩm đã có, cập nhật số lượng
            cart.items[itemIndex].quantity += quantity || 1;
        } else {
            // Nếu sản phẩm chưa có, thêm mới vào giỏ hàng
            cart.items.push({
                productId,
                quantity: quantity || 1,
                price: product.price // Lưu lại giá sản phẩm tại thời điểm thêm
            });
        }

        await cart.save();

        res.status(200).json({
            message: 'Thêm sản phẩm vào giỏ hàng thành công',
            cart
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Lỗi server',
            error: error.message
        });
    }
};

// Thay đổi số lượng sản phẩm trong giỏ hàng
export const updateItemQuantity = async (req, res) => {
    const productId = req.params.id; // Lấy productId từ req.params
    const { quantity } = req.body;
    const userId = req.user._id;

    if (quantity <= 0) {
        return removeFromCart(req, res); // Nếu số lượng <= 0 thì xóa sản phẩm
    }

    try {
        const cart = await Cart.findOne({ userId });
        if (!cart) {
            return res.status(404).json({ message: 'Không tìm thấy giỏ hàng' });
        }

        const itemIndex = cart.items.findIndex(item => item.productId.toString() === productId);

        if (itemIndex > -1) {
            cart.items[itemIndex].quantity = quantity;
            await cart.save();
            res.status(200).json({ message: 'Cập nhật số lượng thành công', cart });
        } else {
            res.status(404).json({ message: 'Sản phẩm không có trong giỏ hàng' });
        }
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Lỗi server',
            error: error.message
        });
    }
};

// Xóa 1 sản phẩm khỏi giỏ hàng
export const removeFromCart = async (req, res) => {
    const productId = req.params.id; // Lấy productId từ req.params
    const userId = req.user._id;

    try {
        const cart = await Cart.findOne({ userId });
        if (!cart) {
            return res.status(404).json({ message: 'Không tìm thấy giỏ hàng' });
        }

        const itemIndex = cart.items.findIndex(item => item.productId.toString() === productId);

        if (itemIndex > -1) {
            cart.items.splice(itemIndex, 1); // Xóa 1 sản phẩm tính từ vị trí start là itemIndex khỏi mảng items
            await cart.save();
            res.status(200).json({ message: 'Xóa sản phẩm khỏi giỏ hàng thành công', cart });
        } else {
            res.status(404).json({ message: 'Sản phẩm không có trong giỏ hàng' });
        }
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Lỗi server',
            error: error.message
        });
    }
};

// Xóa tất cả sản phẩm khỏi giỏ hàng
export const clearCart = async (req, res) => {
    const userId = req.user._id;

    try {
        const cart = await Cart.findOne({ userId });
        if (!cart) {
            return res.status(404).json({
                message: 'Không tìm thấy giỏ hàng'
            });
        }

        cart.items = [];
        await cart.save();

        res.status(200).json({
            message: 'Đã xóa tất cả sản phẩm khỏi giỏ hàng',
            cart
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Lỗi server',
            error: error.message
        });
    }
}

// Xóa luôn giỏ hàng
export const deleteCart = async (req, res) => {
    const userId = req.user._id;

    try {
        const cart = await Cart.findOneAndDelete({ userId });
        if (!cart) {
            return res.status(404).json({
                message: 'Không tìm thấy giỏ hàng để xóa'
            });
        }

        res.status(200).json({
            message: 'Đã xóa giỏ hàng thành công',
            cart
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Lỗi server',
            error: error.message
        });
    }
}
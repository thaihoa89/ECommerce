import mongoose from "mongoose";

const cartItemSchema = new mongoose.Schema({
    productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',   // trỏ đến model Product (là ánh xạ tới collection products)
        required: true,
    },
    quantity: {
        type: Number,
        default: 1,
        require: true,
        trim: true
    },
    price: {
        type: Number,
        required: true,   // Lưu giá tại thời điểm thêm vào giỏ (phòng giá sản phẩm thay đổi)
        trim: true
    },
});

const cartSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        unique: true,   // mỗi user chỉ có 1 giỏ hàng đang mở
    },
    items: [cartItemSchema],   // trường items là 1 mảng với mỗi phần tử là 1 object có cấu trúc theo cartItemSchema
}, {
    timestamps: true
});

const Cart = mongoose.model('Cart', cartSchema);

export default Cart;
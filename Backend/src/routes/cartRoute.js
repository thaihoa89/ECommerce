import express from 'express';
import { addToCart, getCart, updateItemQuantity, removeFromCart, clearCart, deleteCart } from '../controllers/cartController.js';

const router = express.Router();

// GET /cart - Lấy thông tin giỏ hàng
router.get('', getCart);

// POST /cart - Thêm sản phẩm vào giỏ hàng
router.post('', addToCart);

// PUT /cart/items/:id - Cập nhật số lượng sản phẩm
router.put('/items/:id', updateItemQuantity);

// DELETE /cart/items/:id - Xóa 1 sản phẩm khỏi giỏ hàng
router.delete('/items/:id', removeFromCart);

// DELETE /cart/items/:id - Xóa tất cả sản phẩm khỏi giỏ hàng
router.delete('/items', clearCart);

// DELETE /cart - Xóa giỏ hàng
router.delete('', deleteCart);

export default router;
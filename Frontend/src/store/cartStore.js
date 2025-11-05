import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { toast } from 'sonner';
import { axiosInstance } from '../utils/axiosInstance';
import useAuthenStore from './authenStore';

const useCartStore = create(persist(
    (set) => ({
        cart: null,
        cartItemCount: 0,

        // Fetch cart from server
        fetchCart: async () => {
            const { isLoggedIn } = useAuthenStore.getState();
            if (!isLoggedIn) return;

            try {
                const res = await axiosInstance.get('/cart');
                const cart = res.data;
                set({
                    cart: cart,
                    cartItemCount: cart.items.reduce((total, item) => total + item.quantity, 0)
                });
            } catch (error) {
                if (error.response && error.response.status === 404) {
                    set({ cart: { items: [] }, cartItemCount: 0 });
                } else {
                    console.error('Failed to fetch cart:', error);
                }
            }
        },

        // Add item to cart
        addToCart: async (productId, quantity = 1) => {
            const { isLoggedIn } = useAuthenStore.getState();
            if (!isLoggedIn) {
                toast.error('Bạn cần đăng nhập để thực hiện chức năng này');
                // Dispatch custom event to notify App component
                window.dispatchEvent(new CustomEvent('auth:unauthorized'));
                return;
            }

            try {
                const response = await axiosInstance.post('/cart', { productId, quantity });
                const updatedCart = response.data.cart;
                set({
                    cart: updatedCart,
                    cartItemCount: updatedCart.items.reduce((total, item) => total + item.quantity, 0)
                });
                toast.success(response.data.message || 'Đã thêm sản phẩm vào giỏ hàng thành công!');
            } catch (error) {
                console.error('Failed to add to cart:', error);
                let errorMessage = 'Thêm vào giỏ hàng thất bại!'; // Default message
                if (error.response) {
                    // We have a response from the server
                    const serverMessage = error.response.data?.message || JSON.stringify(error.response.data);
                    errorMessage = `Lỗi từ server (${error.response.status}): ${serverMessage}`;
                } else if (error.request) {
                    // The request was made but no response was received
                    errorMessage = 'Không nhận được phản hồi từ server. Vui lòng kiểm tra kết nối mạng.';
                } else {
                    // Something happened in setting up the request that triggered an Error
                    errorMessage = `Lỗi khi gửi yêu cầu: ${error.message}`;
                }
                toast.error(errorMessage);
            }
        },

        // Clear cart on logout
        clearCart: () => set({ cart: null, cartItemCount: 0 }),
    }),
    {
        name: 'cart-state',
    }
));

// Clear cart when user logs out
useAuthenStore.subscribe(   // Khi gọi subcribe sẽ đăng ký 1 callback lắng nghe mọi thay đổi của global state của store
    (state, prevState) => {
        if (prevState.isLoggedIn && !state.isLoggedIn) {
            useCartStore.getState().clearCart();
        }
    }
);

export default useCartStore;
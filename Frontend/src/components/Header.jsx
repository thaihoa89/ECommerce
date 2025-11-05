import { Link, useLocation } from 'react-router-dom';
import useAuthenStore from '../store/authenStore.js';
import useCartStore from '../store/cartStore.js';
import { useEffect } from 'react';

const Header = () => {
    const isLoggedIn = useAuthenStore((state) => state.isLoggedIn);
    const cartItemCount = useCartStore((state) => state.cartItemCount);
    const fetchCart = useCartStore((state) => state.fetchCart);

    const location = useLocation();
    const isCartPage = location.pathname === '/cart';

    useEffect(() => {
        if (isLoggedIn) {
            fetchCart();
        }
    }, [isLoggedIn, fetchCart]);

    return (
        <header className="bg-green-800 text-white p-4 flex justify-between items-center">
            <Link to="/products" className="h-10 flex items-center text-xl font-bold">Nguyễn Thái Hòa</Link>
            {isCartPage ? (
                <h2 className="h-10 leading-10 text-xl font-bold">Thanh toán ({cartItemCount} mục)</h2>
            ) : (
                <input type="text" className="w-[50vw] h-10 px-3 mx-2 rounded-full text-black bg-white focus:outline-none focus:ring-2 focus:ring-white/50 placeholder-gray-400" placeholder="Tìm kiếm sản phẩm" />
            )}
            {isLoggedIn ? (
                !isCartPage && <Link to="/cart">
                    <button id="cart" className="bg-white text-blue-600 px-3 py-1 rounded group cursor-pointer">🛒 Giỏ <span className="font-bold group-hover:underline">(<span id="cart-count">{cartItemCount}</span>)</span></button>
                </Link>
            ) : (
                <Link to="/signup" className="bg-white text-blue-600 font-medium px-4 py-1.5 rounded shadow-sm hover:shadow-md hover:text-blue-800 transition duration-200">Đăng ký</Link>
            )}
        </header>
    );
};

export default Header;
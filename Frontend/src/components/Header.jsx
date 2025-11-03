import { Link } from 'react-router-dom';
import useAuthenStore from '../store/authenStore.js';

const Header = () => {
    const isLoggedIn = useAuthenStore((state) => state.isLoggedIn);

    return (
        <header className="bg-green-800 text-white p-4 flex justify-between items-center">
            <Link to="/products" className="text-xl font-bold">Nguyễn Thái Hòa</Link>
            <input type="text" className="w-[50vw] h-10 px-3 mx-2 rounded-full text-black bg-white focus:outline-none focus:ring-3" placeholder="Tìm kiếm sản phẩm" />
            {isLoggedIn ? (
                <button id="cart" className="bg-white text-blue-600 px-3 py-1 rounded cursor-pointer group">🛒 Giỏ <span className="font-bold group-hover:underline">(<span id="cart-count">0</span>)</span></button>
            ) : (
                <Link to="/signup" className="bg-white text-blue-600 font-medium px-4 py-1.5 rounded shadow-sm hover:shadow-md hover:text-blue-800 transition duration-200">Đăng ký</Link>
            )}
        </header>
    );
};

export default Header;
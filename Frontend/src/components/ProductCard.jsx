import { Link } from 'react-router-dom';
import renderRating from '../utils/renderRating';
import useCartStore from '../store/cartStore';
import { useState } from 'react';

const ProductCard = ({ product }) => {
    const { name, brand, imageUrl, rating, ratingCount, price } = product;
    const addToCart = useCartStore((state) => state.addToCart);
    const [quantity, setQuantity] = useState(1);

    return (
        <div className="border rounded-lg p-2 shadow hover:shadow-lg flex flex-col">
            <Link to={`/products/${product.id}`} className="flex-grow">
                <img src={imageUrl} alt={name} className="w-full h-40 object-cover rounded" loading="lazy" />
                <h3 className="font-bold mt-2 line-clamp-2 h-12">{name}</h3>
                <p className="text-sm text-gray-600 truncate">{brand}</p>
                <div className="rating flex items-center truncate text-xs relative">
                    <span className='mr-1'>{rating.toFixed(1)}</span>
                    {renderRating(rating)}
                    <span className='ml-1'>({ratingCount})</span>
                </div>
                <p className="text-red-600 font-semibold truncate">{price.toLocaleString('vi-VN')} đ</p>
            </Link>
            <div className="flex w-full space-x-2 mt-2">
                <button 
                    className="bg-blue-600 text-white h-9 rounded flex-[3] truncate hover:bg-blue-700 active:bg-blue-900 active:scale-95 transition cursor-pointer" 
                    style={{ padding: '2%', fontSize: 'clamp(0.6rem, 0.8vw, 1rem)' }}
                    onClick={() => {addToCart(product._id, quantity);}}
                >Thêm vào giỏ</button>
                <select 
                    className="border h-9 rounded flex-1" 
                    style={{ padding: '3%', fontSize: 'clamp(0.6rem, 0.8vw, 1rem)' }}
                    value={quantity}
                    onChange={(e) => setQuantity(parseInt(e.target.value))}
                >{[...Array(10).keys()].map(i => <option key={i} value={i + 1}>{i + 1}</option>)}</select>
            </div>
        </div>
    );
};

export default ProductCard;
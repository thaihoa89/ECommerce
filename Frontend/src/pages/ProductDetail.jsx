import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';   // Lấy tham số của dynamic route
import { axiosPublic } from '../utils/axiosInstance';
import renderRating from '../utils/renderRating';

const ProductDetail = () => {
    const { id } = useParams();
    const [product, setProduct] = useState(null);

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const { data } = await axiosPublic.get(`/products/${id}`);
                setProduct(data);
            } catch (error) {
                setProduct(null);
                console.error(`Error fetching product ${id}:`, error);
            }
        };

        fetchProduct();
    }, [id]);

    if (!product) return <div>Loading...</div>;

    return (
        <>
            <title>Chi tiết</title>
            
            <div className="w-full xl:max-w-[1000px] 2xl:max-w-[1400px] mx-auto">
                {/* Breadcrumb */}
                <nav className="text-sm text-gray-500 mt-4 mb-3 px-4 w-full">
                    <ul className="flex flex-wrap items-center gap-2">
                        <li><Link to="/products" className="hover:text-blue-600">Trang chủ</Link></li>
                        <li>›</li>
                        <li><Link to={`/products?category=${encodeURIComponent(product.category)}`} className="hover:text-blue-600">{product.category}</Link></li>
                        <li>›</li>
                        {/* Might want to create routes for subcategories later */}
                        <li><span className="hover:text-blue-600 cursor-pointer">{product.subcategory}</span></li>
                        <li>›</li>
                        <li className="text-gray-700 font-semibold">{product.name}</li>
                    </ul>
                </nav>
                {/* Product Detail */}
                <section className="bg-white rounded-md grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-8 lg:gap-12 p-4 sm:p-6 lg:p-10 mb-10 w-full items-start">
                    {/* Left: Product Image */}
                    <div className="w-full">
                        <div className="w-full h-64 sm:h-80 md:h-[400px] lg:h-[500px] bg-gray-100 rounded-md flex items-center justify-center overflow-hidden">
                            <img src={`/${product.imageUrl}`} alt={product.name} className="max-w-full max-h-full object-contain" />
                        </div>
                    </div>
                    {/* Right: Product Info */}
                    <div className="w-full">
                        <h1 className="text-lg sm:text-2xl lg:text-3xl font-semibold text-gray-800">{product.name}</h1>
                        <div className="mt-2 text-xs sm:text-sm lg:text-base text-gray-600">Thương hiệu: <span className="font-medium text-gray-700">{product.brand}</span></div>
                        <div className="mt-3 flex items-center text-base sm:text-lg">
                            <span className='mr-1'>{product.rating.toFixed(1)}</span>
                            {renderRating(product.rating)}
                            <span className='ml-1'>({product.ratingCount} bình chọn)</span>
                        </div>
                        <div className="my-4 text-red-600 text-lg sm:text-2xl lg:text-3xl font-bold">{product.price.toLocaleString('vi-VN')} VNĐ</div>
                        <p className="italic mt-3 text-xs sm:text-sm lg:text-base text-gray-500">Còn {product.stock} sản phẩm trong kho</p>
                        <div className="my-5 flex items-center gap-3 sm:gap-5">
                            <select className="border rounded h-10 px-2 sm:px-3 bg-white">
                                {[...Array(10).keys()].map(i => <option key={i + 1} value={i + 1}>{i + 1}</option>)}
                            </select>
                            <button className="bg-blue-600 text-white px-3 sm:px-5 py-2 rounded h-10 hover:bg-blue-700 active:bg-blue-900 active:scale-95 transition cursor-pointer">
                                🛒 Thêm vào giỏ
                            </button>
                        </div>
                        <p className="text-xs sm:text-sm lg:text-lg text-gray-700 leading-relaxed text-justify">{product.description}</p>
                    </div>
                </section>
            </div>
        </>
    )
}

export default ProductDetail;
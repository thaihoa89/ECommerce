import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { axiosInstance } from '../utils/axiosInstance';
import useCartStore from '../store/cartStore';
import renderRating from '../utils/renderRating';
import { useNavigate } from 'react-router-dom';

const CartPage = () => {
    const navigate = useNavigate();

    const cart = useCartStore(state => state.cart);
    const fetchCart = useCartStore(state => state.fetchCart);

    const [shippingOptions, setShippingOptions] = useState({});
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const loadCart = async () => {
            try {
                setIsLoading(true);
                setError(null);
                await fetchCart();
            } catch (err) {
                console.error('Error loading cart:', err);
                setError('Không thể tải giỏ hàng');
            } finally {
                setIsLoading(false);
            }
        };

        loadCart();
    }, [fetchCart]);

    // Khởi tạo lựa chọn giao hàng mặc định cho mỗi sản phẩm khi cart thay đổi
    useEffect(() => {
        if (cart?.items && Array.isArray(cart.items)) {
            setShippingOptions(prev => {   // prev là state shippingOptions trước khi cập nhật
                /*  Tạo một object tạm thời để giữ lại các tùy chọn giao hàng đã chọn của tất cả các sản phẩm trong giỏ
                    Object có dạng { key1: value1, key2: value2, ... } với key là các thuộc tính
                */
                const newOptions = { ...prev };
                
                cart.items.forEach(item => {
                    if (item.productId && item.productId._id) {
                        // Chỉ khởi tạo lựa chọn giao hàng mặc định là free nếu sản phẩm chưa có trong state shippingOptions
                        if (!newOptions[item.productId._id]) {
                            newOptions[item.productId._id] = {   // nếu tên key là biến thì từ cú pháp object.key chuyển sang dùng cú pháp object[key]
                                value: 0,
                                date: getDeliveredDate(7)
                            };
                        }
                    }
                });
                
                // set state shippingOptions trở thành chính đối tượng newOptions luôn
                return newOptions;   // mỗi lần cập nhật state sẽ tạo object mới spread từ object cũ + tham chiếu mới -> re-render
            });  
        }
    }, [cart?.items]);   // Effect này chạy mỗi khi mảng items của state cart thay đổi

    // Hàm lấy ngày giao hàng đến nơi theo số ngày giao hàng truyền vào
    const getDeliveredDate = (daysToAdd) => {
        const date = new Date();
        date.setDate(date.getDate() + daysToAdd);
        const weekday = date.toLocaleDateString('vi-VN', { weekday: 'long' });
        const day = date.getDate();
        const month = date.toLocaleDateString('vi-VN', { month: 'long' });
        return `${weekday}, ngày ${day} ${month}`;
    };

    // Hàm xử lý việc tăng/giảm số lượng sản phẩm trong giỏ hàng khi người dùng click nút + hoặc - bên cạnh số lượng sản phẩm
    const handleQuantityChange = async (productId, currentQuantity, change) => {   // productId ở đây là _id của product trong products
        const newQuantity = currentQuantity + change;
        
        if (newQuantity === 0) {
            handleRemoveItem(productId);
            return;
        }

        try {
            const res = await axiosInstance.put(`/cart/items/${productId}`, { quantity: newQuantity });
            await fetchCart();
            change === 1 ? (
                toast.success(res.data.message || "Tăng số lượng sản phẩm thành công")
            ) : (
                toast.success("Giảm số lượng sản phẩm thành công")
            )
        } catch (error) {
            console.error('Failed to update quantity:', error);
            toast.error(error.response?.data?.message || 'Cập nhật số lượng thất bại');
        }
    };

    //  Hàm xử lý việc xóa sản phẩm khỏi giỏ hàng khi người dùng click nút xóa bên cạnh số lượng sản phẩm
    const handleRemoveItem = async (productId) => {   // productId ở đây là _id của product trong products
        try {
            const res = await axiosInstance.delete(`/cart/items/${productId}`);
            await fetchCart();
            toast.success(res.data.message || 'Đã xóa sản phẩm khỏi giỏ hàng');
        } catch (error) {
            console.error('Failed to remove item:', error);
            toast.error(error.response?.data?.message || 'Xóa sản phẩm thất bại');
        }
    };

    // Hàm cập nhật tùy chọn giao hàng cho sản phẩm trong giỏ và lưu vào state shippingOptions
    const handleShippingChange = (product_id, value, date) => {   // product_id là _id của sản phẩm, value là phí vận chuyển, date là ngày giao hàng dự kiến
        setShippingOptions(prev => ({   // prev là state shippingOptions trước khi cập nhật
            ...prev,   // Copy tất cả properties từ prev (spread operator hoạt động cho cả mảng và object)
            [product_id]: { value: parseInt(value, 10), date }   // dùng [product_id] để key là giá trị động lấy từ biến product_id
        }));
    };

    const calculateSummary = () => {
        if (!cart?.items || !Array.isArray(cart.items)) {
            return { subtotal: 0, totalItems: 0, shippingCost: 0, totalBeforeTax: 0, tax: 0, grandTotal: 0 };
        }

        let subtotal = 0;
        let totalItems = 0;
        let shippingCost = 0;

        cart.items.forEach(item => {
            if (item.price && item.quantity) {
                subtotal += item.price * item.quantity;
                totalItems += item.quantity;
            }
            
            if (item.productId?._id) {
                const shipping = shippingOptions[item.productId._id];
                if (shipping) {
                    shippingCost += shipping.value;
                }
            }
        });

        const totalBeforeTax = subtotal + shippingCost;
        const tax = totalBeforeTax * 0.10;
        const grandTotal = totalBeforeTax + tax;

        return { subtotal, totalItems, shippingCost, totalBeforeTax, tax, grandTotal };
    };

    const handleCheckout = () => {
        toast.info('Chức năng đặt hàng đang được phát triển');
    };

    if (isLoading) {
        return (
            <div className="flex justify-center items-center min-h-[50vh]">
                <div className="text-xl text-gray-600">Đang tải giỏ hàng...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex justify-center items-center min-h-[50vh]">
                <div className="text-xl text-red-600">{error}</div>
            </div>
        );
    }

    const summary = calculateSummary();   // Gọi hàm và nhận về đối tượng trả về của hàm
    const deliveryDateFree = getDeliveredDate(7);
    const deliveryDateNormal = getDeliveredDate(5);
    const deliveryDateFast = getDeliveredDate(3);

    return (
        <div className="bg-gray-300 flex-1">
            <div className="max-w-6xl mx-auto my-6 px-4">
                {!cart?.items || !Array.isArray(cart.items) || cart.items.length === 0 ? (
                    <div className="bg-white rounded-lg p-8 text-center">
                        <p className="text-xl text-gray-600 mb-4">Giỏ hàng của bạn đang trống</p>
                        <button  onClick={() => navigate('/products')} className="bg-green-800 text-white font-semibold px-6 py-2 rounded-md hover:bg-green-900">
                            Tiếp tục mua sắm
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Cột trái - Danh sách sản phẩm */}
                        <div className="lg:col-span-2 space-y-4">
                            {cart.items.map(item => {
                                if (!item.productId) {
                                    console.error('Product not populated: ', item);
                                    return null;
                                }

                                const p = item.productId;   // Thuộc tính productId của item là 1 object vì đã được populate từ fetchCart gọi controller getCart ở backend
                                const selectedShipping = shippingOptions[p._id] || { value: 0, date: deliveryDateFree };

                                return (
                                    <div key={item._id} className="bg-white rounded-lg p-4">
                                        <h4 className="text-green-700 font-semibold mb-2">
                                            Ngày giao hàng dự kiến: {selectedShipping.date}
                                        </h4>
                                        <div className="flex flex-col sm:flex-row gap-4">
                                            <img 
                                                src={p.imageUrl || '/placeholder.png'} 
                                                className="w-36 h-36 object-cover rounded" 
                                                alt={p.name || 'Sản phẩm'}
                                            />
                                            <div className="flex-1">
                                                <button
                                                    onClick={() => navigate(`/products/${p._id}`)}
                                                    className="font-medium hover:text-green-700 text-left"
                                                >
                                                    {p.name || 'Tên sản phẩm không có'}
                                                </button>
                                                <div className="flex items-center my-1">
                                                    <span className="mr-1">{(p.rating || 0).toFixed(1)}</span>
                                                    {renderRating(p.rating || 0)}
                                                    <span className="ml-1">({p.ratingCount || 0})</span>
                                                </div>
                                                <p className="font-semibold text-red-600">
                                                    {(item.price || 0).toLocaleString('vi-VN')} VNĐ
                                                </p>
                                                <div className="flex items-center gap-2 mt-2">
                                                    <span>Số lượng:</span>
                                                    <button 
                                                        className="text-red-500 font-bold cursor-pointer px-2 hover:bg-red-50 rounded"
                                                        onClick={() => handleQuantityChange(p._id, item.quantity, -1)}
                                                    >
                                                        -
                                                    </button>
                                                    <span className="font-semibold px-2">{item.quantity || 0}</span>
                                                    <button 
                                                        className="text-green-500 font-bold cursor-pointer px-2 hover:bg-green-50 rounded"
                                                        onClick={() => handleQuantityChange(p._id, item.quantity, 1)}
                                                    >
                                                        +
                                                    </button>
                                                    <button 
                                                        className="text-red-600 ml-2 hover:underline"
                                                        onClick={() => handleRemoveItem(p._id)}
                                                    >
                                                        Xóa
                                                    </button>
                                                </div>
                                            </div>
                                            <div className="w-full sm:w-64">
                                                <p className="font-medium mb-1">Chọn tùy chọn giao hàng:</p>
                                                <label className="block cursor-pointer mb-1">
                                                    <input 
                                                        type="radio" 
                                                        name={`shipping-${p._id}`}
                                                        value="0"
                                                        checked={selectedShipping.value === 0}
                                                        onChange={(e) => handleShippingChange(p._id, e.target.value, deliveryDateFree)}
                                                    />
                                                    <span className="ml-2">{deliveryDateFree}</span>
                                                    <span className="block text-gray-500 italic text-sm ml-6">
                                                        Miễn phí vận chuyển
                                                    </span>
                                                </label>
                                                <label className="block cursor-pointer mb-1">
                                                    <input 
                                                        type="radio" 
                                                        name={`shipping-${p._id}`}
                                                        value="15000"
                                                        checked={selectedShipping.value === 15000}
                                                        onChange={(e) => handleShippingChange(p._id, e.target.value, deliveryDateNormal)}
                                                    />
                                                    <span className="ml-2">{deliveryDateNormal}</span>
                                                    <span className="block text-gray-500 italic text-sm ml-6">
                                                        Bình thường 15.000 VNĐ
                                                    </span>
                                                </label>
                                                <label className="block cursor-pointer">
                                                    <input 
                                                        type="radio" 
                                                        name={`shipping-${p._id}`}
                                                        value="30000"
                                                        checked={selectedShipping.value === 30000}
                                                        onChange={(e) => handleShippingChange(p._id, e.target.value, deliveryDateFast)}
                                                    />
                                                    <span className="ml-2">{deliveryDateFast}</span>
                                                    <span className="block text-gray-500 italic text-sm ml-6">
                                                        Nhanh 30.000 VNĐ
                                                    </span>
                                                </label>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        {/* Cột phải - Tóm tắt thanh toán */}
                        <div className="lg:col-span-1">
                            <div className="bg-white p-4 rounded-lg sticky top-4">
                                <h3 className="font-semibold mb-3">Tóm tắt thanh toán</h3>

                                <div className="grid grid-cols-[1fr_auto_auto] gap-x-2 mb-1">
                                    <span>Các mục ({summary.totalItems}):</span>
                                    <span className="text-right">{summary.subtotal.toLocaleString('vi-VN')}</span>
                                    <span>VNĐ</span>
                                </div>

                                <div className="grid grid-cols-[1fr_auto_auto] gap-x-2 mb-1">
                                    <span>Vận chuyển và xử lý:</span>
                                    <span className="text-right">{summary.shippingCost.toLocaleString('vi-VN')}</span>
                                    <span>VNĐ</span>
                                </div>

                                <div className="grid grid-cols-[1fr_auto_auto] gap-x-2 mb-1">
                                    <span>Tổng cộng trước thuế:</span>
                                    <span className="text-right">{summary.totalBeforeTax.toLocaleString('vi-VN')}</span>
                                    <span>VNĐ</span>
                                </div>

                                <div className="grid grid-cols-[1fr_auto_auto] gap-x-2 mb-1">
                                    <span>Thuế ước tính (10%):</span>
                                    <span className="text-right">{summary.tax.toLocaleString('vi-VN')}</span>
                                    <span>VNĐ</span>
                                </div>

                                <div className="grid grid-cols-[1fr_auto_auto] gap-x-2 font-bold text-green-600 text-lg mt-3">
                                    <span>Tổng đơn hàng:</span>
                                    <span className="text-right">{summary.grandTotal.toLocaleString('vi-VN')}</span>
                                    <span>VNĐ</span>
                                </div>

                                <button 
                                    className="bg-green-600 text-white px-4 py-2 rounded-md cursor-pointer mt-4 w-full hover:bg-green-700 active:bg-green-900 active:scale-95 transition"
                                    onClick={handleCheckout}
                                >
                                    Đặt hàng của bạn
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CartPage;
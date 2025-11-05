import { useState, useEffect } from 'react';          // Hook của react để quản lý trạng thái và side-effect
import { useSearchParams } from 'react-router-dom';   // Lấy tham số của query string của URL
import { axiosPublic } from '../utils/axiosInstance';
import { toast } from 'sonner';
import ProductCard from '../components/ProductCard';

// Khởi tạo component hàm
const SearchPage = () => {
    const [searchParams] = useSearchParams();   // hook này trả về 1 mảng gồm 2 phần tử: searchParams và hàm setSearchParams
    const searchQuery = searchParams.get('q') || '';   // searchParams là 1 đối tượng của lớp URLsearchParams - có cấu trúc không phơi key thuộc tính ra trực tiếp nên phải dùng phương thức get để lấy value của key thuộc tính
    
    const [products, setProducts] = useState([]);    // state lưu danh sách sản phẩm lấy về từ API
    const [loading, setLoading] = useState(false);   // state lưu trạng thái component là đang tải hay đã tải xong rồi
    const [filters, setFilters] = useState({         // state đối tượng các bộ lọc chứa các bộ lọc
        categories: [],
        priceRanges: [],
        ratings: []
    });
    const [sortBy, setSortBy] = useState('');        // state kiểu chuỗi lưu chuỗi tên cách sắp xếp

    useEffect(() => {
        // Hàm tìm nạp các sản phẩm theo từ khóa tìm kiếm
        const fetchSearchResults = async () => {
            if (!searchQuery) {
                setProducts([]);
                setLoading(false);
                return;
            }

            try {
                setLoading(true);
                const response = await axiosPublic.get(`/products/search?q=${searchQuery}`);
                setProducts(response.data || []);
                /*
                    Backend trả về mảng các sản phẩm trong body response, axios tự động parse JSON từ body response
                    thành mảng các object sản phẩm và axios tạo ra một object response với các thuộc tính trong đó
                    có thuộc tính data được gán mảng các object sản phẩm axios đã parse JSON từ body response vào
                */
            } catch (error) {
                console.error('Error fetching search results:', error);
                toast.error('Không thể tải kết quả tìm kiếm');
                setProducts([]);
            } finally {
                setLoading(false);
            }
        };

        fetchSearchResults();
    }, [searchQuery]);   // mỗi khi từ khóa tìm kiếm thay đổi, useEffect sẽ gọi lại hàm fetchSearchResults()


    // Thêm các state và useEffect cho phân trang -----------------------------------------------------------------------------
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(16); // Số sản phẩm mỗi trang
    useEffect(() => {
        setCurrentPage(1);
    }, [filters, sortBy, searchQuery]);
    useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, [currentPage]);
    //-------------------------------------------------------------------------------------------------------------------------


    // Hàm thay đổi các bộ lọc trong state đối tượng các bộ lọc
    const handleFilterChange = (filterType, value) => {   // filterType là tên key (bộ lọc) của đối tượng state filters, value là giá trị mới thêm cho key đó
        setFilters(prev => {
            const currentValues = prev[filterType];   // Lấy mảng của key (bộ lọc) của state filters
            const newValues = currentValues.includes(value)   // Mảng đó đã có value mới thêm đó chưa?
                ? currentValues.filter(v => v !== value)   // có rồi thì bỏ value đó đi rồi gán mảng còn lại cho biến newValues
                : [...currentValues, value];   // chưa có thì thêm value mới vào mảng rồi gán cho biến newValues
            return { ...prev, [filterType]: newValues };   // trả về đối tượng state filters với key (bộ lọc) đã được thay mảng mới
        });
    };

    // Hàm áp dụng các bộ lọc và sắp xếp sản phẩm theo thứ tự người dùng chỉ định
    const getFilteredProducts = () => {
        let filtered = [...products];   // lẽ ra biến tên là searchedProducts nhưng để đồng bộ với logic sau khi áp dụng bộ lọc nên đặt tên là filtered

        // Filter by categories key
        if (filters.categories.length > 0) {   // Nếu người dùng đã chọn ít nhất 1 danh mục
            filtered = filtered.filter(p => filters.categories.includes(p.category));
            /*
                array.filter(callback) nhận 1 hàm callback trả về boolean, nếu true giữ lại phần tử, nếu false loại bỏ.
                hàm callback: p => filters.categories.includes(p.category) nghĩa là với mỗi sản phẩm thì kiểm tra xem
                danh mục của sản phẩm đó có nằm trong mảng danh mục mà người dùng đã chọn không? Nếu có sản phẩm giữ lại,
                nếu không sản phẩm bị loại
            */
        }

        // Filter by price ranges key
        if (filters.priceRanges.length > 0) {   // priceRanges là mảng có thể gồm [ 'under2m', '2m-5m', '5m-10m', 'over10m' ]
            filtered = filtered.filter(p => {
                const price = p.price;
                return filters.priceRanges.some(range => {
                    if (range === 'under2m') return price < 2000000;
                    if (range === '2m-5m') return price >= 2000000 && price <= 5000000;
                    if (range === '5m-10m') return price >= 5000000 && price <= 10000000;
                    if (range === 'over10m') return price > 10000000;
                    return false;
                });
            });
            /*
                array.some(callback) dùng callback để kiểm tra xem có ít nhất 1 phần tử trong mảng thỏa mãn điều kiện không?
                Nếu có some dừng lại ngay và trả về true thì filter sẽ giữ phần tử đó lại
            */
        }

        // Filter by ratings key
        if (filters.ratings.length > 0) {   // ratings là mảng có thể gồm [ '5', '4+', '3+' ]
            filtered = filtered.filter(p => {
                return filters.ratings.some(rating => {
                    if (rating === '5') return p.rating === 5;
                    if (rating === '4+') return p.rating >= 4;
                    if (rating === '3+') return p.rating >= 3;
                    return false;
                });
            });
        }

        // Lọc xong các sản phẩm vào mảng mới filtered rồi thì sắp xếp các sản phẩm trong mảng mới filtered luôn
        if (sortBy === 'price-asc') {
            filtered.sort((a, b) => a.price - b.price);
        } else if (sortBy === 'price-desc') {
            filtered.sort((a, b) => b.price - a.price);
        } else if (sortBy === 'popular') {
            filtered.sort((a, b) => b.ratingCount - a.ratingCount);
        } else if (sortBy === 'newest') {
            filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        }
        /*
            array.sort([compare function]) - sort sử dụng nhiêu thuật toán sắp xếp khác nhau tùy theo array.
            Công thức compare function: (a, b) => a - b nghĩa là sắp xếp từ nhỏ đến lớn
                                        (a, b) => b - a nghĩa là sắp xếp từ lớn đến nhỏ 
        */

        return filtered;
    };

    const filteredProducts = getFilteredProducts();   // Gọi hàm lọc các sản phẩm tìm được rồi sắp xếp ở trên

    // Tính toán phân trang ---------------------------------------------------------------------------------------------------
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentProducts = filteredProducts.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
    //-------------------------------------------------------------------------------------------------------------------------

    /*
        space-y-1 khoảng cách giữa các phần tử con theo chiều dọc (không bao gồm phần khoảng cách bên ngoài giữa phần tử con với phần tử cha)
        gap-4 là khoảng cách giữa các phần tử con theo cả chiều dọc và chiều ngang (không bao gồm phần khoảng cách bên ngoài giữa phần tử con với phần tử cha)
        flex flex-col md:flex-row trên màn hình nhỏ là flex container theo chiều dọc, từ màn hình medium trở lên theo chiều ngang
        flex justify-between items-center thì justify-between là phần từ đầu sát đầu, phần tử cuối sát cuối, các phẩn tử giữa giàn đều khoảng cách
                                              items-center là các phần tử con căn giữa theo chiều vuông góc với chiều chính của flex container
        <div> có block-level, còn inline-block sẽ khiến div có 
        animate-spin hiệu ứng cho HTML element xoay tròn
        grid là tạo grid container
        ProductCart phải được component cha truyền prop là sản phẩm để cho ProductCart render xuống

        Array(totalPages) tạo một mảng rỗng với độ dài là totalPages
        [...Array(totalPages)]: spread operator chuyển nó thành mảng thực với các phần tử undefined
        .map( (_, index) => { ... } ): _ là biến đại diện cho giá trị phần tử (không dùng nên đặt tên _ ), index là chỉ số các phần tử: 0,1,2,3,...
    */
    return (
        <main className="p-4 flex-1">
            <div className="flex flex-col md:flex-row gap-6">
                {/* Sidebar Filter */}
                <aside className="w-full md:w-1/6 bg-gray-50 p-4 rounded-lg shadow">
                    <h2 className="text-lg font-semibold mb-3">Bộ lọc</h2>

                    {/* Filter by category */}
                    <div className="mb-4">
                        <h3 className="font-medium mb-2">Danh mục</h3>
                        <ul className="space-y-1 text-sm">
                            {['Thời Trang Nam', 'Điện Thoại & Phụ Kiện', 'Máy Tính & Laptop', 'Máy Ảnh & Máy Quay Phim', 'Thiết Bị Điện Tử', 'Đồng Hồ', 'Giày Dép Nam', 'Thiết Bị Điện Gia Dụng'].map(cat => (
                                <li key={cat}>
                                    <label className="flex items-center cursor-pointer">
                                        <input 
                                            type="checkbox" 
                                            className="mr-2"
                                            checked={filters.categories.includes(cat)}
                                            onChange={() => handleFilterChange('categories', cat)}
                                        />
                                        {cat}
                                    </label>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Filter by price */}
                    <div className="mb-4">
                        <h3 className="font-medium mb-2">Khoảng giá</h3>
                        <ul className="space-y-1 text-sm">
                            <li>
                                <label className="flex items-center cursor-pointer">
                                    <input 
                                        type="checkbox" 
                                        className="mr-2"
                                        checked={filters.priceRanges.includes('under2m')}
                                        onChange={() => handleFilterChange('priceRanges', 'under2m')}
                                    />
                                    Dưới 2 triệu
                                </label>
                            </li>
                            <li>
                                <label className="flex items-center cursor-pointer">
                                    <input 
                                        type="checkbox" 
                                        className="mr-2"
                                        checked={filters.priceRanges.includes('2m-5m')}
                                        onChange={() => handleFilterChange('priceRanges', '2m-5m')}
                                    />
                                    2 - 5 triệu
                                </label>
                            </li>
                            <li>
                                <label className="flex items-center cursor-pointer">
                                    <input 
                                        type="checkbox" 
                                        className="mr-2"
                                        checked={filters.priceRanges.includes('5m-10m')}
                                        onChange={() => handleFilterChange('priceRanges', '5m-10m')}
                                    />
                                    5 - 10 triệu
                                </label>
                            </li>
                            <li>
                                <label className="flex items-center cursor-pointer">
                                    <input 
                                        type="checkbox" 
                                        className="mr-2"
                                        checked={filters.priceRanges.includes('over10m')}
                                        onChange={() => handleFilterChange('priceRanges', 'over10m')}
                                    />
                                    Trên 10 triệu
                                </label>
                            </li>
                        </ul>
                    </div>

                    {/* Filter by rating */}
                    <div className="mb-4">
                        <h3 className="font-medium mb-2">Đánh giá</h3>
                        <ul className="space-y-1 text-sm">
                            <li>
                                <label className="flex items-center cursor-pointer">
                                    <input 
                                        type="checkbox" 
                                        className="mr-2"
                                        checked={filters.ratings.includes('5')}
                                        onChange={() => handleFilterChange('ratings', '5')}
                                    />
                                    ⭐⭐⭐⭐⭐
                                </label>
                            </li>
                            <li>
                                <label className="flex items-center cursor-pointer">
                                    <input 
                                        type="checkbox" 
                                        className="mr-2"
                                        checked={filters.ratings.includes('4+')}
                                        onChange={() => handleFilterChange('ratings', '4+')}
                                    />
                                    ⭐⭐⭐⭐ trở lên
                                </label>
                            </li>
                            <li>
                                <label className="flex items-center cursor-pointer">
                                    <input 
                                        type="checkbox" 
                                        className="mr-2"
                                        checked={filters.ratings.includes('3+')}
                                        onChange={() => handleFilterChange('ratings', '3+')}
                                    />
                                    ⭐⭐⭐ trở lên
                                </label>
                            </li>
                        </ul>
                    </div>
                </aside>

                {/* Main Products Section */}
                <section className="flex-1">

                    {/* Sort Options */}
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-lg font-semibold">
                            {searchQuery ? `Kết quả tìm kiếm cho "${searchQuery}"` : 'Kết quả tìm kiếm'}
                            <span className="text-gray-500 text-sm ml-2">({filteredProducts.length} sản phẩm)</span>
                        </h2>
                        <select
                            className="border rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-green-600"
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value)}
                        >
                            <option value="">Sắp xếp theo</option>
                            <option value="newest">Mới nhất</option>
                            <option value="price-asc">Giá: Thấp → Cao</option>
                            <option value="price-desc">Giá: Cao → Thấp</option>
                            <option value="popular">Phổ biến</option>
                        </select>
                    </div>

                    {/* Loading State */}
                    {loading && (
                        <div className="text-center py-12">
                            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
                            <p className="mt-2 text-gray-600">Đang tìm kiếm...</p>
                        </div>
                    )}

                    {/* No Results */}
                    {!loading && filteredProducts.length === 0 && (
                        <div className="text-center py-12">
                            <p className="text-gray-600 text-lg">
                                {searchQuery ? `Không tìm thấy sản phẩm nào cho "${searchQuery}"` : 'Vui lòng nhập từ khóa tìm kiếm'}
                            </p>
                        </div>
                    )}

                    {/* Product Grid - nếu bỏ phân trang thì thay currentProducts bằng filteredProducts */}
                    {!loading && currentProducts.length > 0 && (
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-8 gap-4 mb-6">
                            {currentProducts.map((product) => (
                                <ProductCard key={product._id} product={product} />
                            ))}
                        </div>
                    )}

                    {/* Pagination - nếu bỏ phân trang thì bỏ div này đi */}
                    {!loading && filteredProducts.length > 0 && (
                        <div className="flex justify-center items-center gap-2 mt-6">
                            {/* Nút Trước */}
                            <button
                                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                disabled={currentPage === 1}
                                className="px-4 py-2 border rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                « Trước
                            </button>

                            {/* Hiển thị số trang */}
                            {[...Array(totalPages)].map((_, index) => {
                                // Lặp qua từng trang một
                                const pageNumber = index + 1;
                                
                                if (   // Nếu số trang đang xét là 1 hoặc là trang cuối hoặc là ở trong khoảng từ 2 trang trước đến 2 trang sau của trang hiện tại trong state
                                    pageNumber === 1 ||
                                    pageNumber === totalPages ||
                                    (pageNumber >= currentPage - 2 && pageNumber <= currentPage + 2)
                                ) {   // Thì hiển thị nút chọn cho các số trang đó
                                    return (
                                        <button
                                            key={pageNumber}
                                            onClick={() => setCurrentPage(pageNumber)}
                                            className={`px-4 py-2 border rounded ${currentPage === pageNumber ? 'bg-green-800 text-white' : 'hover:bg-gray-100'}`}
                                        >
                                            {pageNumber}
                                        </button>
                                    );
                                } else if (   // Nếu số trang đang xét là 3 trang trước trang hiện tại trong state hoặc 3 trang sau trang hiện tại trong state
                                    pageNumber === currentPage - 3 ||
                                    pageNumber === currentPage + 3
                                ) {   // Thì hiển thị nút ba chấm cho các số trang đó
                                    return <span key={pageNumber}>...</span>;
                                }

                                // Còn lại nếu số trang đang xét là các trang còn lại không thuộc các trang trên thì không hiển thị nút gì hết
                                return null;
                            })}

                            {/* Nút Sau */}
                            <button
                                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                                disabled={currentPage === totalPages}
                                className="px-4 py-2 border rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Sau »
                            </button>
                        </div>
                    )}

                </section>
            </div>
        </main>
    );
};

export default SearchPage;
import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';   // Lấy tham số của query string
import CategoryTabs from '../components/CategoryTabs';
import ProductList from '../components/ProductList';
import { axiosPublic } from '../utils/axiosInstance';

const ProductsPage = () => {
    const [products, setProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [searchParams, setSearchParams] = useSearchParams();
    const urlCategory = searchParams.get('category');
    const [selectedCategory, setSelectedCategory] = useState(urlCategory || 'Thời Trang Nam');

    const handleSetCategory = (category) => {
        setSelectedCategory(category);
        setSearchParams({ category });
    };

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const { data } = await axiosPublic.get('/products');
                setProducts(data);
            } catch (error) {
                console.error('Error fetching products:', error);
            }
        };

        fetchProducts();
    }, []);

    useEffect(() => {
        if (products.length > 0) {
            const filtered = products.filter(p => p.category === selectedCategory);
            setFilteredProducts(filtered);
        }
    }, [products, selectedCategory]);

    return (
        <>
            <CategoryTabs selectedCategory={selectedCategory} setSelectedCategory={handleSetCategory} />
            <ProductList products={filteredProducts} />
        </>
    );
};

export default ProductsPage;
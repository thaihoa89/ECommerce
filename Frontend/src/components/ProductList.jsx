import ProductCard from './ProductCard';

const ProductList = ({ products }) => {

    return (
        <main id="content" className="p-4 border-2 border-blue-500 border-t-0">
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-4">
                {products.map(product => (
                    <ProductCard key={product.id} product={product} />
                ))}
            </div>
        </main>
    );
};

export default ProductList;
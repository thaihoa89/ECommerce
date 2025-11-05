import { Toaster } from 'sonner';
import { Routes, Route, Navigate, Outlet, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import ProductsPage from './pages/ProductsPage';
import ProductDetail from './pages/ProductDetail';
import SignUpPage from './pages/SignUpPage';
import SignInPage from './pages/SignInPage';
import ProtectedRoute from './components/ProtectedRoute';
import CartPage from './pages/CartPage';

// Tạo Layout component
const MainLayout = () => (
    <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow flex flex-col">
            {/* Outlet cho biết vị trí các component của route con sẽ được hiển thị trong component của route cha */}
            <Outlet />
        </main>
        <Footer />
    </div>
);

function App() {
    const navigate = useNavigate();

    useEffect(() => {
        const handleUnauthorized = () => {
            navigate('/signin', { replace: true });
        };
        window.addEventListener('auth:unauthorized', handleUnauthorized);
        return () => {
            window.removeEventListener('auth:unauthorized', handleUnauthorized);
        };
    }, [navigate]);

    return (
        <>
            <Toaster position="top-left" richColors />

            <Routes>
                {/* Routes không có layout */}
                <Route path="/signup" element={<SignUpPage />} />
                <Route path="/signin" element={<SignInPage />} />

                {/* Routes có layout */}
                <Route element={<MainLayout />}>
                
                    {/* public routes */}
                    <Route path="" element={<Navigate to="/products" />} />
                    <Route path="/products" element={<ProductsPage />} />
                        
                    {/* protected routes */}
                    <Route element={<ProtectedRoute />}>
                        <Route path="/products/:id" element={<ProductDetail />} />
                        <Route path="/cart" element={<CartPage />} />
                    </Route>
                    
                </Route>
            </Routes>
        </>
    )
}

export default App;
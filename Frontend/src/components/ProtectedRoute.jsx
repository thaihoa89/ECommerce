import { Navigate, Outlet } from 'react-router-dom';
import useAuthenStore from '../store/authenStore.js';

const ProtectedRoute = () => {
    const isLoggedIn = useAuthenStore((state) => state.isLoggedIn);
    return (isLoggedIn ? <Outlet /> : <Navigate to="/signin" replace />);   // replace thay thế hoàn toàn URL hiện tại trong lịch sử trình duyệt (history stack)
};

export default ProtectedRoute;
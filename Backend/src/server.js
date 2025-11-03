import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { connectDB } from './libs/db.js';
import productRoute from './routes/productRoute.js';
import authenRoute from './routes/authenRoute.js';
import userRoute from './routes/userRoute.js';
import cartRoute from './routes/cartRoute.js';
import protectedRoute from './middlewares/authoMiddleware.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;

// middlewares
app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: 'http://localhost:5173',   // chỉ cho phép frontend này
    credentials: true                  // cho phép gửi cookie/token
}));

// public routes
app.use('/products', productRoute);
app.use('/authen', authenRoute);

// protected routes
app.use('/user', protectedRoute, userRoute);
app.use('/cart', protectedRoute, cartRoute);

await connectDB();
app.listen(PORT, () => {
    console.log(`server bắt đầu trên cổng ${PORT}`);
});
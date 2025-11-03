import mongoose from "mongoose";

export const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_CONNECTION_STRING);
        console.log(`Liên kết với CSDL thành công!`);
    } catch (error) {
        console.log(`Lỗi khi kết nối CSDL: `, error);
        process.exit(1);
    }
};
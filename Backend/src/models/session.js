import mongoose from "mongoose";

const sessionSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        /*  Trường userId sẽ lưu _id của 1 document trong collection mà trường ref chỉ định,
            sau này trường userId có kiểu ObjectId sẽ chứa document khác đó */
        ref: 'User',   // Chỉ định ObjectId sẽ liên kết tới 1 document user nào đó trong collection users
        required: true,
        index: true
        /*  Mongoose tạo index cho trường userId trong MongoDB để khi query `findOne` theo userId,
            nếu có index trên userId thì MongoDB sẽ tìm document nhanh hơn rất nhiều mà không phải
            quét toàn bộ collection */
    },
    refreshToken: {
        type: String,
        required: true,
        unique: true
        /*  Bắt buộc giá trị phải duy nhất và MongoDB sẽ tự động tạo một unique index
            nên query `findOne` theo trường này cũng nhanh hơn bình thường */
    },
    expiresAt: {
        type: Date,
        required: true
    }
},{
    timestamps: true
});

// tự động xóa document session khi refresh token hết hạn.
sessionSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });
/*  
    { expiresAt: 1 } → tạo index các document session trong collection sessions theo trường expiresAt tăng dần, giúp MongoDB dễ tìm document theo thời gian hết hạn
    { expireAfterSeconds: 0 } → tự động xóa document session khi expiresAt <= hiện tại
*/

export default mongoose.model('Session', sessionSchema);
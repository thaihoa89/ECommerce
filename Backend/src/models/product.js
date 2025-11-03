import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
    id: {
        type: String,
        required: true,
        unique: true,   // MongoDb sẽ tạo index cho trường id
        trim: true,
        lowercase: true,
        index: true
    },
    name: {
        type: String,
        required: true,
        trim: true,
        // setter function khi gán giá trị lưu vào DB, getter function khi lấy giá trị từ DB
        set: value => {   // setter arrow function (vì có 1 tham số nên rút gọn ngoặc tròn) - mọi value gán cho trường này sẽ đi qua hàm này trước khi lưu vào DB
            if (!value) return value;
            return value
                .toLowerCase()
                .split(' ')
                .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                .join(' ');
        },
        validate: {   // thuộc tính để khai báo hàm kiểm tra tính hợp lệ validator
            validator: function(value) {
                // Cho phép chữ, số, dấu tiếng Việt, dấu câu phổ biến
                return /^[a-zA-Z0-9À-ỹ\s\-\(\)\,\.\/]+$/.test(value);
            },
            message: props => `${props.value} chứa ký tự không hợp lệ!`   // Kích hoạt khi validator trả về false
        }
    },
    description: {
        type: String,
        required: true,
        trim: true
    },
    category: {
        type: String,
        required: true,
        trim: true,
        index: true,
        set: value => {
            if (!value) return value;
            return value
                .toLowerCase()
                .split(' ')
                .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                .join(' ');
        }
    },
    subcategory: {
        type: String,
        required: true,
        trim: true,
        set: value => {
            if (!value) return value;
            return value
                .toLowerCase()
                .split(' ')
                .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                .join(' ');
        }
    },
    price: {
        type: Number,
        required: true,
        trim: true,
        min: [0, 'Giá không được âm']
    },
    imageUrl: {
        type: String,
        required: true,
        trim: true,
        validate: {
            validator: function(value) {
                if (!value) return true;
                return /^(https?:\/\/|\.\/|\.\.\/)/.test(value);
            },
            message: 'URL ảnh không hợp lệ'
        }
    },
    stock: {
        type: Number,
        required: true,
        trim: true,
        min: [0, 'Số lượng không được âm'],
        default: 0
    },
    rating: {
        type: Number,
        default: 0,
        required: true,
        trim: true,
        min: [0, 'Rating tối thiểu là 0'],
        max: [5, 'Rating tối đa là 5']
    },
    ratingCount: {
        type: Number,
        default: 0,
        required: true,
        trim: true,
        min: [0, 'Số lượng đánh giá không được âm']
    },
    brand: {
        type: String,
        required: true,
        trim: true,
        index: true
    },
    shopName: {
        type: String,
        required: true,
        trim: true
    },
    discount: {
        type: Number,
        min: 0,
        max: 100,
        default: 0,
        trim: true
    }
}, {
    timestamps: true
});

// Compound index cho filter phức tạp
productSchema.index({ category: 1, subcategory: 1, price: 1 });

const Product = mongoose.model('Product', productSchema);
export default Product;
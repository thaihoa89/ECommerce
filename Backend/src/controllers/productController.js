import Product from "../models/product.js";

export const getAllProduct = async (req, res) => {
    try {
        const products = await Product.find();
        return res.status(200).json(products);
    } catch (error) {
        console.error('Lỗi khi gọi getAllProduct:', error);
        return res.status(500).json({message: "Lỗi hệ thống"});
    }
};

export const getProduct = async (req, res) => {
    try {
        const id =  req.params.id;
        const product = await Product.findOne({id});
        return res.status(200).json(product);
    } catch (error) {
        console.error('Lỗi khi gọi getProduct:', error);
        return res.status(500).json({message: "Lỗi hệ thống"});
    }
};
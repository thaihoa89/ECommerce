import express from 'express';
import { getAllProduct, getProduct, search } from '../controllers/productController.js';

const router = express.Router();

router.get("", getAllProduct);

router.get("/search", search);   // Phải đặt route "/search" trước route "/:id" vì nếu không "/:id" sẽ bắt cả "/search" với id="search"

router.get("/:id", getProduct);

export default router;
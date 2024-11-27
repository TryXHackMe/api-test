import { createProduct, getAllProducts, getProductById, updateProduct, deleteProduct } from "../controllers/product.controller";
import { Router } from "express";
import { verifyToken, checkRole } from "../middlewares/auth.middleware";

const router = Router();

router.post('/product', verifyToken, checkRole('admin', 'seller'), createProduct)
router.get('/product/:id', verifyToken, checkRole('seller', 'admin'), getProductById)
router.get('/products', verifyToken, checkRole('admin', 'seller'), getAllProducts)
router.put('/product/:id', verifyToken, checkRole('admin', 'seller'), updateProduct)
router.delete('/product/:id', verifyToken, checkRole('admin', 'seller'), deleteProduct)

export default router;
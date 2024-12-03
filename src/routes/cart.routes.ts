import { Router } from 'express';
import { createCart, getCarts,updateCart, deleteCart } from '../controllers/cart.controller';
import { verifyToken, checkRole } from '../middlewares/auth.middleware';

const router = Router();

router.get('/carts', verifyToken, getCarts);
router.post('/cart', verifyToken, checkRole('seller', 'admin'), createCart);
router.put('/cart/:id', verifyToken, checkRole('seller', 'admin'), updateCart);
router.delete('/cart/:id', verifyToken, checkRole('seller', 'admin'), deleteCart);

export default router;
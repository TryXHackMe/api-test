import { Router } from 'express';
import { loginUser, refreshAccToken, registerUser } from '../controllers/auth.controller';
import { userValidate, loginValidate } from '../middlewares/validate.middleware';

const router = Router();

router.post('/login', loginValidate, loginUser);
router.post('/register', userValidate, registerUser);
router.post('/refresh-token', refreshAccToken);

export default router
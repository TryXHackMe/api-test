import { Router } from 'express';
import { loginUser, registerUser } from '../controllers/auth.controller';
import { userValidate, loginValidate } from '../middlewares/validate.middleware';

const router = Router();

router.post('/login', loginValidate, loginUser);
router.post('/register', userValidate, registerUser);

export default router
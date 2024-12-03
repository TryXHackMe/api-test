import express from 'express';
import userRoutes from './routes/user.routes';
import authRoutes from './routes/auth.routes';
import productRoutes from './routes/product.routes';
import cartRoutes from './routes/cart.routes';
import dotenv from 'dotenv'

dotenv.config();

const app = express();

app.use(express.json());
app.use('/api', userRoutes);
app.use('/api', authRoutes);
app.use('/api', productRoutes);
app.use('/api', cartRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

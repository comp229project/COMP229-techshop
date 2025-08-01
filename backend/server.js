import path from 'path';
import express from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
dotenv.config();
import { notFound, errorHandler } from './middleware/error.middleware.js';
import connectDB from './config/db.js';
import userRoutes from './routes/user.routes.js';
import authRoutes from './routes/auth.routes.js'
import productRoutes from './routes/product.routes.js'
import uploadRoutes from './routes/upload.routes.js';
import orderRoutes from './routes/order.routes.js';
import cartRoutes from './routes/cart.routes.js';

process.removeAllListeners('warning'); // suppress all warnings (optional)
// Suppress all DeprecationWarnings (optional)
process.on('warning', (warning) => {
  if (warning.name === 'DeprecationWarning') return;
  console.warn(warning); // optional: still show non-deprecation warnings
});

const port = process.env.PORT || 6000;

connectDB();

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cookieParser());

app.use('/api/users', userRoutes);
app.use('/api/auth', authRoutes)
app.use('/api/products', productRoutes)
app.use('/api/upload', uploadRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/cart', cartRoutes);
const __dirname = path.resolve();
app.use('/uploads', express.static(path.join(__dirname, '/uploads')));

if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '/frontend/build')));

  app.get('*', (req, res) =>
    res.sendFile(path.resolve(__dirname, 'frontend', 'build', 'index.html')),
  );
} else {
  app.get('/', (req, res) => {
    res.send('API is ready');
  });
}

app.use(notFound);
app.use(errorHandler);

app.listen(port, () => console.log(`Server running on port ${port}`));

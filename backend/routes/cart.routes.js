import express from 'express';
import {
  getUserCart,
  addToCart,
  removeFromCart,
} from '../controllers/cart.controller.js';
import { protect } from '../middleware/auth.middleware.js';

const router = express.Router();

router.route('/').get(protect, getUserCart).post(protect, addToCart);
router.route('/:productId').delete(protect, removeFromCart);

export default router;

import asyncHandler from '../middleware/asyncHandler.js';
import Cart from '../models/cart.model.js';
import Product from '../models/product.model.js';

// @desc    Get cart for logged in user
// @route   GET /api/cart
// @access  Private
const getUserCart = asyncHandler(async (req, res) => {
  const cart = await Cart.findOne({ user: req.user._id });

  console.log('📦 [GET] Cart requested by user:', req.user._id);

  res.json(cart || {
    cartItems: [],
    shippingAddress: {},
    paymentMethod: '',
    itemsPrice: 0,
    taxPrice: 0,
    shippingPrice: 0,
    totalPrice: 0,
  });
});

// @desc    Add item to cart (and optionally update other fields)
// @route   POST /api/cart
// @access  Private
const addToCart = asyncHandler(async (req, res) => {
  console.log('➕ ADD TO CART FOR USER:', req.user._id);

  const {
    productId,
    qty,
    shippingAddress,
    paymentMethod,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
    paymentResult,
  } = req.body;

  const product = await Product.findById(productId);
  if (!product) throw new Error('❌ Product not found');

  let cart = await Cart.findOne({ user: req.user._id });

  if (!cart) {
    cart = await Cart.create({
      user: req.user._id,
      cartItems: [{
        name: product.name,
        image: product.image,
        price: product.price,
        qty,
        product: product._id,
      }],
      shippingAddress: shippingAddress || {
        address: '',
        city: '',
        postalCode: '',
        country: '',
      },
      paymentMethod: paymentMethod || 'PayPal',
      itemsPrice: itemsPrice || 0,
      taxPrice: taxPrice || 0,
      shippingPrice: shippingPrice || 0,
      totalPrice: totalPrice || 0,
      paymentResult: paymentResult || {},
    });
    console.log('🆕 New cart created for:', req.user._id);
  } else {
    const existing = cart.cartItems.find((i) =>
      i.product.equals(product._id)
    );

    if (existing) {
      existing.qty = qty;
      console.log('🔁 Updated quantity for:', productId);
    } else {
      cart.cartItems.push({
        name: product.name,
        image: product.image,
        price: product.price,
        qty,
        product: product._id,
      });
      console.log('➕ Added product to cart:', productId);
    }

    if (shippingAddress) cart.shippingAddress = shippingAddress;
    if (paymentMethod) cart.paymentMethod = paymentMethod;
    if (itemsPrice !== undefined) cart.itemsPrice = itemsPrice;
    if (taxPrice !== undefined) cart.taxPrice = taxPrice;
    if (shippingPrice !== undefined) cart.shippingPrice = shippingPrice;
    if (totalPrice !== undefined) cart.totalPrice = totalPrice;
    if (paymentResult) cart.paymentResult = paymentResult;

    await cart.save();
  }

  console.log('💥 CART ADD API completed for:', req.user._id);
  res.status(201).json(cart);
});

// @desc    Remove product from cart
// @route   DELETE /api/cart/:productId
// @access  Private
const removeFromCart = asyncHandler(async (req, res) => {
  const cart = await Cart.findOne({ user: req.user._id });
  if (!cart) throw new Error('❌ Cart not found');

  cart.cartItems = cart.cartItems.filter(
    (i) => !i.product.equals(req.params.productId)
  );

  await cart.save();
  console.log('🗑️ Removed product', req.params.productId, 'from cart of user:', req.user._id);

  res.json(cart);
});

// @desc    Update shipping address separately
// @route   POST /api/cart/shipping
// @access  Private
const updateShippingDetails = asyncHandler(async (req, res) => {
  const { address, city, postalCode, country } = req.body;

  let cart = await Cart.findOne({ user: req.user._id });
  if (!cart) {
    res.status(404);
    throw new Error('❌ Cart not found');
  }

  cart.shippingAddress = { address, city, postalCode, country };
  const updated = await cart.save();

  console.log('🚚 Shipping address updated for:', req.user._id);
  res.status(200).json(updated);
});

export {
  getUserCart,
  addToCart,
  removeFromCart,
  updateShippingDetails,
};

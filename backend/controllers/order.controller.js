import Cart from '../models/cart.model.js';
import Order from '../models/order.model.js';
import asyncHandler from '../middleware/asyncHandler.js';

const addOrderItems = asyncHandler(async (req, res) => {
  const {
    orderItems,
    shippingAddress,
    paymentMethod,
    itemsPrice,
    shippingPrice,
    taxPrice,
    totalPrice,
  } = req.body;

  if (!orderItems || orderItems.length === 0) {
    res.status(400);
    throw new Error('No order items');
  }

  const order = new Order({
    orderItems: orderItems.map((x) => ({
      ...x,
      product: x.product || x._id, // just in case
      _id: undefined, // remove any _id sent from frontend
    })),
    user: req.user._id,
    shippingAddress,
    paymentMethod: paymentMethod || 'PayPal', // default fallback
    itemsPrice: Number(itemsPrice) || 0,
    shippingPrice: Number(shippingPrice) || 0,
    taxPrice: Number(taxPrice) || 0,
    totalPrice: Number(totalPrice) || 0,
  });

  const createdOrder = await order.save();
  // ✅ After saving the order, delete the user's cart
  await Cart.deleteOne({ user: req.user._id });
  res.status(201).json(createdOrder);
});


// @desc    Get logged in user orders
// @route   GET /api/orders/myorders
// @access  Private
const getMyOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({ user: req.user._id });
  res.status(200).json(orders);
});

// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Private
const getOrderById = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id).populate(
    'user',
    'name email',
  );

  if (order) {
    res.status(200).json(order);
  } else {
    res.status(404);
    throw new Error('Order not found');
  }
});

// @desc    Update order to paid
// @route   PUT /api/orders/:id/pay
// @access  Private
const updateOrderToPaid = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);

  if (order) {
    order.isPaid = true;
    order.paidAt = Date.now();
    order.paymentResult = {
      id: req.body.id,
      status: req.body.status,
      update_time: req.body.update_time,
      email_address: req.body.payer.email_address,
    };

    const updatedOrder = await order.save();

    res.status(200).json(updatedOrder);
  } else {
    res.status(404);
    throw new Error('Order not found');
  }
});

// @desc    Update order to delivered
// @route   PUT /api/orders/:id/deliver
// @access  Private/Admin
const updateOrderToDelivered = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);

  if (order) {
    order.isDelivered = true;
    order.deliveredAt = Date.now();

    const updatedOrder = await order.save();

    res.status(200).json(updatedOrder);
  } else {
    res.status(404);
    throw new Error('Order not found.');
  }
});

// @desc    Get all orders
// @route   GET /api/orders
// @access  Private/Admin
const getOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({}).populate('user', 'id name');
  res.status(200).json(orders);
});

const placeOrderHandler = async () => {
  try {
    const res = await createOrder().unwrap(); // ⬅️ no need to send body
    console.log('✅ Order Response:', res);
    navigate(`/order/${res._id}`);
  } catch (err) {
    console.error('❌ Order creation failed:', err);
    toast.error(err?.data?.message || err.message || 'Order failed');
  }
};


export {
  addOrderItems,
  getMyOrders,
  getOrderById,
  updateOrderToPaid,
  updateOrderToDelivered,
  getOrders,
  placeOrderHandler,
};

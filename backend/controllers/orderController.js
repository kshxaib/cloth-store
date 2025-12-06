import asyncHandler from 'express-async-handler';
import Order from '../models/Order.js';
import Product from '../models/Product.js';
import Cart from '../models/Cart.js';

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
export const createOrder = asyncHandler(async (req, res) => {
    const { items, shippingAddress, paymentResult } = req.body;

    if (!items || items.length === 0) {
        res.status(400);
        throw new Error('No order items');
    }

    if (!shippingAddress) {
        res.status(400);
        throw new Error('Please provide shipping address');
    }

    // Validate and calculate prices
    let itemsPrice = 0;
    const orderItems = [];

    for (const item of items) {
        const product = await Product.findById(item.product);

        if (!product) {
            res.status(404);
            throw new Error(`Product not found: ${item.product}`);
        }

        // Check stock
        if (item.size) {
            const sizeStock = product.sizes.find((s) => s.size === item.size);
            if (!sizeStock || sizeStock.stock < item.quantity) {
                res.status(400);
                throw new Error(`Insufficient stock for ${product.title} - Size ${item.size}`);
            }

            // Reduce stock - update the specific size in the sizes array
            const sizeIndex = product.sizes.findIndex((s) => s.size === item.size);
            product.sizes[sizeIndex].stock -= item.quantity;

            // Calculate new total stock
            const newTotalStock = product.sizes.reduce((total, size) => total + size.stock, 0);

            // Update product using findByIdAndUpdate to avoid middleware issues
            await Product.findByIdAndUpdate(
                product._id,
                {
                    sizes: product.sizes,
                    stock: newTotalStock
                }
            );
        } else {
            if (product.stock < item.quantity) {
                res.status(400);
                throw new Error(`Insufficient stock for ${product.title}`);
            }

            // Update product using findByIdAndUpdate to avoid middleware issues
            await Product.findByIdAndUpdate(
                product._id,
                { $inc: { stock: -item.quantity } }
            );
        }

        const price = product.price;
        itemsPrice += price * item.quantity;

        orderItems.push({
            product: product._id,
            title: product.title,
            quantity: item.quantity,
            price: price,
            size: item.size,
        });
    }

    // Calculate shipping and tax
    const shippingPrice = itemsPrice > 1000 ? 0 : 50; // Free shipping over 1000
    const taxPrice = Number((0.0 * itemsPrice).toFixed(2)); // 0% tax for now
    const totalPrice = itemsPrice + shippingPrice + taxPrice;

    // Create order
    const order = await Order.create({
        user: req.user.id,
        items: orderItems,
        shippingAddress,
        paymentResult,
        itemsPrice,
        shippingPrice,
        taxPrice,
        totalPrice,
    });

    // Clear user's cart
    await Cart.findOneAndUpdate({ user: req.user.id }, { items: [] });

    res.status(201).json({
        success: true,
        order,
    });
});

// @desc    Get user's orders
// @route   GET /api/orders/my
// @access  Private
export const getMyOrders = asyncHandler(async (req, res) => {
    const orders = await Order.find({ user: req.user.id }).sort({ createdAt: -1 });

    res.json({
        success: true,
        count: orders.length,
        orders,
    });
});

// @desc    Get all orders (admin)
// @route   GET /api/orders
// @access  Private/Admin
export const getAllOrders = asyncHandler(async (req, res) => {
    const { status, page = 1, limit = 20 } = req.query;

    const query = {};
    if (status) {
        query.status = status;
    }

    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    const orders = await Order.find(query)
        .populate('user', 'name email')
        .sort({ createdAt: -1 })
        .limit(limitNum)
        .skip(skip);

    const total = await Order.countDocuments(query);

    res.json({
        success: true,
        count: orders.length,
        total,
        page: pageNum,
        pages: Math.ceil(total / limitNum),
        orders,
    });
});

// @desc    Get single order
// @route   GET /api/orders/:id
// @access  Private
export const getOrder = asyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.id).populate('user', 'name email');

    if (!order) {
        res.status(404);
        throw new Error('Order not found');
    }

    // Check if user is the owner or admin
    if (order.user._id.toString() !== req.user.id && req.user.role !== 'admin') {
        res.status(403);
        throw new Error('Not authorized to view this order');
    }

    res.json({
        success: true,
        order,
    });
});

// @desc    Update order status (admin)
// @route   PUT /api/orders/:id/status
// @access  Private/Admin
export const updateOrderStatus = asyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.id);

    if (!order) {
        res.status(404);
        throw new Error('Order not found');
    }

    const { status } = req.body;

    if (!status) {
        res.status(400);
        throw new Error('Please provide status');
    }

    const validStatuses = ['confirmed', 'shipped', 'delivered', 'cancelled'];

    if (!validStatuses.includes(status)) {
        res.status(400);
        throw new Error('Invalid status');
    }

    order.status = status;
    const updatedOrder = await order.save();

    res.json({
        success: true,
        order: updatedOrder,
    });
});

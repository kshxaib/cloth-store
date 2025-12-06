import asyncHandler from 'express-async-handler';
import Order from '../models/Order.js';
import Product from '../models/Product.js';
import User from '../models/User.js';

// @desc    Get admin dashboard stats
// @route   GET /api/admin/stats
// @access  Private/Admin
export const getStats = asyncHandler(async (req, res) => {
    // Total users
    const totalUsers = await User.countDocuments({ role: 'user' });

    // Total orders
    const totalOrders = await Order.countDocuments();

    // Total revenue
    const revenueData = await Order.aggregate([
        {
            $group: {
                _id: null,
                totalRevenue: { $sum: '$totalPrice' },
            },
        },
    ]);

    const totalRevenue = revenueData.length > 0 ? revenueData[0].totalRevenue : 0;

    // Order status breakdown
    const ordersByStatus = await Order.aggregate([
        {
            $group: {
                _id: '$status',
                count: { $sum: 1 },
            },
        },
    ]);

    // Recent orders
    const recentOrders = await Order.find({})
        .populate('user', 'name email')
        .sort({ createdAt: -1 })
        .limit(5);

    // Low stock products
    const lowStockProducts = await Product.find({ stock: { $lte: 5 } })
        .populate('category', 'name')
        .sort({ stock: 1 })
        .limit(10);

    // Top selling products (by quantity)
    const topProducts = await Order.aggregate([
        { $unwind: '$items' },
        {
            $group: {
                _id: '$items.product',
                totalQuantity: { $sum: '$items.quantity' },
                totalRevenue: { $sum: { $multiply: ['$items.quantity', '$items.price'] } },
            },
        },
        { $sort: { totalQuantity: -1 } },
        { $limit: 5 },
    ]);

    // Populate product details for top products
    const populatedTopProducts = await Product.populate(topProducts, {
        path: '_id',
        select: 'title price images',
    });

    res.json({
        success: true,
        stats: {
            totalUsers,
            totalOrders,
            totalRevenue: totalRevenue.toFixed(2),
            ordersByStatus,
            recentOrders,
            lowStockProducts,
            topProducts: populatedTopProducts,
        },
    });
});

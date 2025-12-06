import asyncHandler from 'express-async-handler';
import Cart from '../models/Cart.js';
import Product from '../models/Product.js';

// @desc    Get user cart
// @route   GET /api/cart
// @access  Private
export const getCart = asyncHandler(async (req, res) => {
    let cart = await Cart.findOne({ user: req.user.id }).populate('items.product', 'title price images');

    if (!cart) {
        cart = await Cart.create({ user: req.user.id, items: [] });
    }

    res.json({
        success: true,
        cart,
    });
});

// @desc    Add/Update cart item
// @route   POST /api/cart
// @access  Private
export const updateCart = asyncHandler(async (req, res) => {
    const { productId, quantity, size } = req.body;

    if (!productId || quantity === undefined || quantity === null) {
        res.status(400);
        throw new Error('Please provide product and quantity');
    }

    // Check if product exists
    const product = await Product.findById(productId);

    if (!product) {
        res.status(404);
        throw new Error('Product not found');
    }

    // Check stock only if quantity is greater than 0
    if (quantity > 0) {
        if (size) {
            const sizeStock = product.sizes.find((s) => s.size === size);
            if (!sizeStock || sizeStock.stock < quantity) {
                res.status(400);
                throw new Error('Insufficient stock');
            }
        } else {
            if (product.stock < quantity) {
                res.status(400);
                throw new Error('Insufficient stock');
            }
        }
    }

    let cart = await Cart.findOne({ user: req.user.id });

    if (!cart) {
        cart = await Cart.create({ user: req.user.id, items: [] });
    }

    // Check if product already in cart
    const existingItemIndex = cart.items.findIndex(
        (item) => item.product.toString() === productId && (!size || item.size === size)
    );

    if (existingItemIndex > -1) {
        // Update quantity
        if (quantity === 0) {
            // Remove item
            cart.items.splice(existingItemIndex, 1);
        } else {
            cart.items[existingItemIndex].quantity = quantity;
            cart.items[existingItemIndex].priceAtPurchase = product.price;
        }
    } else {
        // Add new item
        if (quantity > 0) {
            cart.items.push({
                product: productId,
                quantity,
                size,
                priceAtPurchase: product.price,
            });
        }
    }

    await cart.save();

    const populatedCart = await Cart.findById(cart._id).populate('items.product', 'title price images');

    res.json({
        success: true,
        cart: populatedCart,
    });
});

// @desc    Clear cart
// @route   DELETE /api/cart
// @access  Private
export const clearCart = asyncHandler(async (req, res) => {
    const cart = await Cart.findOne({ user: req.user.id });

    if (!cart) {
        res.status(404);
        throw new Error('Cart not found');
    }

    cart.items = [];
    await cart.save();

    res.json({
        success: true,
        message: 'Cart cleared successfully',
    });
});

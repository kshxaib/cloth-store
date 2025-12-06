import asyncHandler from 'express-async-handler';
import Product from '../models/Product.js';
import { uploadToCloudinary, deleteFromCloudinary } from '../utils/cloudinary.js';
import multer from 'multer';

// Configure multer for memory storage
const storage = multer.memoryStorage();
export const upload = multer({
    storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
    fileFilter: (req, file, cb) => {
        if (file.mimetype.startsWith('image/')) {
            cb(null, true);
        } else {
            cb(new Error('Only image files are allowed'), false);
        }
    },
});

// @desc    Get all products
// @route   GET /api/products
// @access  Public
export const getProducts = asyncHandler(async (req, res) => {
    const {
        category,
        search,
        minPrice,
        maxPrice,
        size,
        color,
        featured,
        sort,
        page = 1,
        limit = 12,
    } = req.query;

    // Build query
    const query = {};

    if (category) {
        query.category = category;
    }

    if (search) {
        query.$or = [
            { title: { $regex: search, $options: 'i' } },
            { description: { $regex: search, $options: 'i' } },
        ];
    }

    if (minPrice || maxPrice) {
        query.price = {};
        if (minPrice) query.price.$gte = Number(minPrice);
        if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    if (size) {
        query['sizes.size'] = size.toUpperCase();
    }

    if (color) {
        query.colors = { $in: [color] };
    }

    if (featured) {
        query.featured = featured === 'true';
    }

    // Sorting
    let sortOption = {};
    if (sort === 'price-asc') {
        sortOption.price = 1;
    } else if (sort === 'price-desc') {
        sortOption.price = -1;
    } else if (sort === 'newest') {
        sortOption.createdAt = -1;
    } else {
        sortOption.createdAt = -1; // Default
    }

    // Pagination
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    const products = await Product.find(query)
        .populate('category', 'name slug')
        .sort(sortOption)
        .limit(limitNum)
        .skip(skip);

    const total = await Product.countDocuments(query);

    res.json({
        success: true,
        count: products.length,
        total,
        page: pageNum,
        pages: Math.ceil(total / limitNum),
        products,
    });
});

// @desc    Get single product
// @route   GET /api/products/:id
// @access  Public
export const getProduct = asyncHandler(async (req, res) => {
    const product = await Product.findById(req.params.id).populate('category', 'name slug');

    if (!product) {
        res.status(404);
        throw new Error('Product not found');
    }

    res.json({
        success: true,
        product,
    });
});

// @desc    Create product
// @route   POST /api/products
// @access  Private/Admin
export const createProduct = asyncHandler(async (req, res) => {
    const { title, description, price, category, sizes, colors, featured } = req.body;

    // Validation
    if (!title || !description || !price || !category) {
        res.status(400);
        throw new Error('Please provide all required fields');
    }

    // Handle image uploads
    const images = [];

    if (req.files && req.files.length > 0) {
        for (const file of req.files) {
            const result = await uploadToCloudinary(file.buffer, 'divine-store/products');
            images.push(result);
        }
    }

    // Parse sizes if it's a string (from form-data)
    let parsedSizes = [];
    if (sizes) {
        parsedSizes = typeof sizes === 'string' ? JSON.parse(sizes) : sizes;
    }

    // Calculate total stock
    const totalStock = parsedSizes.reduce((acc, item) => acc + (Number(item.stock) || 0), 0);

    // Parse colors if it's a string
    let parsedColors = [];
    if (colors) {
        parsedColors = typeof colors === 'string' ? JSON.parse(colors) : colors;
    }

    const product = await Product.create({
        title,
        description,
        price,
        category,
        images,
        sizes: parsedSizes,
        colors: parsedColors,
        stock: totalStock,
        featured: featured === 'true' || featured === true,
    });

    const populatedProduct = await Product.findById(product._id).populate('category', 'name slug');

    res.status(201).json({
        success: true,
        product: populatedProduct,
    });
});

// @desc    Update product
// @route   PUT /api/products/:id
// @access  Private/Admin
export const updateProduct = asyncHandler(async (req, res) => {
    const product = await Product.findById(req.params.id);

    if (!product) {
        res.status(404);
        throw new Error('Product not found');
    }

    const { title, description, price, category, sizes, colors, featured, removeImages } = req.body;

    // Update fields
    product.title = title || product.title;
    product.description = description || product.description;
    product.price = price || product.price;
    product.category = category || product.category;
    product.featured = featured !== undefined ? featured === 'true' || featured === true : product.featured;

    // Update sizes if provided
    if (sizes) {
        product.sizes = typeof sizes === 'string' ? JSON.parse(sizes) : sizes;
        // Recalculate stock
        product.stock = product.sizes.reduce((acc, item) => acc + (Number(item.stock) || 0), 0);
    }

    // Update colors if provided
    if (colors) {
        product.colors = typeof colors === 'string' ? JSON.parse(colors) : colors;
    }

    // Remove specified images
    if (removeImages) {
        const imagesToRemove = typeof removeImages === 'string' ? JSON.parse(removeImages) : removeImages;
        for (const publicId of imagesToRemove) {
            await deleteFromCloudinary(publicId);
            product.images = product.images.filter((img) => img.public_id !== publicId);
        }
    }

    // Add new images
    if (req.files && req.files.length > 0) {
        for (const file of req.files) {
            const result = await uploadToCloudinary(file.buffer, 'divine-store/products');
            product.images.push(result);
        }
    }

    const updatedProduct = await product.save();
    const populatedProduct = await Product.findById(updatedProduct._id).populate('category', 'name slug');

    res.json({
        success: true,
        product: populatedProduct,
    });
});

// @desc    Delete product
// @route   DELETE /api/products/:id
// @access  Private/Admin
export const deleteProduct = asyncHandler(async (req, res) => {
    const product = await Product.findById(req.params.id);

    if (!product) {
        res.status(404);
        throw new Error('Product not found');
    }

    // Delete all images from Cloudinary
    for (const image of product.images) {
        await deleteFromCloudinary(image.public_id);
    }

    await product.deleteOne();

    res.json({
        success: true,
        message: 'Product deleted successfully',
    });
});

// @desc    Update product stock
// @route   PATCH /api/products/:id/stock
// @access  Private/Admin
export const updateStock = asyncHandler(async (req, res) => {
    const product = await Product.findById(req.params.id);

    if (!product) {
        res.status(404);
        throw new Error('Product not found');
    }

    const { sizes } = req.body;

    // console.log('Update Stock Request:', {
    //     id: req.params.id,
    //     sizesBody: sizes,
    //     currentSizes: product.sizes
    // });

    if (!sizes) {
        res.status(400);
        throw new Error('Please provide sizes with stock');
    }

    product.sizes = sizes;
    // Calculate total stock
    product.stock = sizes.reduce((acc, item) => acc + (Number(item.stock) || 0), 0);

    try {
        const updatedProduct = await product.save();
        res.json({
            success: true,
            product: updatedProduct,
        });
    } catch (error) {
        console.error('Stock Update Error:', error);
        res.status(400);
        throw new Error(error.message);
    }
});

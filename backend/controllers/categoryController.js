import asyncHandler from 'express-async-handler';
import Category from '../models/Category.js';
import Product from '../models/Product.js';

// @desc    Get all categories
// @route   GET /api/categories
// @access  Public
export const getCategories = asyncHandler(async (req, res) => {
    // Use aggregation to count products in each category
    const categories = await Category.aggregate([
        {
            $lookup: {
                from: 'products',
                localField: '_id',
                foreignField: 'category',
                as: 'products',
            },
        },
        {
            $project: {
                _id: 1,
                name: 1,
                slug: 1,
                description: 1,
                createdAt: 1,
                updatedAt: 1,
                productCount: { $size: '$products' },
            },
        },
        { $sort: { createdAt: -1 } },
    ]);

    res.json({
        success: true,
        count: categories.length,
        categories,
    });
});

// @desc    Get single category
// @route   GET /api/categories/:id
// @access  Public
export const getCategory = asyncHandler(async (req, res) => {
    const category = await Category.findById(req.params.id);

    if (!category) {
        res.status(404);
        throw new Error('Category not found');
    }

    res.json({
        success: true,
        category,
    });
});

// @desc    Create category
// @route   POST /api/categories
// @access  Private/Admin
export const createCategory = asyncHandler(async (req, res) => {
    const { name, description } = req.body;

    if (!name) {
        res.status(400);
        throw new Error('Please provide category name');
    }

    const categoryExists = await Category.findOne({ name });

    if (categoryExists) {
        res.status(400);
        throw new Error('Category already exists');
    }

    // Generate slug from name
    const slug = name
        .toLowerCase()
        .replace(/[^\w\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-');

    const category = await Category.create({
        name,
        slug,
        description,
    });

    res.status(201).json({
        success: true,
        category,
    });
});

// @desc    Update category
// @route   PUT /api/categories/:id
// @access  Private/Admin
export const updateCategory = asyncHandler(async (req, res) => {
    const category = await Category.findById(req.params.id);

    if (!category) {
        res.status(404);
        throw new Error('Category not found');
    }

    const { name, description } = req.body;

    if (name && name !== category.name) {
        const categoryExists = await Category.findOne({ name });
        if (categoryExists) {
            res.status(400);
            throw new Error('Category with this name already exists');
        }
        category.name = name;
        // Update slug
        category.slug = name
            .toLowerCase()
            .replace(/[^\w\s-]/g, '')
            .replace(/\s+/g, '-')
            .replace(/-+/g, '-');
    }

    category.description = description || category.description;

    const updatedCategory = await category.save();

    res.json({
        success: true,
        category: updatedCategory,
    });
});

// @desc    Delete category
// @route   DELETE /api/categories/:id
// @access  Private/Admin
export const deleteCategory = asyncHandler(async (req, res) => {
    const category = await Category.findById(req.params.id);

    if (!category) {
        res.status(404);
        throw new Error('Category not found');
    }

    // Check if category has products
    const products = await Product.find({ category: req.params.id });

    if (products.length > 0) {
        res.status(400);
        throw new Error('Cannot delete category with existing products');
    }

    await category.deleteOne();

    res.json({
        success: true,
        message: 'Category deleted successfully',
    });
});

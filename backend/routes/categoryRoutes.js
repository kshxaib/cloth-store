import express from 'express';
import {
    getCategories,
    getCategory,
    createCategory,
    updateCategory,
    deleteCategory,
} from '../controllers/categoryController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/').get(getCategories).post(protect, admin, createCategory);

router
    .route('/:id')
    .get(getCategory)
    .put(protect, admin, updateCategory)
    .delete(protect, admin, deleteCategory);

export default router;

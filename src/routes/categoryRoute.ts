import express from 'express';
import { getCategories, createCategory } from '../controllers/categoryController';

const router = express.Router();

router.get('/categories', getCategories);
router.post('/category', createCategory);

export default router;

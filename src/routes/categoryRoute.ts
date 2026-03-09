import express from 'express';
import {
  getCategories,
  createCategory,
} from '../controllers/categoryController';
import { validate } from '../middlewares/validate';
import { createCategorySchema } from '../validation/categorySchemas';

const router = express.Router();

router.get('/categories', getCategories);
router.post('/category', validate(createCategorySchema), createCategory);

export default router;

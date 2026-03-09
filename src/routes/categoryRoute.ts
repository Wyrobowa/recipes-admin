import express from 'express';
import {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} from '../controllers/categoryController';
import { validate } from '../middlewares/validate';
import {
  categoryIdParamSchema,
  createCategorySchema,
  updateCategorySchema,
} from '../validation/categorySchemas';

const router = express.Router();

router.get('/categories', getCategories);
router.post('/category', validate(createCategorySchema), createCategory);
router.put(
  '/category/:id',
  validate(categoryIdParamSchema, 'params'),
  validate(updateCategorySchema),
  updateCategory,
);
router.delete('/category/:id', validate(categoryIdParamSchema, 'params'), deleteCategory);

export default router;

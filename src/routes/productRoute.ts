import express from 'express';
import {
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct,
} from '../controllers/productController';
import { validate } from '../middlewares/validate';
import {
  createProductSchema,
  productIdParamSchema,
  updateProductSchema,
} from '../validation/productSchemas';

const router = express.Router();

router.get('/products', getProducts);
router.post('/product', validate(createProductSchema), createProduct);
router.put(
  '/product/:id',
  validate(productIdParamSchema, 'params'),
  validate(updateProductSchema),
  updateProduct,
);
router.delete('/product/:id', validate(productIdParamSchema, 'params'), deleteProduct);

export default router;

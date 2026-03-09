import express from 'express';
import {
  getRecipesList,
  getRecipe,
  createRecipe,
  updateRecipe,
} from '../controllers/recipeController';
import { validate } from '../middlewares/validate';
import {
  createRecipeSchema,
  slugParamSchema,
  updateRecipeSchema,
} from '../validation/recipeSchemas';

const router = express.Router();

router.get('/recipes', getRecipesList);
router.get('/recipe/:slug', validate(slugParamSchema, 'params'), getRecipe);
router.post('/recipe/add', validate(createRecipeSchema), createRecipe);
router.put(
  '/recipe/edit/:slug',
  validate(slugParamSchema, 'params'),
  validate(updateRecipeSchema),
  updateRecipe,
);

export default router;

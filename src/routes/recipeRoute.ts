import express from 'express';
import {
  getRecipesList,
  getRecipe,
  createRecipe,
  updateRecipe,
} from '../controllers/recipeController';

const router = express.Router();

router.get('/recipes', getRecipesList);
router.get('/recipe/:slug', getRecipe);
router.post('/recipe/add', createRecipe);
router.put('/recipe/edit/:slug', updateRecipe);

export default router;

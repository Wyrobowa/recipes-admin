const express = require('express');

// Controllers
const {
  getRecipesList,
  getRecipe,
  createRecipe,
} = require('../controllers/recipeController');

const router = express.Router();

/**
 * Get Recipes List
 *
 * @name getRecipesList
 * @route {GET} /recipes
 */
router.get('/recipes', getRecipesList);

/**
 * Get Recipe
 *
 * @name getRecipe
 * @route {GET} /recipe
 */
router.get('/recipe/:slug', getRecipe);

/**
 * Create a recipe
 *
 * @name createRecipe
 * @route {POST} /recipe/add
 * @bodyparam {String} title
 * @bodyparam {String} description
 * @bodyparam {String} recipe
 * @bodyparam {String} photo
 * @bodyparam {String} category
 * is asynchronous
 */
router.post('/recipe/add', createRecipe);

module.exports = router;

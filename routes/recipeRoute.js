const express = require('express');

// Controllers
const {
  getRecipes,
  createRecipe,
} = require('../controllers/recipeController');

const router = express.Router();

/**
 * Get Recipes List
 *
 * @name getRecipes
 * @route {GET} /recipes
 */
router.get('/recipes', getRecipes);

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

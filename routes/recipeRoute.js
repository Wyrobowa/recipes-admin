const express = require('express');

// Controllers
const {
  getRecipesList,
  getRecipe,
  createRecipe,
  updateRecipe,
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
 * @route {GET} /recipe/:slug
 * @param {String} slug
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

/**
 * Update a recipe
 *
 * @name updateRecipe
 * @route {POST} /recipe/edit/:slug
 * @param {String} slug
 * @bodyparam {String} title
 * @bodyparam {String} description
 * @bodyparam {String} recipe
 * @bodyparam {String} photo
 * @bodyparam {String} category
 * is asynchronous
 */
router.put('/recipe/edit/:slug', updateRecipe);

module.exports = router;

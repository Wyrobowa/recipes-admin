const express = require('express');

// Controllers
const {
  getRecipes,
} = require('./../controllers/apiController');

const router = express.Router();

/**
 * Get Recipes List
 */
router.get('/recipes', getRecipes);

module.exports = router;

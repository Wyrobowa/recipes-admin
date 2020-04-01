const express = require('express');

// Controllers
const {
  getCategories,
  createCategory,
} = require('./../controllers/categoryController');

const router = express.Router();

/**
 * Get categories
 *
 * @name getCategories
 */
router.get('/categories', getCategories);

/**
 * Create category
 *
 * @name createCategory
 * @route {GET} /category
 * @bodyparam {String} name
 */
router.post('/category', createCategory);

module.exports = router;

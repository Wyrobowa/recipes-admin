const mongoose = require('mongoose');

const CategoryModel = mongoose.model('Category');

const getCategories = async (req, res) => {
  const categories = await CategoryModel.find();

  res.json({
    data: categories,
  })
};

const createCategory = async (req, res) => {
  const category = new CategoryModel(req.body);
  await category.save();

  res.json({
    data: category,
  })
};

module.exports = {
  getCategories,
  createCategory,
};

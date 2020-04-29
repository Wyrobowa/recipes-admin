const mongoose = require('mongoose');

const RecipeModel = mongoose.model('Recipe');

const getRecipesList = async (req, res) => {
  const recipesList = await RecipeModel.find().populate('category');

  res.json({
    data: recipesList,
  });
};

const getRecipe = async (req, res) => {
  const { slug } = req.params;

  const recipe = await RecipeModel.findOne({ slug }).populate('category');

  res.json({
    data: recipe,
  });
};

const createRecipe = async (req, res) => {
  const recipe = new RecipeModel(req.body);
  await recipe.save();

  res.json({
    data: recipe,
  });
};

const updateRecipe = async (req, res) => {
  const { slug } = req.params;

  const recipe = await RecipeModel.findOneAndUpdate({ slug }, req.body);

  res.json({
    data: recipe,
  });
};

module.exports = {
  getRecipesList,
  getRecipe,
  createRecipe,
  updateRecipe,
};

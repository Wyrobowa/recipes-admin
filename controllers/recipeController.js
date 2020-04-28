const mongoose = require('mongoose');

const RecipeModel = mongoose.model('Recipe');

const getRecipes = async (req, res) => {
  const recipesList = await RecipeModel.find().populate('category');

  res.json({
    data: recipesList,
  });
};

const createRecipe = async (req, res) => {
  const recipe = new RecipeModel(req.body);
  await recipe.save();

  res.json({
    data: recipe,
  });
};

module.exports = {
  getRecipes,
  createRecipe,
};

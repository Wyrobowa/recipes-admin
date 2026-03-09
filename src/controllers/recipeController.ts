import mongoose from 'mongoose';
import type { Request, Response } from 'express';

const RecipeModel = mongoose.model('Recipe');

const getRecipesList = async (_req: Request, res: Response) => {
  const recipesList = await RecipeModel.find().populate('category');

  res.json({
    data: recipesList,
  });
};

const getRecipe = async (req: Request, res: Response) => {
  const { slug } = req.params;

  const recipe = await RecipeModel.findOne({ slug }).populate('category');

  res.json({
    data: recipe,
  });
};

const createRecipe = async (req: Request, res: Response) => {
  const recipe = new RecipeModel(req.body);
  await recipe.save();

  res.json({
    data: recipe,
  });
};

const updateRecipe = async (req: Request, res: Response) => {
  const { slug } = req.params;

  const recipe = await RecipeModel.findOneAndUpdate({ slug }, req.body);

  res.json({
    data: recipe,
  });
};

export { getRecipesList, getRecipe, createRecipe, updateRecipe };

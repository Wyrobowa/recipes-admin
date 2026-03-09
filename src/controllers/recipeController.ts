import type { Request, Response } from 'express';
import {
  createRecipe as createRecipeService,
  getRecipe as getRecipeService,
  getRecipesList as getRecipesListService,
  updateRecipe as updateRecipeService,
} from '../services/recipeService';

const getRecipesList = async (_req: Request, res: Response) => {
  const recipesList = await getRecipesListService();

  res.json({
    data: recipesList,
  });
};

const getRecipe = async (req: Request, res: Response) => {
  const recipe = await getRecipeService(String(req.params.slug));

  res.json({
    data: recipe,
  });
};

const createRecipe = async (req: Request, res: Response) => {
  const recipe = await createRecipeService(req.body);

  res.json({
    data: recipe,
  });
};

const updateRecipe = async (req: Request, res: Response) => {
  const recipe = await updateRecipeService(String(req.params.slug), req.body);

  res.json({
    data: recipe,
  });
};

export { getRecipesList, getRecipe, createRecipe, updateRecipe };

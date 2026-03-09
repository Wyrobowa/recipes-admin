import type { Request, Response } from 'express';
import {
  createRecipe as createRecipeRepo,
  getRecipeBySlug,
  listRecipes,
  updateRecipeBySlugAndReturnPrevious,
} from '../repositories/recipeRepository';

const mapCategoryToApi = (recipe: {
  category_id: number | null;
  category_name: string | null;
  category_slug: string | null;
}) => {
  if (!recipe.category_id || !recipe.category_name || !recipe.category_slug) {
    return null;
  }

  return {
    _id: String(recipe.category_id),
    slug: recipe.category_slug,
    name: recipe.category_name,
    __v: 0,
  };
};

const mapRecipeWithCategoryToApi = (recipe: {
  id: number;
  slug: string;
  title: string;
  description: string | null;
  recipe: string;
  photo: string;
  category_id: number | null;
  category_name: string | null;
  category_slug: string | null;
}) => ({
  _id: String(recipe.id),
  slug: recipe.slug,
  title: recipe.title,
  description: recipe.description,
  recipe: recipe.recipe,
  photo: recipe.photo,
  category: mapCategoryToApi(recipe),
  __v: 0,
});

const mapRecipeToApi = (recipe: {
  id: number;
  slug: string;
  title: string;
  description: string | null;
  recipe: string;
  photo: string;
  category_id: number | null;
}) => ({
  _id: String(recipe.id),
  slug: recipe.slug,
  title: recipe.title,
  description: recipe.description,
  recipe: recipe.recipe,
  photo: recipe.photo,
  category: recipe.category_id ? String(recipe.category_id) : null,
  __v: 0,
});

const getRecipesList = async (_req: Request, res: Response) => {
  const recipesList = await listRecipes();

  res.json({
    data: recipesList.map(mapRecipeWithCategoryToApi),
  });
};

const getRecipe = async (req: Request, res: Response) => {
  const slug = String(req.params.slug);

  const recipe = await getRecipeBySlug(slug);

  res.json({
    data: recipe ? mapRecipeWithCategoryToApi(recipe) : null,
  });
};

const createRecipe = async (req: Request, res: Response) => {
  const recipe = await createRecipeRepo(req.body);

  res.json({
    data: mapRecipeToApi(recipe),
  });
};

const updateRecipe = async (req: Request, res: Response) => {
  const slug = String(req.params.slug);

  const recipe = await updateRecipeBySlugAndReturnPrevious(slug, req.body);

  res.json({
    data: recipe ? mapRecipeToApi(recipe) : null,
  });
};

export { getRecipesList, getRecipe, createRecipe, updateRecipe };

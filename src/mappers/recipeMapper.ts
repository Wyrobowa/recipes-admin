import type { RecipeRow, RecipeWithCategoryRow } from '../repositories/recipeRepository';
import type { CategoryApi } from './categoryMapper';

type RecipeApi = {
  _id: string;
  slug: string;
  title: string;
  description: string | null;
  recipe: string;
  photo: string;
  category: string | null;
  __v: number;
};

type RecipeWithCategoryApi = Omit<RecipeApi, 'category'> & {
  category: CategoryApi | null;
};

const mapCategoryForRecipe = (recipe: RecipeWithCategoryRow): CategoryApi | null => {
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

const mapRecipeRowToApi = (recipe: RecipeRow): RecipeApi => ({
  _id: String(recipe.id),
  slug: recipe.slug,
  title: recipe.title,
  description: recipe.description,
  recipe: recipe.recipe,
  photo: recipe.photo,
  category: recipe.category_id ? String(recipe.category_id) : null,
  __v: 0,
});

const mapRecipeWithCategoryRowToApi = (recipe: RecipeWithCategoryRow): RecipeWithCategoryApi => ({
  _id: String(recipe.id),
  slug: recipe.slug,
  title: recipe.title,
  description: recipe.description,
  recipe: recipe.recipe,
  photo: recipe.photo,
  category: mapCategoryForRecipe(recipe),
  __v: 0,
});

export { mapRecipeRowToApi, mapRecipeWithCategoryRowToApi };
export type { RecipeApi, RecipeWithCategoryApi };

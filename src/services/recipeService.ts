import {
  createRecipe as createRecipeRepo,
  getRecipeBySlug,
  listRecipes,
  updateRecipeBySlugAndReturnPrevious,
} from '../repositories/recipeRepository';

type CategoryApi = {
  _id: string;
  slug: string;
  name: string;
  __v: number;
};

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

type CreateRecipeInput = {
  title: string;
  description?: string;
  recipe: string;
  photo?: string;
  category?: number | string;
};

type UpdateRecipeInput = Partial<{
  title: string;
  description: string | null;
  recipe: string;
  photo: string;
  slug: string;
  category: number | string | null;
}>;

const mapCategoryToApi = (recipe: {
  category_id: number | null;
  category_name: string | null;
  category_slug: string | null;
}): CategoryApi | null => {
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
}): RecipeWithCategoryApi => ({
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
}): RecipeApi => ({
  _id: String(recipe.id),
  slug: recipe.slug,
  title: recipe.title,
  description: recipe.description,
  recipe: recipe.recipe,
  photo: recipe.photo,
  category: recipe.category_id ? String(recipe.category_id) : null,
  __v: 0,
});

const getRecipesList = async (): Promise<RecipeWithCategoryApi[]> => {
  const recipes = await listRecipes();
  return recipes.map(mapRecipeWithCategoryToApi);
};

const getRecipe = async (
  slug: string,
): Promise<RecipeWithCategoryApi | null> => {
  const recipe = await getRecipeBySlug(slug);
  return recipe ? mapRecipeWithCategoryToApi(recipe) : null;
};

const createRecipe = async (input: CreateRecipeInput): Promise<RecipeApi> => {
  const recipe = await createRecipeRepo(input);
  return mapRecipeToApi(recipe);
};

const updateRecipe = async (
  slug: string,
  input: UpdateRecipeInput,
): Promise<RecipeApi | null> => {
  const recipe = await updateRecipeBySlugAndReturnPrevious(slug, input);
  return recipe ? mapRecipeToApi(recipe) : null;
};

export { getRecipesList, getRecipe, createRecipe, updateRecipe };
export type {
  CreateRecipeInput,
  UpdateRecipeInput,
  RecipeApi,
  RecipeWithCategoryApi,
};

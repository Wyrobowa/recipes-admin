import {
  mapRecipeRowToApi,
  mapRecipeWithCategoryRowToRecipeApi,
  mapRecipeWithCategoryRowToApi,
  type RecipeApi,
  type RecipeWithCategoryApi,
} from '../mappers/recipeMapper';
import {
  createRecipe as createRecipeRepo,
  getRecipeBySlug,
  listRecipes,
  updateRecipeBySlugAndReturnPrevious,
  type RecipeProductInput,
} from '../repositories/recipeRepository';

type CreateRecipeInput = {
  title: string;
  description?: string;
  recipe: string;
  photo?: string;
  category?: number | string;
  products: RecipeProductInput[];
};

type UpdateRecipeInput = Partial<{
  title: string;
  description: string | null;
  recipe: string;
  photo: string;
  slug: string;
  category: number | string | null;
  products: RecipeProductInput[];
}>;

const getRecipesList = async (): Promise<RecipeWithCategoryApi[]> => {
  const recipes = await listRecipes();
  return recipes.map(mapRecipeWithCategoryRowToApi);
};

const getRecipe = async (slug: string): Promise<RecipeWithCategoryApi | null> => {
  const recipe = await getRecipeBySlug(slug);
  return recipe ? mapRecipeWithCategoryRowToApi(recipe) : null;
};

const createRecipe = async (input: CreateRecipeInput): Promise<RecipeApi> => {
  const recipe = await createRecipeRepo(input);
  const hydratedRecipe = await getRecipeBySlug(recipe.slug);

  if (!hydratedRecipe) {
    return mapRecipeRowToApi({ ...recipe, products: [] });
  }

  return mapRecipeWithCategoryRowToRecipeApi(hydratedRecipe);
};

const updateRecipe = async (slug: string, input: UpdateRecipeInput): Promise<RecipeApi | null> => {
  const recipe = await updateRecipeBySlugAndReturnPrevious(slug, input);

  if (!recipe) {
    return null;
  }

  return mapRecipeWithCategoryRowToRecipeApi(recipe);
};

export { getRecipesList, getRecipe, createRecipe, updateRecipe };
export type { CreateRecipeInput, UpdateRecipeInput, RecipeApi, RecipeWithCategoryApi };

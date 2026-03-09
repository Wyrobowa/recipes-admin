import type {
  RecipeProductRow,
  RecipeRow,
  RecipeWithCategoryRow,
} from '../repositories/recipeRepository';
import type { CategoryApi } from './categoryMapper';

type RecipeProductApi = {
  product: {
    _id: string;
    name: string;
    unit: string;
    kcal: number;
    protein_g: number;
    carbs_g: number;
    fat_g: number;
  };
  quantity: number;
};

type RecipeApi = {
  _id: string;
  slug: string;
  title: string;
  description: string | null;
  recipe: string;
  photo: string;
  category: string | null;
  products: RecipeProductApi[];
  __v: number;
};

type RecipeWithCategoryApi = Omit<RecipeApi, 'category'> & {
  category: CategoryApi | null;
};

const toNumber = (value: string | number) => Number(value);

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

const mapProductsForRecipe = (products: RecipeProductRow[]): RecipeProductApi[] => {
  return products.map((product) => ({
    product: {
      _id: String(product.product_id),
      name: product.product_name,
      unit: product.product_unit,
      kcal: toNumber(product.product_kcal),
      protein_g: toNumber(product.product_protein_g),
      carbs_g: toNumber(product.product_carbs_g),
      fat_g: toNumber(product.product_fat_g),
    },
    quantity: toNumber(product.quantity),
  }));
};

const mapRecipeRowToApi = (
  recipe: RecipeRow & { products: RecipeProductRow[] },
): RecipeApi => ({
  _id: String(recipe.id),
  slug: recipe.slug,
  title: recipe.title,
  description: recipe.description,
  recipe: recipe.recipe,
  photo: recipe.photo,
  category: recipe.category_id ? String(recipe.category_id) : null,
  products: mapProductsForRecipe(recipe.products),
  __v: 0,
});

const mapRecipeWithCategoryRowToRecipeApi = (
  recipe: RecipeWithCategoryRow,
): RecipeApi => ({
  _id: String(recipe.id),
  slug: recipe.slug,
  title: recipe.title,
  description: recipe.description,
  recipe: recipe.recipe,
  photo: recipe.photo,
  category: recipe.category_id ? String(recipe.category_id) : null,
  products: mapProductsForRecipe(recipe.products),
  __v: 0,
});

const mapRecipeWithCategoryRowToApi = (
  recipe: RecipeWithCategoryRow,
): RecipeWithCategoryApi => ({
  _id: String(recipe.id),
  slug: recipe.slug,
  title: recipe.title,
  description: recipe.description,
  recipe: recipe.recipe,
  photo: recipe.photo,
  category: mapCategoryForRecipe(recipe),
  products: mapProductsForRecipe(recipe.products),
  __v: 0,
});

export {
  mapRecipeRowToApi,
  mapRecipeWithCategoryRowToApi,
  mapRecipeWithCategoryRowToRecipeApi,
};
export type { RecipeApi, RecipeProductApi, RecipeWithCategoryApi };

import {
  createCategory as createCategoryRepo,
  listCategories,
} from '../repositories/categoryRepository';

type CategoryApi = {
  _id: string;
  slug: string;
  name: string;
  __v: number;
};

type CreateCategoryInput = {
  name: string;
};

const mapCategoryToApi = (category: {
  id: number;
  slug: string;
  name: string;
}): CategoryApi => ({
  _id: String(category.id),
  slug: category.slug,
  name: category.name,
  __v: 0,
});

const getCategories = async (): Promise<CategoryApi[]> => {
  const categories = await listCategories();
  return categories.map(mapCategoryToApi);
};

const createCategory = async (
  input: CreateCategoryInput,
): Promise<CategoryApi> => {
  const category = await createCategoryRepo(input.name);
  return mapCategoryToApi(category);
};

export { getCategories, createCategory };
export type { CategoryApi, CreateCategoryInput };

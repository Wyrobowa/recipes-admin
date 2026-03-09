import { mapCategoryRowToApi, type CategoryApi } from '../mappers/categoryMapper';
import { createCategory as createCategoryRepo, listCategories } from '../repositories/categoryRepository';

type CreateCategoryInput = {
  name: string;
};

const getCategories = async (): Promise<CategoryApi[]> => {
  const categories = await listCategories();
  return categories.map(mapCategoryRowToApi);
};

const createCategory = async (input: CreateCategoryInput): Promise<CategoryApi> => {
  const category = await createCategoryRepo(input.name);
  return mapCategoryRowToApi(category);
};

export { getCategories, createCategory };
export type { CategoryApi, CreateCategoryInput };

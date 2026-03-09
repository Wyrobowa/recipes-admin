import { mapCategoryRowToApi, type CategoryApi } from '../mappers/categoryMapper';
import {
  createCategory as createCategoryRepo,
  deleteCategoryById,
  listCategories,
  updateCategoryById,
} from '../repositories/categoryRepository';

type CreateCategoryInput = {
  name: string;
};

type UpdateCategoryInput = {
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

const updateCategory = async (
  id: number,
  input: UpdateCategoryInput,
): Promise<CategoryApi | null> => {
  const category = await updateCategoryById(id, input.name);
  return category ? mapCategoryRowToApi(category) : null;
};

const deleteCategory = async (id: number): Promise<CategoryApi | null> => {
  const category = await deleteCategoryById(id);
  return category ? mapCategoryRowToApi(category) : null;
};

export { getCategories, createCategory, updateCategory, deleteCategory };
export type { CategoryApi, CreateCategoryInput, UpdateCategoryInput };

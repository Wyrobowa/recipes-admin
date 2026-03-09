import type { Request, Response } from 'express';
import { AppError } from '../errors/AppError';
import {
  createCategory as createCategoryService,
  deleteCategory as deleteCategoryService,
  getCategories as getCategoriesService,
  updateCategory as updateCategoryService,
} from '../services/categoryService';

const getCategories = async (_req: Request, res: Response) => {
  const categories = await getCategoriesService();

  res.json({
    data: categories,
  });
};

const createCategory = async (req: Request, res: Response) => {
  const category = await createCategoryService(req.body);

  res.json({
    data: category,
  });
};

const updateCategory = async (req: Request, res: Response) => {
  const category = await updateCategoryService(Number(req.params.id), req.body);

  if (!category) {
    throw new AppError('Category not found', 404);
  }

  res.json({
    data: category,
  });
};

const deleteCategory = async (req: Request, res: Response) => {
  const category = await deleteCategoryService(Number(req.params.id));

  if (!category) {
    throw new AppError('Category not found', 404);
  }

  res.json({
    data: category,
  });
};

export { getCategories, createCategory, updateCategory, deleteCategory };

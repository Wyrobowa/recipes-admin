import type { Request, Response } from 'express';
import {
  createCategory as createCategoryService,
  getCategories as getCategoriesService,
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

export { getCategories, createCategory };

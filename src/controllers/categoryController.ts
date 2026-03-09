import type { Request, Response } from 'express';
import { createCategory as createCategoryRepo, listCategories } from '../repositories/categoryRepository';

const mapCategoryToApi = (category: { id: number; slug: string; name: string }) => ({
  _id: String(category.id),
  slug: category.slug,
  name: category.name,
  __v: 0,
});

const getCategories = async (_req: Request, res: Response) => {
  const categories = await listCategories();

  res.json({
    data: categories.map(mapCategoryToApi),
  });
};

const createCategory = async (req: Request, res: Response) => {
  const category = await createCategoryRepo(req.body.name);

  res.json({
    data: mapCategoryToApi(category),
  });
};

export { getCategories, createCategory };

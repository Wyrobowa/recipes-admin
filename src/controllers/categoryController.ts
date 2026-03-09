import mongoose from 'mongoose';
import type { Request, Response } from 'express';

const CategoryModel = mongoose.model('Category');

const getCategories = async (_req: Request, res: Response) => {
  const categories = await CategoryModel.find();

  res.json({
    data: categories,
  });
};

const createCategory = async (req: Request, res: Response) => {
  const category = new CategoryModel(req.body);
  await category.save();

  res.json({
    data: category,
  });
};

export { getCategories, createCategory };

import type { Request, Response } from 'express';
import { AppError } from '../errors/AppError';
import {
  createProduct as createProductService,
  deleteProduct as deleteProductService,
  getProducts as getProductsService,
  updateProduct as updateProductService,
} from '../services/productService';

const getProducts = async (_req: Request, res: Response) => {
  const products = await getProductsService();

  res.json({
    data: products,
  });
};

const createProduct = async (req: Request, res: Response) => {
  const product = await createProductService(req.body);

  res.json({
    data: product,
  });
};

const updateProduct = async (req: Request, res: Response) => {
  const product = await updateProductService(Number(req.params.id), req.body);

  if (!product) {
    throw new AppError('Product not found', 404);
  }

  res.json({
    data: product,
  });
};

const deleteProduct = async (req: Request, res: Response) => {
  const product = await deleteProductService(Number(req.params.id));

  if (!product) {
    throw new AppError('Product not found', 404);
  }

  res.json({
    data: product,
  });
};

export { getProducts, createProduct, updateProduct, deleteProduct };

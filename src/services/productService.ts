import { mapProductRowToApi, type ProductApi } from '../mappers/productMapper';
import {
  createProduct as createProductRepo,
  deleteProductById,
  listProducts,
  updateProductById,
} from '../repositories/productRepository';

type CreateProductInput = {
  name: string;
  unit: string;
  protein_g: number;
  carbs_g: number;
  fat_g: number;
};

type UpdateProductInput = CreateProductInput;

const getProducts = async (): Promise<ProductApi[]> => {
  const products = await listProducts();
  return products.map(mapProductRowToApi);
};

const createProduct = async (input: CreateProductInput): Promise<ProductApi> => {
  const product = await createProductRepo(input);
  return mapProductRowToApi(product);
};

const updateProduct = async (
  id: number,
  input: UpdateProductInput,
): Promise<ProductApi | null> => {
  const product = await updateProductById(id, input);
  return product ? mapProductRowToApi(product) : null;
};

const deleteProduct = async (id: number): Promise<ProductApi | null> => {
  const product = await deleteProductById(id);
  return product ? mapProductRowToApi(product) : null;
};

export { getProducts, createProduct, updateProduct, deleteProduct };
export type { ProductApi, CreateProductInput, UpdateProductInput };

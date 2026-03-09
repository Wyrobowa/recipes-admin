import type { ProductRow } from '../repositories/productRepository';

type ProductApi = {
  _id: string;
  name: string;
  unit: string;
  protein_g: number;
  carbs_g: number;
  fat_g: number;
  __v: number;
};

const toNumber = (value: string | number) => Number(value);

const mapProductRowToApi = (product: ProductRow): ProductApi => ({
  _id: String(product.id),
  name: product.name,
  unit: product.unit,
  protein_g: toNumber(product.protein_g),
  carbs_g: toNumber(product.carbs_g),
  fat_g: toNumber(product.fat_g),
  __v: 0,
});

export { mapProductRowToApi };
export type { ProductApi };

import { getPool } from '../db/postgres';

type ProductRow = {
  id: number;
  name: string;
  unit: string;
  kcal: string | number;
  protein_g: string | number;
  carbs_g: string | number;
  fat_g: string | number;
  created_at: Date;
  updated_at: Date;
};

type CreateProductInput = {
  name: string;
  unit: string;
  kcal: number;
  protein_g: number;
  carbs_g: number;
  fat_g: number;
};

type UpdateProductInput = CreateProductInput;

const listProducts = async (): Promise<ProductRow[]> => {
  const { rows } = await getPool().query<ProductRow>(
    `
      SELECT id, name, unit, kcal, protein_g, carbs_g, fat_g, created_at, updated_at
      FROM products
      ORDER BY id ASC
    `,
  );

  return rows;
};

const createProduct = async (input: CreateProductInput): Promise<ProductRow> => {
  const { rows } = await getPool().query<ProductRow>(
    `
      INSERT INTO products(name, unit, kcal, protein_g, carbs_g, fat_g)
      VALUES($1, $2, $3, $4, $5, $6)
      RETURNING id, name, unit, kcal, protein_g, carbs_g, fat_g, created_at, updated_at
    `,
    [input.name, input.unit, input.kcal, input.protein_g, input.carbs_g, input.fat_g],
  );

  return rows[0];
};

const updateProductById = async (
  id: number,
  input: UpdateProductInput,
): Promise<ProductRow | null> => {
  const { rows } = await getPool().query<ProductRow>(
    `
      UPDATE products
      SET
        name = $1,
        unit = $2,
        kcal = $3,
        protein_g = $4,
        carbs_g = $5,
        fat_g = $6,
        updated_at = NOW()
      WHERE id = $7
      RETURNING id, name, unit, kcal, protein_g, carbs_g, fat_g, created_at, updated_at
    `,
    [input.name, input.unit, input.kcal, input.protein_g, input.carbs_g, input.fat_g, id],
  );

  return rows[0] ?? null;
};

const deleteProductById = async (id: number): Promise<ProductRow | null> => {
  const { rows } = await getPool().query<ProductRow>(
    `
      DELETE FROM products
      WHERE id = $1
      RETURNING id, name, unit, kcal, protein_g, carbs_g, fat_g, created_at, updated_at
    `,
    [id],
  );

  return rows[0] ?? null;
};

export { listProducts, createProduct, updateProductById, deleteProductById };
export type { ProductRow, CreateProductInput, UpdateProductInput };

import type { PoolClient } from 'pg';
import { getPool } from '../db/postgres';
import { toSlug } from '../utils/toSlug';

type RecipeRow = {
  id: number | string;
  slug: string;
  title: string;
  description: string | null;
  recipe: string;
  photo: string;
  category_id: number | string | null;
  created_at: Date;
  updated_at: Date;
};

type RecipeProductRow = {
  product_id: number;
  product_name: string;
  product_unit: string;
  product_kcal: string | number;
  product_protein_g: string | number;
  product_carbs_g: string | number;
  product_fat_g: string | number;
  quantity: string | number;
};

type RecipeWithCategoryRow = RecipeRow & {
  category_name: string | null;
  category_slug: string | null;
  products: RecipeProductRow[];
};

type RecipeProductInput = {
  productId: number | string;
  quantity: number;
};

type CreateRecipeInput = {
  title: string;
  description?: string;
  recipe: string;
  photo?: string;
  category?: number | string;
  products: RecipeProductInput[];
};

type UpdateRecipeInput = Partial<{
  title: string;
  description: string | null;
  recipe: string;
  photo: string;
  slug: string;
  category: number | string | null;
  products: RecipeProductInput[];
}>;

type Queryable = {
  query: <T>(queryText: string, values?: unknown[]) => Promise<{ rows: T[] }>;
};

type RecipeProductJoinRow = {
  recipe_id: number | string;
  product_id: number;
  product_name: string;
  product_unit: string;
  product_kcal: string | number;
  product_protein_g: string | number;
  product_carbs_g: string | number;
  product_fat_g: string | number;
  quantity: string | number;
};

const DEFAULT_PHOTO = 'http://localhost:3000/img/default.jpg';
const toIdNumber = (value: number | string) => Number(value);

const buildSlugCandidate = (base: string, attempt: number) => {
  if (attempt === 0) {
    return base;
  }

  return `${base}-${attempt + 1}`;
};

const toCategoryId = (value: number | string | null | undefined) => {
  if (value === null || value === undefined || value === '') {
    return null;
  }

  const parsed = Number(value);
  return Number.isInteger(parsed) && parsed > 0 ? parsed : null;
};

const normalizeRecipeProducts = (products: RecipeProductInput[]) => {
  const byProductId = new Map<number, number>();

  for (const item of products) {
    const parsedProductId = Number(item.productId);

    if (!Number.isInteger(parsedProductId) || parsedProductId <= 0) {
      continue;
    }

    const existing = byProductId.get(parsedProductId) ?? 0;
    byProductId.set(parsedProductId, existing + item.quantity);
  }

  return [...byProductId.entries()].map(([productId, quantity]) => ({
    productId,
    quantity,
  }));
};

const getRecipeProductsMap = async (
  db: Queryable,
  recipeIds: number[],
): Promise<Map<number, RecipeProductRow[]>> => {
  if (recipeIds.length === 0) {
    return new Map();
  }

  const { rows } = await db.query<RecipeProductJoinRow>(
    `
      SELECT
        rp.recipe_id,
        p.id AS product_id,
        p.name AS product_name,
        p.unit AS product_unit,
        p.kcal AS product_kcal,
        p.protein_g AS product_protein_g,
        p.carbs_g AS product_carbs_g,
        p.fat_g AS product_fat_g,
        rp.quantity
      FROM recipe_products rp
      JOIN products p ON p.id = rp.product_id
      WHERE rp.recipe_id = ANY($1::int[])
      ORDER BY rp.recipe_id ASC, p.id ASC
    `,
    [recipeIds],
  );

  const result = new Map<number, RecipeProductRow[]>();

  for (const row of rows) {
    const recipeId = toIdNumber(row.recipe_id);
    const products = result.get(recipeId) ?? [];

    products.push({
      product_id: row.product_id,
      product_name: row.product_name,
      product_unit: row.product_unit,
      product_kcal: row.product_kcal,
      product_protein_g: row.product_protein_g,
      product_carbs_g: row.product_carbs_g,
      product_fat_g: row.product_fat_g,
      quantity: row.quantity,
    });

    result.set(recipeId, products);
  }

  return result;
};

const attachProducts = async <T extends RecipeRow>(
  db: Queryable,
  recipes: T[],
): Promise<Array<T & { products: RecipeProductRow[] }>> => {
  const ids = recipes.map((recipe) => toIdNumber(recipe.id));
  const productsMap = await getRecipeProductsMap(db, ids);

  return recipes.map((recipe) => ({
    ...recipe,
    products: productsMap.get(toIdNumber(recipe.id)) ?? [],
  }));
};

const listRecipes = async (): Promise<RecipeWithCategoryRow[]> => {
  const pool = getPool();

  const { rows } = await pool.query<Omit<RecipeWithCategoryRow, 'products'>>(
    `
      SELECT
        r.id,
        r.slug,
        r.title,
        r.description,
        r.recipe,
        r.photo,
        r.category_id,
        r.created_at,
        r.updated_at,
        c.name AS category_name,
        c.slug AS category_slug
      FROM recipes r
      LEFT JOIN categories c ON c.id = r.category_id
      ORDER BY r.id ASC
    `,
  );

  return attachProducts(pool, rows);
};

const getRecipeBySlug = async (
  slug: string,
): Promise<RecipeWithCategoryRow | null> => {
  const pool = getPool();

  const { rows } = await pool.query<Omit<RecipeWithCategoryRow, 'products'>>(
    `
      SELECT
        r.id,
        r.slug,
        r.title,
        r.description,
        r.recipe,
        r.photo,
        r.category_id,
        r.created_at,
        r.updated_at,
        c.name AS category_name,
        c.slug AS category_slug
      FROM recipes r
      LEFT JOIN categories c ON c.id = r.category_id
      WHERE r.slug = $1
      LIMIT 1
    `,
    [slug],
  );

  const recipe = rows[0];

  if (!recipe) {
    return null;
  }

  const withProducts = await attachProducts(pool, [recipe]);
  return withProducts[0] ?? null;
};

const insertRecipeProducts = async (
  client: PoolClient,
  recipeId: number,
  products: RecipeProductInput[],
) => {
  const normalizedProducts = normalizeRecipeProducts(products);

  for (const product of normalizedProducts) {
    await client.query(
      `
        INSERT INTO recipe_products(recipe_id, product_id, quantity)
        VALUES($1, $2, $3)
      `,
      [recipeId, product.productId, product.quantity],
    );
  }
};

const createRecipe = async (input: CreateRecipeInput): Promise<RecipeRow> => {
  const baseSlug = toSlug(input.title);
  const categoryId = toCategoryId(input.category);
  const photo = input.photo || DEFAULT_PHOTO;
  const pool = getPool();
  const client = await pool.connect();

  try {
    for (let attempt = 0; attempt < 50; attempt += 1) {
      const candidateSlug = buildSlugCandidate(baseSlug, attempt);

      try {
        await client.query('BEGIN');

        const { rows } = await client.query<RecipeRow>(
          `
            INSERT INTO recipes(title, description, recipe, photo, slug, category_id)
            VALUES($1, $2, $3, $4, $5, $6)
            RETURNING id, slug, title, description, recipe, photo, category_id, created_at, updated_at
          `,
          [
            input.title,
            input.description ?? null,
            input.recipe,
            photo,
            candidateSlug,
            categoryId,
          ],
        );

        const recipe = rows[0];

        await insertRecipeProducts(client, toIdNumber(recipe.id), input.products);
        await client.query('COMMIT');

        return recipe;
      } catch (error) {
        await client.query('ROLLBACK').catch(() => null);

        const pgError = error as { code?: string; constraint?: string };
        const isSlugConflict =
          pgError.code === '23505' && pgError.constraint === 'recipes_slug_key';

        if (!isSlugConflict) {
          throw error;
        }
      }
    }

    throw new Error('Could not generate unique recipe slug');
  } finally {
    client.release();
  }
};

const updateRecipeBySlugAndReturnPrevious = async (
  slug: string,
  input: UpdateRecipeInput,
): Promise<RecipeWithCategoryRow | null> => {
  const pool = getPool();
  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    const previousResult = await client.query<Omit<RecipeWithCategoryRow, 'products'>>(
      `
        SELECT
          r.id,
          r.slug,
          r.title,
          r.description,
          r.recipe,
          r.photo,
          r.category_id,
          r.created_at,
          r.updated_at,
          c.name AS category_name,
          c.slug AS category_slug
        FROM recipes r
        LEFT JOIN categories c ON c.id = r.category_id
        WHERE r.slug = $1
        LIMIT 1
      `,
      [slug],
    );

    const previousRecipe = previousResult.rows[0] ?? null;

    if (!previousRecipe) {
      await client.query('COMMIT');
      return null;
    }

    const previousWithProducts = await attachProducts(client, [previousRecipe]);
    const previous = previousWithProducts[0] ?? null;

    const updates: string[] = [];
    const values: Array<string | number | null> = [];
    let index = 1;

    if (input.title !== undefined) {
      updates.push(`title = $${index++}`);
      values.push(input.title);
    }

    if (input.description !== undefined) {
      updates.push(`description = $${index++}`);
      values.push(input.description);
    }

    if (input.recipe !== undefined) {
      updates.push(`recipe = $${index++}`);
      values.push(input.recipe);
    }

    if (input.photo !== undefined) {
      updates.push(`photo = $${index++}`);
      values.push(input.photo);
    }

    if (input.slug !== undefined) {
      updates.push(`slug = $${index++}`);
      values.push(input.slug);
    }

    if (input.category !== undefined) {
      updates.push(`category_id = $${index++}`);
      values.push(toCategoryId(input.category));
    }

    if (updates.length > 0) {
      updates.push('updated_at = NOW()');
      values.push(slug);

      await client.query(
        `
          UPDATE recipes
          SET ${updates.join(', ')}
          WHERE slug = $${index}
        `,
        values,
      );
    }

    if (input.products !== undefined) {
      await client.query('DELETE FROM recipe_products WHERE recipe_id = $1', [
        toIdNumber(previousRecipe.id),
      ]);
      await insertRecipeProducts(client, toIdNumber(previousRecipe.id), input.products);
    }

    await client.query('COMMIT');

    return previous;
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
};

export {
  listRecipes,
  getRecipeBySlug,
  createRecipe,
  updateRecipeBySlugAndReturnPrevious,
};
export type {
  RecipeRow,
  RecipeProductRow,
  RecipeProductInput,
  RecipeWithCategoryRow,
  CreateRecipeInput,
  UpdateRecipeInput,
};

import slugify from 'slug';
import { getPool } from '../db/postgres';

type RecipeRow = {
  id: number;
  slug: string;
  title: string;
  description: string | null;
  recipe: string;
  photo: string;
  category_id: number | null;
  created_at: Date;
  updated_at: Date;
};

type RecipeWithCategoryRow = RecipeRow & {
  category_name: string | null;
  category_slug: string | null;
};

type CreateRecipeInput = {
  title: string;
  description?: string;
  recipe: string;
  photo?: string;
  category?: number | string;
};

type UpdateRecipeInput = Partial<{
  title: string;
  description: string | null;
  recipe: string;
  photo: string;
  slug: string;
  category: number | string | null;
}>;

const DEFAULT_PHOTO = 'http://localhost:3000/img/default.jpg';

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

const listRecipes = async (): Promise<RecipeWithCategoryRow[]> => {
  const { rows } = await getPool().query<RecipeWithCategoryRow>(
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

  return rows;
};

const getRecipeBySlug = async (
  slug: string,
): Promise<RecipeWithCategoryRow | null> => {
  const { rows } = await getPool().query<RecipeWithCategoryRow>(
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

  return rows[0] ?? null;
};

const createRecipe = async (input: CreateRecipeInput): Promise<RecipeRow> => {
  const baseSlug = slugify(input.title);
  const categoryId = toCategoryId(input.category);
  const photo = input.photo || DEFAULT_PHOTO;

  for (let attempt = 0; attempt < 50; attempt += 1) {
    const candidateSlug = buildSlugCandidate(baseSlug, attempt);

    try {
      const { rows } = await getPool().query<RecipeRow>(
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

      return rows[0];
    } catch (error) {
      const pgError = error as { code?: string; constraint?: string };
      const isSlugConflict =
        pgError.code === '23505' && pgError.constraint === 'recipes_slug_key';

      if (!isSlugConflict) {
        throw error;
      }
    }
  }

  throw new Error('Could not generate unique recipe slug');
};

const updateRecipeBySlugAndReturnPrevious = async (
  slug: string,
  input: UpdateRecipeInput,
): Promise<RecipeRow | null> => {
  const pool = getPool();
  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    const previousResult = await client.query<RecipeRow>(
      `
        SELECT id, slug, title, description, recipe, photo, category_id, created_at, updated_at
        FROM recipes
        WHERE slug = $1
        LIMIT 1
      `,
      [slug],
    );

    const previous = previousResult.rows[0] ?? null;

    if (!previous) {
      await client.query('COMMIT');
      return null;
    }

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
  RecipeWithCategoryRow,
  CreateRecipeInput,
  UpdateRecipeInput,
};

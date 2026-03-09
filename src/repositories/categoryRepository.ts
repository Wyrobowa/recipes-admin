import { getPool } from '../db/postgres';
import { toSlug } from '../utils/toSlug';

type CategoryRow = {
  id: number;
  slug: string;
  name: string;
  created_at: Date;
  updated_at: Date;
};

const buildSlugCandidate = (base: string, attempt: number) => {
  if (attempt === 0) {
    return base;
  }

  return `${base}-${attempt + 1}`;
};

const listCategories = async (): Promise<CategoryRow[]> => {
  const { rows } = await getPool().query<CategoryRow>(
    'SELECT id, slug, name, created_at, updated_at FROM categories ORDER BY id ASC',
  );

  return rows;
};

const createCategory = async (name: string): Promise<CategoryRow> => {
  const baseSlug = toSlug(name);

  for (let attempt = 0; attempt < 50; attempt += 1) {
    const candidateSlug = buildSlugCandidate(baseSlug, attempt);

    try {
      const { rows } = await getPool().query<CategoryRow>(
        `
          INSERT INTO categories(name, slug)
          VALUES($1, $2)
          RETURNING id, slug, name, created_at, updated_at
        `,
        [name, candidateSlug],
      );

      return rows[0];
    } catch (error) {
      const pgError = error as {
        code?: string;
        constraint?: string;
      };
      const isSlugConflict =
        pgError.code === '23505' &&
        pgError.constraint === 'categories_slug_key';

      if (!isSlugConflict) {
        throw error;
      }
    }
  }

  throw new Error('Could not generate unique category slug');
};

const updateCategoryById = async (
  id: number,
  name: string,
): Promise<CategoryRow | null> => {
  const baseSlug = toSlug(name);

  for (let attempt = 0; attempt < 50; attempt += 1) {
    const candidateSlug = buildSlugCandidate(baseSlug, attempt);

    try {
      const { rows } = await getPool().query<CategoryRow>(
        `
          UPDATE categories
          SET name = $1, slug = $2, updated_at = NOW()
          WHERE id = $3
          RETURNING id, slug, name, created_at, updated_at
        `,
        [name, candidateSlug, id],
      );

      return rows[0] ?? null;
    } catch (error) {
      const pgError = error as {
        code?: string;
        constraint?: string;
      };
      const isSlugConflict =
        pgError.code === '23505' &&
        pgError.constraint === 'categories_slug_key';

      if (!isSlugConflict) {
        throw error;
      }
    }
  }

  throw new Error('Could not generate unique category slug');
};

const deleteCategoryById = async (id: number): Promise<CategoryRow | null> => {
  const { rows } = await getPool().query<CategoryRow>(
    `
      DELETE FROM categories
      WHERE id = $1
      RETURNING id, slug, name, created_at, updated_at
    `,
    [id],
  );

  return rows[0] ?? null;
};

export { listCategories, createCategory, updateCategoryById, deleteCategoryById };
export type { CategoryRow };

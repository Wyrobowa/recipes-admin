import slugify from 'slug';
import type { QueryResultRow } from 'pg';
import { getPool } from '../db/postgres';

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
  const baseSlug = slugify(name);

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
      const pgError = error as QueryResultRow & { code?: string; constraint?: string };
      const isSlugConflict = pgError.code === '23505' && pgError.constraint === 'categories_slug_key';

      if (!isSlugConflict) {
        throw error;
      }
    }
  }

  throw new Error('Could not generate unique category slug');
};

export { listCategories, createCategory };

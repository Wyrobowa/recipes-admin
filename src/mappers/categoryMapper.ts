import type { CategoryRow } from '../repositories/categoryRepository';

type CategoryApi = {
  _id: string;
  slug: string;
  name: string;
  __v: number;
};

const mapCategoryRowToApi = (category: CategoryRow): CategoryApi => ({
  _id: String(category.id),
  slug: category.slug,
  name: category.name,
  __v: 0,
});

export { mapCategoryRowToApi };
export type { CategoryApi };

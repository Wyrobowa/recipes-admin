import { z } from 'zod';

const createCategorySchema = z.object({
  name: z.string().trim().min(1, 'name is required'),
});

const updateCategorySchema = z.object({
  name: z.string().trim().min(1, 'name is required'),
});

const categoryIdParamSchema = z.object({
  id: z.coerce.number().int().positive(),
});

export { createCategorySchema, updateCategorySchema, categoryIdParamSchema };

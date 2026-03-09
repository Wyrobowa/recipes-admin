import { z } from 'zod';

const slugParamSchema = z.object({
  slug: z.string().trim().min(1, 'slug is required'),
});

const createRecipeSchema = z.object({
  title: z.string().trim().min(1, 'title is required'),
  description: z.string().optional(),
  recipe: z.string().trim().min(1, 'recipe is required'),
  photo: z.string().trim().min(1).optional(),
  category: z
    .union([z.number().int().positive(), z.string().trim().min(1)])
    .optional(),
});

const updateRecipeSchema = z
  .object({
    title: z.string().trim().min(1).optional(),
    description: z.union([z.string(), z.null()]).optional(),
    recipe: z.string().trim().min(1).optional(),
    photo: z.string().trim().min(1).optional(),
    slug: z.string().trim().min(1).optional(),
    category: z
      .union([z.number().int().positive(), z.string().trim().min(1), z.null()])
      .optional(),
  })
  .refine((value) => Object.keys(value).length > 0, {
    message: 'at least one field is required',
  });

export { slugParamSchema, createRecipeSchema, updateRecipeSchema };

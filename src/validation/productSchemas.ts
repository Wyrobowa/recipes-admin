import { z } from 'zod';

const macroSchema = z.preprocess((value) => {
  if (typeof value === 'string' && value.trim() === '') {
    return undefined;
  }

  return value;
}, z.coerce.number().min(0, 'value must be greater than or equal to 0'));

const createProductSchema = z.object({
  name: z.string().trim().min(1, 'name is required'),
  unit: z.string().trim().min(1, 'unit is required'),
  protein_g: macroSchema,
  carbs_g: macroSchema,
  fat_g: macroSchema,
});

const updateProductSchema = z.object({
  name: z.string().trim().min(1, 'name is required'),
  unit: z.string().trim().min(1, 'unit is required'),
  protein_g: macroSchema,
  carbs_g: macroSchema,
  fat_g: macroSchema,
});

const productIdParamSchema = z.object({
  id: z.coerce.number().int().positive(),
});

export { createProductSchema, updateProductSchema, productIdParamSchema };

import { z } from 'zod';

const createCategorySchema = z.object({
  name: z.string().trim().min(1, 'name is required'),
});

export { createCategorySchema };

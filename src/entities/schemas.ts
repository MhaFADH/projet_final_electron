import { z } from 'zod';

export const newProductSchema = z.object({
  barcode: z.string().min(1).nullable().optional(),
  name: z.string().min(1),
  brand: z.string().min(1).nullable().optional(),
  category: z.string().min(1).nullable().optional(),
  priceCents: z.number().int().nonnegative(),
  stock: z.number().int().nonnegative(),
});

export const productUpdateSchema = newProductSchema.partial();

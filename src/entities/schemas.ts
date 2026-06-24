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

export const cartItemSchema = z.object({
  productId: z.number().int().positive(),
  quantity: z.number().int().positive(),
});

export const cartSchema = z.array(cartItemSchema).min(1);

export const prefsPatchSchema = z.object({
  language: z.enum(['fr', 'en']).optional(),
  theme: z.enum(['light', 'dark']).optional(),
});

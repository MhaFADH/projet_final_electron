import { describe, it, expect } from 'vitest';
import { newProductSchema } from './schemas';

describe('newProductSchema', () => {
  it('accepts a valid product', () => {
    const result = newProductSchema.safeParse({
      name: 'Lait',
      priceCents: 99,
      stock: 10,
    });
    expect(result.success).toBe(true);
  });

  it('rejects a negative price', () => {
    const result = newProductSchema.safeParse({
      name: 'Lait',
      priceCents: -1,
      stock: 10,
    });
    expect(result.success).toBe(false);
  });

  it('rejects an empty name', () => {
    const result = newProductSchema.safeParse({
      name: '',
      priceCents: 99,
      stock: 10,
    });
    expect(result.success).toBe(false);
  });

  it('rejects a non-integer stock', () => {
    const result = newProductSchema.safeParse({
      name: 'Lait',
      priceCents: 99,
      stock: 1.5,
    });
    expect(result.success).toBe(false);
  });
});

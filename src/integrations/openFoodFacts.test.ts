import { describe, it, expect } from 'vitest';
import { createOpenFoodFacts } from './openFoodFacts';

const fakeFetch = (body: unknown, ok = true): typeof fetch =>
  (async () => ({ ok, json: async () => body })) as unknown as typeof fetch;

describe('openFoodFacts.lookup', () => {
  it('maps a found product (first brand and category segment)', async () => {
    const off = createOpenFoodFacts(
      fakeFetch({
        status: 1,
        product: {
          product_name: 'Nutella',
          brands: 'Ferrero, Nutella',
          categories: 'Spreads, Sweet spreads',
        },
      }),
    );
    expect(await off.lookup('3017620422003')).toEqual({
      barcode: '3017620422003',
      name: 'Nutella',
      brand: 'Ferrero',
      category: 'Spreads',
    });
  });

  it('returns null when not found (status 0)', async () => {
    const off = createOpenFoodFacts(fakeFetch({ status: 0 }));
    expect(await off.lookup('0000')).toBeNull();
  });

  it('returns null when the response is not ok', async () => {
    const off = createOpenFoodFacts(fakeFetch({}, false));
    expect(await off.lookup('123')).toBeNull();
  });

  it('returns null when fetch throws (offline)', async () => {
    const off = createOpenFoodFacts((() => {
      throw new Error('offline');
    }) as unknown as typeof fetch);
    expect(await off.lookup('123')).toBeNull();
  });

  it('maps missing optional fields to null', async () => {
    const off = createOpenFoodFacts(
      fakeFetch({ status: 1, product: { product_name: 'Sel' } }),
    );
    expect(await off.lookup('111')).toEqual({
      barcode: '111',
      name: 'Sel',
      brand: null,
      category: null,
    });
  });
});

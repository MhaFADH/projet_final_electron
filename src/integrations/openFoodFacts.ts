import type { ProductLookup } from '../entities/types';

const firstSegment = (value: unknown): string | null => {
  if (typeof value !== 'string') {
    return null;
  }
  const segment = value.split(',')[0]?.trim();
  return segment ? segment : null;
};

export const createOpenFoodFacts = (fetchFn: typeof fetch = fetch) => {
  const lookup = async (barcode: string): Promise<ProductLookup | null> => {
    try {
      const response = await fetchFn(
        `https://world.openfoodfacts.org/api/v0/product/${barcode}.json`,
      );
      if (!response.ok) {
        return null;
      }
      const data = (await response.json()) as {
        status?: number;
        product?: {
          product_name?: string;
          brands?: string;
          categories?: string;
        };
      };
      if (data.status !== 1 || !data.product) {
        return null;
      }
      return {
        barcode,
        name: data.product.product_name?.trim() || null,
        brand: firstSegment(data.product.brands),
        category: firstSegment(data.product.categories),
      };
    } catch {
      return null;
    }
  };

  return { lookup };
};

export type OpenFoodFacts = ReturnType<typeof createOpenFoodFacts>;

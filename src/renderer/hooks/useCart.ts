import { useState } from 'react';
import type { Product } from '../../entities/types';

export interface CartLine {
  productId: number;
  name: string;
  unitPriceCents: number;
  quantity: number;
}

export const useCart = () => {
  const [lines, setLines] = useState<CartLine[]>([]);

  const add = (product: Product) =>
    setLines((prev) => {
      const existing = prev.find((l) => l.productId === product.id);
      if (existing) {
        return prev.map((l) =>
          l.productId === product.id ? { ...l, quantity: l.quantity + 1 } : l,
        );
      }
      return [
        ...prev,
        {
          productId: product.id,
          name: product.name,
          unitPriceCents: product.priceCents,
          quantity: 1,
        },
      ];
    });

  const setQuantity = (productId: number, quantity: number) =>
    setLines((prev) =>
      prev
        .map((l) => (l.productId === productId ? { ...l, quantity } : l))
        .filter((l) => l.quantity > 0),
    );

  const remove = (productId: number) =>
    setLines((prev) => prev.filter((l) => l.productId !== productId));

  const clear = () => setLines([]);

  const totalCents = lines.reduce(
    (sum, l) => sum + l.unitPriceCents * l.quantity,
    0,
  );

  return { lines, add, setQuantity, remove, clear, totalCents };
};

import { useCallback, useEffect, useState } from 'react';
import type { NewProduct, Product } from '../../entities/types';

export const useProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [query, setQuery] = useState('');

  const refresh = useCallback(async () => {
    const list = query.trim()
      ? await window.api.products.search(query.trim())
      : await window.api.products.list();
    setProducts(list);
  }, [query]);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const add = useCallback(
    async (input: NewProduct) => {
      await window.api.products.create(input);
      await refresh();
    },
    [refresh],
  );

  const remove = useCallback(
    async (id: number) => {
      await window.api.products.remove(id);
      await refresh();
    },
    [refresh],
  );

  return { products, query, setQuery, add, remove };
};

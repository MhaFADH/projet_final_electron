import type { Product, NewProduct, ProductUpdate, ProductRow } from '../entities/types';
import { newProductSchema, productUpdateSchema } from '../entities/schemas';
import type { ProductRepository } from '../repositories/productRepository';

export const createProductService = (repo: ProductRepository) => {
  const create = (input: NewProduct): Product => {
    const data = newProductSchema.parse(input);
    const now = new Date().toISOString();
    const row: ProductRow = {
      barcode: data.barcode ?? null,
      name: data.name,
      brand: data.brand ?? null,
      category: data.category ?? null,
      priceCents: data.priceCents,
      stock: data.stock,
      createdAt: now,
      updatedAt: now,
    };
    const id = repo.insert(row);
    return repo.findById(id) as Product;
  };

  const getById = (id: number): Product | null => repo.findById(id);

  const list = (): Product[] => repo.findAll();

  const update = (id: number, input: ProductUpdate): Product => {
    const existing = repo.findById(id);
    if (!existing) {
      throw new Error(`Product ${id} not found`);
    }
    const data = productUpdateSchema.parse(input);
    const row: ProductRow = {
      barcode: data.barcode ?? existing.barcode,
      name: data.name ?? existing.name,
      brand: data.brand ?? existing.brand,
      category: data.category ?? existing.category,
      priceCents: data.priceCents ?? existing.priceCents,
      stock: data.stock ?? existing.stock,
      createdAt: existing.createdAt,
      updatedAt: new Date().toISOString(),
    };
    repo.update(id, row);
    return repo.findById(id) as Product;
  };

  const remove = (id: number): void => repo.deleteById(id);

  const search = (query: string): Product[] => repo.search(query);

  return { create, getById, list, update, remove, search };
};

export type ProductService = ReturnType<typeof createProductService>;

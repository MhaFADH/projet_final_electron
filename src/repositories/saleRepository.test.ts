import { describe, it, expect, beforeEach } from 'vitest';
import { createDatabase } from '../services/database';
import { createProductRepository } from './productRepository';
import { createSaleRepository, type SaleRepository } from './saleRepository';

let repo: SaleRepository;
let productId: number;
beforeEach(() => {
  const db = createDatabase();
  const products = createProductRepository(db);
  productId = products.insert({
    barcode: null,
    name: 'Lait',
    brand: null,
    category: null,
    priceCents: 99,
    stock: 10,
    createdAt: '2026-06-23T10:00:00.000Z',
    updatedAt: '2026-06-23T10:00:00.000Z',
  });
  repo = createSaleRepository(db);
});

describe('saleRepository', () => {
  it('insertSale returns an id and findById reads it back with items', () => {
    const saleId = repo.insertSale({
      createdAt: '2026-06-23T10:00:00.000Z',
      totalCents: 297,
    });
    expect(saleId).toBeGreaterThan(0);

    repo.insertItem({
      saleId,
      productId,
      nameSnapshot: 'Lait',
      unitPriceCents: 99,
      quantity: 3,
      lineTotalCents: 297,
    });

    const sale = repo.findById(saleId);
    expect(sale?.totalCents).toBe(297);
    expect(sale?.items).toHaveLength(1);
    expect(sale?.items[0]?.nameSnapshot).toBe('Lait');
  });

  it('findById returns null for a missing id', () => {
    expect(repo.findById(999)).toBeNull();
  });

  it('returns a sale with an empty items array when it has none', () => {
    const saleId = repo.insertSale({
      createdAt: '2026-06-23T10:00:00.000Z',
      totalCents: 0,
    });
    expect(repo.findById(saleId)?.items).toEqual([]);
  });
});

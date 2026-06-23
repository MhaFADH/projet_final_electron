import { describe, it, expect, beforeEach } from 'vitest';
import { createDatabase } from './database';
import { createProductRepository } from '../repositories/productRepository';
import { createSaleRepository } from '../repositories/saleRepository';
import { createSaleService, type SaleService } from './saleService';
import { InsufficientStockError } from '../entities/errors';

let service: SaleService;
let products: ReturnType<typeof createProductRepository>;
let laitId: number;
let painId: number;

beforeEach(() => {
  const db = createDatabase();
  products = createProductRepository(db);
  const sales = createSaleRepository(db);
  const transaction = <T>(fn: () => T): T => db.transaction(fn)();
  service = createSaleService({ products, sales, transaction });

  const now = '2026-06-23T10:00:00.000Z';
  laitId = products.insert({
    barcode: null, name: 'Lait', brand: null, category: null,
    priceCents: 99, stock: 10, createdAt: now, updatedAt: now,
  });
  painId = products.insert({
    barcode: null, name: 'Pain', brand: null, category: null,
    priceCents: 120, stock: 5, createdAt: now, updatedAt: now,
  });
});

describe('saleService.createSale', () => {
  it('creates a sale, computes the total, and snapshots product data', () => {
    const sale = service.createSale([
      { productId: laitId, quantity: 3 },
      { productId: painId, quantity: 2 },
    ]);
    expect(sale.totalCents).toBe(3 * 99 + 2 * 120);
    expect(sale.items).toHaveLength(2);
    const lait = sale.items.find((i) => i.productId === laitId);
    expect(lait?.nameSnapshot).toBe('Lait');
    expect(lait?.unitPriceCents).toBe(99);
    expect(lait?.lineTotalCents).toBe(297);
  });

  it('decrements stock for each sold product', () => {
    service.createSale([{ productId: laitId, quantity: 3 }]);
    expect(products.findById(laitId)?.stock).toBe(7);
  });

  it('throws InsufficientStockError and writes nothing when stock is too low', () => {
    expect(() =>
      service.createSale([{ productId: painId, quantity: 6 }]),
    ).toThrow(InsufficientStockError);
    expect(products.findById(painId)?.stock).toBe(5);
  });

  it('throws when a product does not exist', () => {
    expect(() => service.createSale([{ productId: 999, quantity: 1 }])).toThrow();
  });

  it('rejects an empty cart', () => {
    expect(() => service.createSale([])).toThrow();
  });
});

describe('saleService history/getReceipt', () => {
  it('history with empty day returns all sales', () => {
    service.createSale([{ productId: laitId, quantity: 1 }]);
    service.createSale([{ productId: painId, quantity: 1 }]);
    expect(service.history('')).toHaveLength(2);
  });

  it('history filters by day', () => {
    service.createSale([{ productId: laitId, quantity: 1 }]);
    const today = new Date().toISOString().slice(0, 10);
    expect(service.history(today)).toHaveLength(1);
    expect(service.history('2099-01-01')).toHaveLength(0);
  });

  it('getReceipt returns the sale with its items', () => {
    const created = service.createSale([{ productId: laitId, quantity: 2 }]);
    const receipt = service.getReceipt(created.id);
    expect(receipt?.items).toHaveLength(1);
    expect(receipt?.items[0]?.quantity).toBe(2);
  });

  it('getReceipt returns null for a missing id', () => {
    expect(service.getReceipt(999)).toBeNull();
  });
});

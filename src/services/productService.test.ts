import { describe, it, expect, beforeEach } from 'vitest';
import { createDatabase } from './database';
import { createProductRepository } from '../repositories/productRepository';
import { createProductService, type ProductService } from './productService';

let service: ProductService;
beforeEach(() => {
  service = createProductService(createProductRepository(createDatabase()));
});

describe('productService.create', () => {
  it('creates a product and returns it with an id and timestamps', () => {
    const product = service.create({ name: 'Lait', priceCents: 99, stock: 10 });
    expect(product.id).toBeGreaterThan(0);
    expect(product.name).toBe('Lait');
    expect(product.priceCents).toBe(99);
    expect(product.stock).toBe(10);
    expect(product.barcode).toBeNull();
    expect(typeof product.createdAt).toBe('string');
  });

  it('rejects invalid input', () => {
    expect(() =>
      service.create({ name: '', priceCents: 99, stock: 1 }),
    ).toThrow();
  });

  it('getById returns the created product', () => {
    const created = service.create({ name: 'Pain', priceCents: 120, stock: 5 });
    expect(service.getById(created.id)).toEqual(created);
  });

  it('getById returns null for a missing id', () => {
    expect(service.getById(999)).toBeNull();
  });
});

describe('productService list/update/remove', () => {
  it('lists products ordered by name', () => {
    service.create({ name: 'Pain', priceCents: 120, stock: 5 });
    service.create({ name: 'Lait', priceCents: 99, stock: 10 });
    expect(service.list().map((p) => p.name)).toEqual(['Lait', 'Pain']);
  });

  it('updates a product and bumps updatedAt', () => {
    const created = service.create({ name: 'Lait', priceCents: 99, stock: 10 });
    const updated = service.update(created.id, { priceCents: 105 });
    expect(updated.priceCents).toBe(105);
    expect(updated.name).toBe('Lait');
  });

  it('throws when updating a missing product', () => {
    expect(() => service.update(999, { priceCents: 1 })).toThrow();
  });

  it('removes a product', () => {
    const created = service.create({ name: 'Lait', priceCents: 99, stock: 10 });
    service.remove(created.id);
    expect(service.getById(created.id)).toBeNull();
  });
});

describe('productService.search', () => {
  beforeEach(() => {
    service.create({ name: 'Lait demi-écrémé', priceCents: 99, stock: 10, barcode: '3001' });
    service.create({ name: 'Pain complet', priceCents: 120, stock: 5, barcode: '3002' });
  });

  it('matches by name fragment, case-insensitive', () => {
    expect(service.search('lait').map((p) => p.name)).toEqual(['Lait demi-écrémé']);
  });

  it('matches by barcode', () => {
    expect(service.search('3002').map((p) => p.name)).toEqual(['Pain complet']);
  });

  it('returns empty array on no match', () => {
    expect(service.search('zzz')).toEqual([]);
  });
});

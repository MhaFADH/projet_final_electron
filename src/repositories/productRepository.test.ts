import { describe, it, expect, beforeEach } from 'vitest';
import { createDatabase } from '../services/database';
import {
  createProductRepository,
  type ProductRepository,
} from './productRepository';
import type { ProductRow } from '../entities/types';

const row = (over: Partial<ProductRow> = {}): ProductRow => ({
  barcode: null,
  name: 'Lait',
  brand: null,
  category: null,
  priceCents: 99,
  stock: 10,
  createdAt: '2026-01-01T00:00:00.000Z',
  updatedAt: '2026-01-01T00:00:00.000Z',
  ...over,
});

let repo: ProductRepository;
beforeEach(() => {
  repo = createProductRepository(createDatabase());
});

describe('productRepository', () => {
  it('insert returns the new id and findById reads it back', () => {
    const id = repo.insert(row());
    expect(id).toBeGreaterThan(0);
    expect(repo.findById(id)?.name).toBe('Lait');
  });

  it('findById returns null for a missing id', () => {
    expect(repo.findById(999)).toBeNull();
  });

  it('findAll returns rows ordered by name', () => {
    repo.insert(row({ name: 'Pain' }));
    repo.insert(row({ name: 'Lait' }));
    expect(repo.findAll().map((p) => p.name)).toEqual(['Lait', 'Pain']);
  });

  it('update persists changes', () => {
    const id = repo.insert(row());
    repo.update(id, row({ priceCents: 150 }));
    expect(repo.findById(id)?.priceCents).toBe(150);
  });

  it('deleteById removes the row', () => {
    const id = repo.insert(row());
    repo.deleteById(id);
    expect(repo.findById(id)).toBeNull();
  });

  it('search matches name or barcode, case-insensitive', () => {
    repo.insert(row({ name: 'Lait demi-écrémé', barcode: '3001' }));
    repo.insert(row({ name: 'Pain complet', barcode: '3002' }));
    expect(repo.search('lait').map((p) => p.name)).toEqual(['Lait demi-écrémé']);
    expect(repo.search('3002').map((p) => p.name)).toEqual(['Pain complet']);
    expect(repo.search('zzz')).toEqual([]);
  });
});

describe('productRepository.decrementStock', () => {
  it('reduces stock by the given quantity', () => {
    const id = repo.insert(row({ stock: 10 }));
    repo.decrementStock(id, 3);
    expect(repo.findById(id)?.stock).toBe(7);
  });
});

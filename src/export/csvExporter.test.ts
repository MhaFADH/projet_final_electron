import { describe, it, expect } from 'vitest';
import { csvExporter } from './csvExporter';
import type { Product, Sale } from '../entities/types';

const sale = (over: Partial<Sale>): Sale => ({
  id: 1,
  createdAt: '2026-06-24T10:00:00.000Z',
  totalCents: 198,
  ...over,
});

const product = (over: Partial<Product>): Product => ({
  id: 1,
  barcode: null,
  name: 'Lait',
  brand: null,
  category: null,
  priceCents: 99,
  stock: 10,
  createdAt: '2026-06-24T10:00:00.000Z',
  updatedAt: '2026-06-24T10:00:00.000Z',
  ...over,
});

describe('csvExporter', () => {
  it('renders a Produits section then a Ventes section', () => {
    const csv = csvExporter.render({
      title: 'caisse',
      products: [product({ name: 'Lait', priceCents: 99, stock: 10 })],
      sales: [sale({ id: 1, totalCents: 198 })],
    });
    const [productPart, salesPart] = csv.split('\n\n');
    expect(productPart.split('\n')).toEqual([
      'Produits',
      'Nom,Code-barres,Marque,Catégorie,Prix (€),Stock',
      'Lait,,,,0.99,10',
    ]);
    expect(salesPart.split('\n')).toEqual([
      'Ventes',
      'Vente,Date,Total (€)',
      '1,2026-06-24T10:00:00.000Z,1.98',
    ]);
  });

  it('escapes product fields that contain a comma', () => {
    const csv = csvExporter.render({
      title: 'caisse',
      products: [product({ name: 'Lait, demi-écrémé', category: 'Boissons, lait' })],
      sales: [],
    });
    expect(csv).toContain('"Lait, demi-écrémé",,,"Boissons, lait",0.99,10');
  });
});

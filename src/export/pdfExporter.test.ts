import { describe, it, expect } from 'vitest';
import { pdfExporter } from './pdfExporter';
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

describe('pdfExporter', () => {
  it('renders an HTML document with a Produits and a Ventes section', () => {
    const html = pdfExporter.render({
      title: 'Caisse',
      products: [product({ name: 'Pain', stock: 5 })],
      sales: [sale({ id: 7, totalCents: 250 })],
    });
    expect(html).toContain('<html');
    expect(html).toContain('Caisse');
    expect(html).toContain('<h2>Produits</h2>');
    expect(html).toContain('<td>Pain</td>');
    expect(html).toContain('<h2>Ventes</h2>');
    expect(html).toContain('<td>7</td>');
    expect(html).toContain('2.50');
  });
});

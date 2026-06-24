import type { Exporter, ExportData } from './exporter';
import type { Product, Sale } from '../entities/types';

const euros = (cents: number): string => (cents / 100).toFixed(2) + ' €';

const productRows = (products: Product[]): string =>
  products
    .map(
      (p) =>
        `<tr><td>${p.name}</td><td>${p.barcode ?? ''}</td><td>${p.brand ?? ''}</td><td>${p.category ?? ''}</td><td>${euros(p.priceCents)}</td><td>${p.stock}</td></tr>`,
    )
    .join('');

const saleRows = (sales: Sale[]): string =>
  sales
    .map(
      (s) =>
        `<tr><td>${s.id}</td><td>${s.createdAt}</td><td>${euros(s.totalCents)}</td></tr>`,
    )
    .join('');

export const pdfExporter: Exporter = {
  format: 'pdf',
  extension: 'pdf',
  label: 'PDF',
  render: ({ title, products, sales }: ExportData): string =>
    `<!doctype html><html lang="fr"><head><meta charset="utf-8"><style>
      body { font-family: sans-serif; padding: 24px; color: #111; }
      h1 { font-size: 18px; }
      h2 { font-size: 14px; margin-top: 24px; }
      table { width: 100%; border-collapse: collapse; }
      th, td { text-align: left; padding: 6px; border-bottom: 1px solid #ccc; }
    </style></head><body>
      <h1>${title}</h1>
      <h2>Produits</h2>
      <table><thead><tr><th>Nom</th><th>Code-barres</th><th>Marque</th><th>Catégorie</th><th>Prix</th><th>Stock</th></tr></thead>
      <tbody>${productRows(products)}</tbody></table>
      <h2>Ventes</h2>
      <table><thead><tr><th>Vente</th><th>Date</th><th>Total</th></tr></thead>
      <tbody>${saleRows(sales)}</tbody></table>
    </body></html>`,
};

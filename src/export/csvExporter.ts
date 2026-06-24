import type { Exporter, ExportData } from './exporter';
import type { Product, Sale } from '../entities/types';

const euros = (cents: number): string => (cents / 100).toFixed(2);

const cell = (value: string | number): string => {
  const text = String(value);
  return /[",\n]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
};

const productSection = (products: Product[]): string => {
  const header = 'Nom,Code-barres,Marque,Catégorie,Prix (€),Stock';
  const rows = products.map((p) =>
    [
      cell(p.name),
      cell(p.barcode ?? ''),
      cell(p.brand ?? ''),
      cell(p.category ?? ''),
      euros(p.priceCents),
      p.stock,
    ].join(','),
  );
  return ['Produits', header, ...rows].join('\n');
};

const salesSection = (sales: Sale[]): string => {
  const header = 'Vente,Date,Total (€)';
  const rows = sales.map((s) => `${s.id},${s.createdAt},${euros(s.totalCents)}`);
  return ['Ventes', header, ...rows].join('\n');
};

export const csvExporter: Exporter = {
  format: 'csv',
  extension: 'csv',
  label: 'CSV',
  render: ({ products, sales }: ExportData): string =>
    [productSection(products), salesSection(sales)].join('\n\n'),
};

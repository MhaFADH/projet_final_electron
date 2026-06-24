import type { Product, Sale } from '../entities/types';

export type ExportFormat = 'csv' | 'pdf';

export interface ExportData {
  title: string;
  products: Product[];
  sales: Sale[];
}

export interface ExportResult {
  saved: boolean;
  path?: string;
}

export type ExportRunner = (
  format: ExportFormat,
  day: string,
) => Promise<ExportResult>;

export interface Exporter {
  format: ExportFormat;
  extension: string;
  label: string;
  render(data: ExportData): string;
}

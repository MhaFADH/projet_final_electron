import type { ExportFormat, Exporter } from './exporter';
import { csvExporter } from './csvExporter';
import { pdfExporter } from './pdfExporter';

export const exporters: Record<ExportFormat, Exporter> = {
  csv: csvExporter,
  pdf: pdfExporter,
};

export type { ExportFormat, Exporter, ExportData, ExportResult, ExportRunner } from './exporter';

import { describe, it, expect } from 'vitest';
import { exporters } from './index';

describe('exporters lookup', () => {
  it('maps each format to its exporter', () => {
    expect(exporters.csv.format).toBe('csv');
    expect(exporters.csv.extension).toBe('csv');
    expect(exporters.pdf.format).toBe('pdf');
    expect(exporters.pdf.extension).toBe('pdf');
  });
});

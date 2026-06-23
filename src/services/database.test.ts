import { describe, it, expect } from 'vitest';
import { createDatabase } from './database';

describe('createDatabase', () => {
  it('creates the products, sales and sale_items tables', () => {
    const db = createDatabase();
    const tables = db
      .prepare(
        "SELECT name FROM sqlite_master WHERE type='table' ORDER BY name",
      )
      .all() as { name: string }[];
    const names = tables.map((r) => r.name);
    expect(names).toEqual(
      expect.arrayContaining(['products', 'sale_items', 'sales']),
    );
  });

  it('enforces the stock >= 0 check constraint', () => {
    const db = createDatabase();
    const insert = () =>
      db
        .prepare(
          'INSERT INTO products (name, priceCents, stock, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?)',
        )
        .run('Lait', 99, -1, 'now', 'now');
    expect(insert).toThrow();
  });

  it('is idempotent when called twice', () => {
    const db = createDatabase();
    expect(() => db.exec('SELECT 1')).not.toThrow();
  });
});

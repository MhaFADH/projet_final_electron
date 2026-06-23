import type Database from 'better-sqlite3';
import type {
  Sale,
  SaleItem,
  SaleWithItems,
  SaleRow,
  SaleItemRow,
} from '../entities/types';

export const createSaleRepository = (db: Database.Database) => {
  const insertSale = (row: SaleRow): number => {
    const info = db
      .prepare(
        'INSERT INTO sales (createdAt, totalCents) VALUES (@createdAt, @totalCents)',
      )
      .run(row);
    return Number(info.lastInsertRowid);
  };

  const insertItem = (row: SaleItemRow): void => {
    db.prepare(
      `INSERT INTO sale_items (saleId, productId, nameSnapshot, unitPriceCents, quantity, lineTotalCents)
       VALUES (@saleId, @productId, @nameSnapshot, @unitPriceCents, @quantity, @lineTotalCents)`,
    ).run(row);
  };

  const findById = (id: number): SaleWithItems | null => {
    const sale = db.prepare('SELECT * FROM sales WHERE id = ?').get(id) as
      | Sale
      | undefined;
    if (!sale) {
      return null;
    }
    const items = db
      .prepare('SELECT * FROM sale_items WHERE saleId = ? ORDER BY id')
      .all(id) as SaleItem[];
    return { ...sale, items };
  };

  const list = (): Sale[] =>
    db
      .prepare('SELECT * FROM sales ORDER BY createdAt DESC, id DESC')
      .all() as Sale[];

  const listByDate = (day: string): Sale[] =>
    db
      .prepare(
        'SELECT * FROM sales WHERE createdAt LIKE ? ORDER BY createdAt DESC, id DESC',
      )
      .all(`${day}%`) as Sale[];

  return { insertSale, insertItem, findById, list, listByDate };
};

export type SaleRepository = ReturnType<typeof createSaleRepository>;

import type Database from 'better-sqlite3';
import type { Product, ProductRow } from '../entities/types';

export const createProductRepository = (db: Database.Database) => {
  const insert = (row: ProductRow): number => {
    const info = db
      .prepare(
        `INSERT INTO products (barcode, name, brand, category, priceCents, stock, createdAt, updatedAt)
         VALUES (@barcode, @name, @brand, @category, @priceCents, @stock, @createdAt, @updatedAt)`,
      )
      .run(row);
    return Number(info.lastInsertRowid);
  };

  const findById = (id: number): Product | null => {
    const row = db.prepare('SELECT * FROM products WHERE id = ?').get(id);
    return (row as Product) ?? null;
  };

  const findAll = (): Product[] =>
    db.prepare('SELECT * FROM products ORDER BY name').all() as Product[];

  const update = (id: number, row: ProductRow): void => {
    db.prepare(
      `UPDATE products SET barcode=@barcode, name=@name, brand=@brand,
       category=@category, priceCents=@priceCents, stock=@stock,
       createdAt=@createdAt, updatedAt=@updatedAt
       WHERE id=@id`,
    ).run({ ...row, id });
  };

  const deleteById = (id: number): void => {
    db.prepare('DELETE FROM products WHERE id = ?').run(id);
  };

  const search = (query: string): Product[] => {
    const like = `%${query}%`;
    return db
      .prepare(
        `SELECT * FROM products
         WHERE name LIKE ? COLLATE NOCASE OR barcode LIKE ? COLLATE NOCASE
         ORDER BY name`,
      )
      .all(like, like) as Product[];
  };

  return { insert, findById, findAll, update, deleteById, search };
};

export type ProductRepository = ReturnType<typeof createProductRepository>;

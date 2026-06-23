import Database from 'better-sqlite3';
import schema from './schema.sql';

export const migrate = (db: Database.Database): void => {
  db.exec(schema);
};

export const createDatabase = (path = ':memory:'): Database.Database => {
  const db = new Database(path);
  db.pragma('foreign_keys = ON');
  migrate(db);
  return db;
};

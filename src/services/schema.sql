CREATE TABLE IF NOT EXISTS products (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  barcode TEXT UNIQUE,
  name TEXT NOT NULL,
  brand TEXT,
  category TEXT,
  priceCents INTEGER NOT NULL CHECK (priceCents >= 0),
  stock INTEGER NOT NULL CHECK (stock >= 0),
  createdAt TEXT NOT NULL,
  updatedAt TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS sales (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  createdAt TEXT NOT NULL,
  totalCents INTEGER NOT NULL CHECK (totalCents >= 0)
);

CREATE INDEX IF NOT EXISTS idx_sales_createdAt ON sales(createdAt);

CREATE TABLE IF NOT EXISTS sale_items (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  saleId INTEGER NOT NULL REFERENCES sales(id) ON DELETE CASCADE,
  productId INTEGER NOT NULL REFERENCES products(id),
  nameSnapshot TEXT NOT NULL,
  unitPriceCents INTEGER NOT NULL,
  quantity INTEGER NOT NULL CHECK (quantity >= 1),
  lineTotalCents INTEGER NOT NULL
);

export interface Product {
  id: number;
  barcode: string | null;
  name: string;
  brand: string | null;
  category: string | null;
  priceCents: number;
  stock: number;
  createdAt: string;
  updatedAt: string;
}

export interface NewProduct {
  barcode?: string | null;
  name: string;
  brand?: string | null;
  category?: string | null;
  priceCents: number;
  stock: number;
}

export type ProductUpdate = Partial<NewProduct>;

export type ProductRow = Omit<Product, 'id'>;

export interface ProductLookup {
  barcode: string;
  name: string | null;
  brand: string | null;
  category: string | null;
}

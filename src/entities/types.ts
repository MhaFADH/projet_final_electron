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

export interface Sale {
  id: number;
  createdAt: string;
  totalCents: number;
}

export interface SaleItem {
  id: number;
  saleId: number;
  productId: number;
  nameSnapshot: string;
  unitPriceCents: number;
  quantity: number;
  lineTotalCents: number;
}

export interface SaleWithItems extends Sale {
  items: SaleItem[];
}

export interface CartItem {
  productId: number;
  quantity: number;
}

export type SaleRow = Omit<Sale, 'id'>;
export type SaleItemRow = Omit<SaleItem, 'id'>;

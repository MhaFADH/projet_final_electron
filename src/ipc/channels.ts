import type { Product, NewProduct, ProductUpdate, ProductLookup } from '../entities/types';

export const productChannels = {
  list: 'products:list',
  getById: 'products:getById',
  create: 'products:create',
  update: 'products:update',
  remove: 'products:remove',
  search: 'products:search',
} as const;

export interface ProductApi {
  list(): Promise<Product[]>;
  getById(id: number): Promise<Product | null>;
  create(input: NewProduct): Promise<Product>;
  update(id: number, input: ProductUpdate): Promise<Product>;
  remove(id: number): Promise<void>;
  search(query: string): Promise<Product[]>;
}

export const offChannels = {
  lookup: 'off:lookup',
} as const;

export interface OffApi {
  lookup(barcode: string): Promise<ProductLookup | null>;
}

export interface Api {
  products: ProductApi;
  off: OffApi;
}

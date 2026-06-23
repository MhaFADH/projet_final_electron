import type { Product, NewProduct, ProductUpdate } from '../entities/types';

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

export interface Api {
  products: ProductApi;
}

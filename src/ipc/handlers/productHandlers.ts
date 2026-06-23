import { z } from 'zod';
import { newProductSchema, productUpdateSchema } from '../../entities/schemas';
import type { NewProduct, ProductUpdate } from '../../entities/types';
import type { ProductService } from '../../services/productService';
import { productChannels } from '../channels';
import type { Command } from '../registry';

export const productHandlers = (products: ProductService): Command[] => [
  {
    channel: productChannels.list,
    schema: z.tuple([]),
    handle: () => products.list(),
  },
  {
    channel: productChannels.getById,
    schema: z.tuple([z.number().int()]),
    handle: (id: number) => products.getById(id),
  },
  {
    channel: productChannels.create,
    schema: z.tuple([newProductSchema]),
    handle: (input: NewProduct) => products.create(input),
  },
  {
    channel: productChannels.update,
    schema: z.tuple([z.number().int(), productUpdateSchema]),
    handle: (id: number, input: ProductUpdate) => products.update(id, input),
  },
  {
    channel: productChannels.remove,
    schema: z.tuple([z.number().int()]),
    handle: (id: number) => products.remove(id),
  },
  {
    channel: productChannels.search,
    schema: z.tuple([z.string()]),
    handle: (query: string) => products.search(query),
  },
];

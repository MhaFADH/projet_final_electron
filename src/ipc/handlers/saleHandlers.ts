import { z } from 'zod';
import { cartSchema } from '../../entities/schemas';
import type { CartItem } from '../../entities/types';
import type { SaleService } from '../../services/saleService';
import { saleChannels } from '../channels';
import type { Command } from '../registry';

export const saleHandlers = (sales: SaleService): Command[] => [
  {
    channel: saleChannels.create,
    schema: z.tuple([cartSchema]),
    handle: (cart: CartItem[]) => sales.createSale(cart),
  },
  {
    channel: saleChannels.history,
    schema: z.tuple([z.string()]),
    handle: (day: string) => sales.history(day),
  },
  {
    channel: saleChannels.receipt,
    schema: z.tuple([z.number().int()]),
    handle: (id: number) => sales.getReceipt(id),
  },
];

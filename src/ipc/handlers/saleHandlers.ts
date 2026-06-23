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
];

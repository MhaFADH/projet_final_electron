import type { ProductService } from '../services/productService';
import type { SaleService } from '../services/saleService';
import type { OpenFoodFacts } from '../integrations/openFoodFacts';
import { registerCommands, type IpcMainLike } from './registry';
import { productHandlers } from './handlers/productHandlers';
import { offHandlers } from './handlers/offHandlers';
import { saleHandlers } from './handlers/saleHandlers';

export interface Services {
  products: ProductService;
  off: OpenFoodFacts;
  sales: SaleService;
}

export const registerHandlers = (
  ipcMain: IpcMainLike,
  services: Services,
): void => {
  registerCommands(ipcMain, [
    ...productHandlers(services.products),
    ...offHandlers(services.off),
    ...saleHandlers(services.sales),
  ]);
};

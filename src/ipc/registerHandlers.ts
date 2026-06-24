import type { ProductService } from '../services/productService';
import type { SaleService } from '../services/saleService';
import type { OpenFoodFacts } from '../integrations/openFoodFacts';
import type { ExportRunner } from '../export/exporter';
import { registerCommands, type IpcMainLike } from './registry';
import { productHandlers } from './handlers/productHandlers';
import { offHandlers } from './handlers/offHandlers';
import { saleHandlers } from './handlers/saleHandlers';
import { exportHandlers } from './handlers/exportHandlers';

export interface Services {
  products: ProductService;
  sales: SaleService;
  off: OpenFoodFacts;
  export: ExportRunner;
}

export const registerHandlers = (
  ipcMain: IpcMainLike,
  services: Services,
): void => {
  registerCommands(ipcMain, [
    ...productHandlers(services.products),
    ...saleHandlers(services.sales),
    ...offHandlers(services.off),
    ...exportHandlers(services.export),
  ]);
};

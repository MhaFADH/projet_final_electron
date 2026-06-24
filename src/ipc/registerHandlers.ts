import type { ProductService } from '../services/productService';
import type { SaleService } from '../services/saleService';
import type { OpenFoodFacts } from '../integrations/openFoodFacts';
import type { ExportRunner } from '../export/exporter';
import type { PrefsStore } from '../services/prefsStore';
import { registerCommands, type IpcMainLike } from './registry';
import { productHandlers } from './handlers/productHandlers';
import { offHandlers } from './handlers/offHandlers';
import { saleHandlers } from './handlers/saleHandlers';
import { exportHandlers } from './handlers/exportHandlers';
import { prefsHandlers } from './handlers/prefsHandlers';

export interface Services {
  products: ProductService;
  sales: SaleService;
  off: OpenFoodFacts;
  export: ExportRunner;
  prefs: PrefsStore;
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
    ...prefsHandlers(services.prefs),
  ]);
};

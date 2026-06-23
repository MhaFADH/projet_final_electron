import type { ProductService } from '../services/productService';
import { registerCommands, type IpcMainLike } from './registry';
import { productHandlers } from './handlers/productHandlers';

export interface Services {
  products: ProductService;
}

export const registerHandlers = (
  ipcMain: IpcMainLike,
  services: Services,
): void => {
  registerCommands(ipcMain, productHandlers(services.products));
};

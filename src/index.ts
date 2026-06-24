import { app, BrowserWindow, ipcMain } from 'electron';
import path from 'node:path';
import { createDatabase } from './services/database';
import { createProductRepository } from './repositories/productRepository';
import { createProductService } from './services/productService';
import { createSaleRepository } from './repositories/saleRepository';
import { createSaleService } from './services/saleService';
import { registerHandlers } from './ipc/registerHandlers';
import { createOpenFoodFacts } from './integrations/openFoodFacts';
import { exporters } from './export';
import { exportToFile } from './export/exportToFile';
import type { ExportRunner } from './export/exporter';

declare const MAIN_WINDOW_WEBPACK_ENTRY: string;
declare const MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY: string;

if (require('electron-squirrel-startup')) {
  app.quit();
}

const createWindow = (): void => {
  const mainWindow = new BrowserWindow({
    height: 600,
    width: 800,
    webPreferences: {
      preload: MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY,
    },
  });

  mainWindow.loadURL(MAIN_WINDOW_WEBPACK_ENTRY);

  mainWindow.webContents.openDevTools();
};

app.on('ready', () => {
  const db = createDatabase(path.join(app.getPath('userData'), 'caisse.db'));
  const productRepo = createProductRepository(db);
  const saleRepo = createSaleRepository(db);
  const transaction = <T>(fn: () => T): T => db.transaction(fn)();
  const saleService = createSaleService({
    products: productRepo,
    sales: saleRepo,
    transaction,
  });
  const productService = createProductService(productRepo);
  const runExport: ExportRunner = (format, day) =>
    exportToFile(exporters[format], {
      title: `caisse-${day || 'complet'}`,
      products: productService.list(),
      sales: saleService.history(day),
    });
  registerHandlers(ipcMain, {
    products: productService,
    sales: saleService,
    off: createOpenFoodFacts(),
    export: runExport,
  });
  createWindow();
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
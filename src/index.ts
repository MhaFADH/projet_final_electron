import { app, BrowserWindow, ipcMain } from 'electron';
import path from 'node:path';
import { createDatabase } from './services/database';
import { createProductRepository } from './repositories/productRepository';
import { createProductService } from './services/productService';
import { registerHandlers } from './ipc/registerHandlers';
import { createOpenFoodFacts } from './integrations/openFoodFacts';

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
  registerHandlers(ipcMain, {
    products: createProductService(createProductRepository(db)),
    off: createOpenFoodFacts(),
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
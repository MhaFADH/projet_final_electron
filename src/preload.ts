import { contextBridge, ipcRenderer } from 'electron';
import { productChannels, offChannels, type Api } from './ipc/channels';

const api: Api = {
  products: {
    list: () => ipcRenderer.invoke(productChannels.list, []),
    getById: (id) => ipcRenderer.invoke(productChannels.getById, [id]),
    create: (input) => ipcRenderer.invoke(productChannels.create, [input]),
    update: (id, input) => ipcRenderer.invoke(productChannels.update, [id, input]),
    remove: (id) => ipcRenderer.invoke(productChannels.remove, [id]),
    search: (query) => ipcRenderer.invoke(productChannels.search, [query]),
  },
  off: {
    lookup: (barcode) => ipcRenderer.invoke(offChannels.lookup, [barcode]),
  },
};

contextBridge.exposeInMainWorld('api', api);

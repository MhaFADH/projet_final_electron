import { contextBridge, ipcRenderer } from 'electron';
import { productChannels, offChannels, saleChannels, type Api } from './ipc/channels';
import { ClientError, type IpcResult } from './ipc/errors';

const invoke = async <T>(channel: string, args: unknown[]): Promise<T> => {
  const result = (await ipcRenderer.invoke(channel, args)) as IpcResult<unknown>;
  if (result.ok) {
    return result.value as T;
  }
  throw new ClientError(result.error.code, result.error.message);
};

const api: Api = {
  products: {
    list: () => invoke(productChannels.list, []),
    getById: (id) => invoke(productChannels.getById, [id]),
    create: (input) => invoke(productChannels.create, [input]),
    update: (id, input) => invoke(productChannels.update, [id, input]),
    remove: (id) => invoke(productChannels.remove, [id]),
    search: (query) => invoke(productChannels.search, [query]),
  },
  off: {
    lookup: (barcode) => invoke(offChannels.lookup, [barcode]),
  },
  sales: {
    create: (cart) => invoke(saleChannels.create, [cart]),
  },
};

contextBridge.exposeInMainWorld('api', api);

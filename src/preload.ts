import { contextBridge, ipcRenderer } from 'electron';
import { productChannels, type Api } from './ipc/channels';

const products = Object.fromEntries(
  Object.entries(productChannels).map(([method, channel]) => [
    method,
    (...args: unknown[]) => ipcRenderer.invoke(channel, args),
  ]),
) as unknown as Api['products'];

contextBridge.exposeInMainWorld('api', { products } satisfies Api);

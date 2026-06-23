import type { Api } from './ipc/channels';

declare global {
  interface Window {
    api: Api;
  }
}

export {};

import Store from 'electron-store';
import type { Prefs } from '../entities/types';

const defaults: Prefs = { language: 'fr', theme: 'light' };

export const createPrefsStore = () => {
  const store = new Store<Prefs>({ defaults });

  const get = (): Prefs => ({
    language: store.get('language'),
    theme: store.get('theme'),
  });

  const set = (patch: Partial<Prefs>): Prefs => {
    if (patch.language) {
      store.set('language', patch.language);
    }
    if (patch.theme) {
      store.set('theme', patch.theme);
    }
    return get();
  };

  return { get, set };
};

export type PrefsStore = ReturnType<typeof createPrefsStore>;

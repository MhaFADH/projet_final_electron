import { z } from 'zod';
import { prefsPatchSchema } from '../../entities/schemas';
import type { Prefs } from '../../entities/types';
import type { PrefsStore } from '../../services/prefsStore';
import { prefsChannels } from '../channels';
import type { Command } from '../registry';

export const prefsHandlers = (prefs: PrefsStore): Command[] => [
  {
    channel: prefsChannels.get,
    schema: z.tuple([]),
    handle: () => prefs.get(),
  },
  {
    channel: prefsChannels.set,
    schema: z.tuple([prefsPatchSchema]),
    handle: (patch: Partial<Prefs>) => prefs.set(patch),
  },
];

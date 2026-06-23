import { z } from 'zod';
import type { OpenFoodFacts } from '../../integrations/openFoodFacts';
import { offChannels } from '../channels';
import type { Command } from '../registry';

export const offHandlers = (off: OpenFoodFacts): Command[] => [
  {
    channel: offChannels.lookup,
    schema: z.tuple([z.string()]),
    handle: (barcode: string) => off.lookup(barcode),
  },
];

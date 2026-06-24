import { z } from 'zod';
import type { ExportFormat, ExportRunner } from '../../export/exporter';
import { exportChannels } from '../channels';
import type { Command } from '../registry';

export const exportHandlers = (run: ExportRunner): Command[] => [
  {
    channel: exportChannels.run,
    schema: z.tuple([z.enum(['csv', 'pdf']), z.string()]),
    handle: (format: ExportFormat, day: string) => run(format, day),
  },
];

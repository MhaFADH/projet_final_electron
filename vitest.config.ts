import { defineConfig, type Plugin } from 'vitest/config';
import { readFileSync } from 'node:fs';

const sqlRaw = (): Plugin => ({
  name: 'sql-raw',
  transform(_code: string, id: string) {
    if (!id.endsWith('.sql')) {
      return null;
    }
    const content = readFileSync(id, 'utf-8');
    return { code: `export default ${JSON.stringify(content)};`, map: null };
  },
});

export default defineConfig({
  plugins: [sqlRaw()],
  test: {
    environment: 'node',
    pool: 'threads',
    include: ['src/**/*.test.ts'],
  },
});

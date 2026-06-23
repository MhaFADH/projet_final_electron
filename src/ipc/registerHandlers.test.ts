import { describe, it, expect, beforeEach } from 'vitest';
import { createDatabase } from '../services/database';
import { createProductRepository } from '../repositories/productRepository';
import { createProductService } from '../services/productService';
import { createOpenFoodFacts } from '../integrations/openFoodFacts';
import { registerHandlers } from './registerHandlers';

type Handler = (event: unknown, args: unknown[]) => unknown;

const makeFakeIpc = () => {
  const handlers = new Map<string, Handler>();
  return {
    handle: (channel: string, fn: Handler) => handlers.set(channel, fn),
    invoke: (channel: string, args: unknown[]) => {
      const fn = handlers.get(channel);
      if (!fn) throw new Error(`No handler for ${channel}`);
      return fn(null, args);
    },
  };
};

let ipc: ReturnType<typeof makeFakeIpc>;
beforeEach(() => {
  ipc = makeFakeIpc();
  const products = createProductService(
    createProductRepository(createDatabase()),
  );
  const off = createOpenFoodFacts(
    (() => {
      throw new Error('no network in tests');
    }) as unknown as typeof fetch,
  );
  registerHandlers(ipc, { products, off });
});

describe('registerHandlers', () => {
  it('creates and lists products through channels', () => {
    const created = ipc.invoke('products:create', [
      { name: 'Lait', priceCents: 99, stock: 10 },
    ]) as { id: number };
    expect(created.id).toBeGreaterThan(0);
    expect((ipc.invoke('products:list', []) as unknown[]).length).toBe(1);
  });

  it('validates arguments with the zod request schema', () => {
    expect(() => ipc.invoke('products:getById', ['not-a-number'])).toThrow();
  });

  it('searches through the channel', () => {
    ipc.invoke('products:create', [{ name: 'Pain', priceCents: 120, stock: 5 }]);
    const found = ipc.invoke('products:search', ['pain']) as { name: string }[];
    expect(found.map((p) => p.name)).toEqual(['Pain']);
  });
});

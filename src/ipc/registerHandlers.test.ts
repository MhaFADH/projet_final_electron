import { describe, it, expect, beforeEach } from 'vitest';
import { createDatabase } from '../services/database';
import { createProductRepository } from '../repositories/productRepository';
import { createProductService } from '../services/productService';
import { createSaleRepository } from '../repositories/saleRepository';
import { createSaleService } from '../services/saleService';
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
  const db = createDatabase();
  const productRepo = createProductRepository(db);
  const products = createProductService(productRepo);
  const saleRepo = createSaleRepository(db);
  const sales = createSaleService({
    products: productRepo,
    sales: saleRepo,
    transaction: (fn) => fn(),
  });
  const off = createOpenFoodFacts(
    (() => {
      throw new Error('no network in tests');
    }) as unknown as typeof fetch,
  );
  registerHandlers(ipc, { products, off, sales });
});

const ok = async <T>(p: unknown): Promise<T> => {
  const result = (await p) as { ok: true; value: T } | { ok: false; error: { code: string } };
  if (!result.ok) throw new Error(`expected ok, got ${result.error.code}`);
  return result.value;
};

const err = async (p: unknown): Promise<{ code: string; message: string }> => {
  const result = (await p) as { ok: boolean; error?: { code: string; message: string } };
  if (result.ok) throw new Error('expected error');
  return result.error as { code: string; message: string };
};

describe('registerHandlers (products)', () => {
  it('creates and lists products through channels', async () => {
    const created = await ok<{ id: number }>(
      ipc.invoke('products:create', [{ name: 'Lait', priceCents: 99, stock: 10 }]),
    );
    expect(created.id).toBeGreaterThan(0);
    const list = await ok<unknown[]>(ipc.invoke('products:list', []));
    expect(list).toHaveLength(1);
  });

  it('returns a VALIDATION error for bad arguments', async () => {
    const error = await err(ipc.invoke('products:getById', ['not-a-number']));
    expect(error.code).toBe('VALIDATION');
  });

  it('searches through the channel', async () => {
    await ok(ipc.invoke('products:create', [{ name: 'Pain', priceCents: 120, stock: 5 }]));
    const found = await ok<{ name: string }[]>(ipc.invoke('products:search', ['pain']));
    expect(found.map((p) => p.name)).toEqual(['Pain']);
  });
});

describe('sales channel', () => {
  it('creates a sale through the channel', async () => {
    const product = await ok<{ id: number }>(
      ipc.invoke('products:create', [{ name: 'Lait', priceCents: 99, stock: 10 }]),
    );
    const sale = await ok<{ totalCents: number }>(
      ipc.invoke('sales:create', [[{ productId: product.id, quantity: 2 }]]),
    );
    expect(sale.totalCents).toBe(198);
  });

  it('returns an INSUFFICIENT_STOCK error on oversell', async () => {
    const product = await ok<{ id: number }>(
      ipc.invoke('products:create', [{ name: 'Pain', priceCents: 120, stock: 1 }]),
    );
    const error = await err(ipc.invoke('sales:create', [[{ productId: product.id, quantity: 5 }]]));
    expect(error.code).toBe('INSUFFICIENT_STOCK');
  });
});

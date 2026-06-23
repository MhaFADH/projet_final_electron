import type { CartItem, Sale, SaleWithItems, SaleItemRow } from '../entities/types';
import { cartSchema } from '../entities/schemas';
import type { ProductRepository } from '../repositories/productRepository';
import type { SaleRepository } from '../repositories/saleRepository';
import { InsufficientStockError, ProductNotFoundError } from '../entities/errors';

export type Transaction = <T>(fn: () => T) => T;

export interface SaleServiceDeps {
  products: ProductRepository;
  sales: SaleRepository;
  transaction: Transaction;
}

export const createSaleService = ({
  products,
  sales,
  transaction,
}: SaleServiceDeps) => {
  const createSale = (cart: CartItem[]): SaleWithItems => {
    const items = cartSchema.parse(cart);

    const lines = items.map((item) => {
      const product = products.findById(item.productId);
      if (!product) {
        throw new ProductNotFoundError(`Produit introuvable (id ${item.productId})`);
      }
      if (item.quantity > product.stock) {
        throw new InsufficientStockError(
          `Stock insuffisant pour "${product.name}" (demandé ${item.quantity}, disponible ${product.stock})`,
        );
      }
      return {
        productId: product.id,
        nameSnapshot: product.name,
        unitPriceCents: product.priceCents,
        quantity: item.quantity,
        lineTotalCents: product.priceCents * item.quantity,
      };
    });

    const totalCents = lines.reduce((sum, line) => sum + line.lineTotalCents, 0);

    return transaction(() => {
      const saleId = sales.insertSale({
        createdAt: new Date().toISOString(),
        totalCents,
      });
      for (const line of lines) {
        const itemRow: SaleItemRow = { saleId, ...line };
        sales.insertItem(itemRow);
        products.decrementStock(line.productId, line.quantity);
      }
      return sales.findById(saleId) as SaleWithItems;
    });
  };

  const history = (day: string): Sale[] =>
    day ? sales.listByDate(day) : sales.list();

  const getReceipt = (id: number): SaleWithItems | null => sales.findById(id);

  return { createSale, history, getReceipt };
};

export type SaleService = ReturnType<typeof createSaleService>;

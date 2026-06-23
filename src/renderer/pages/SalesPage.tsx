import { useEffect, useState } from 'react';
import type { Product } from '../../entities/types';
import { useCart } from '../hooks/useCart';
import { notifySuccess, notifyError } from '../notify';

const euros = (cents: number) => (cents / 100).toFixed(2) + ' €';

export const SalesPage = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedId, setSelectedId] = useState('');
  const { lines, add, setQuantity, remove, clear, totalCents } = useCart();

  const loadProducts = async () => setProducts(await window.api.products.list());
  useEffect(() => {
    void loadProducts();
  }, []);

  const addSelected = () => {
    const product = products.find((p) => p.id === Number(selectedId));
    if (product) add(product);
  };

  const validate = async () => {
    try {
      const sale = await window.api.sales.create(
        lines.map((l) => ({ productId: l.productId, quantity: l.quantity })),
      );
      notifySuccess('Vente validée', `Total ${euros(sale.totalCents)}`);
      clear();
      await loadProducts();
    } catch (error) {
      notifyError('Vente refusée', (error as Error).message);
    }
  };

  return (
    <section className="sales">
      <h2>Vente</h2>

      <div className="cart-add">
        <select value={selectedId} onChange={(e) => setSelectedId(e.target.value)}>
          <option value="">Choisir un produit…</option>
          {products.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name} — {euros(p.priceCents)} (stock {p.stock})
            </option>
          ))}
        </select>
        <button type="button" onClick={addSelected}>Ajouter au panier</button>
      </div>

      <table className="cart">
        <thead>
          <tr><th>Produit</th><th>PU</th><th>Qté</th><th>Total</th><th></th></tr>
        </thead>
        <tbody>
          {lines.map((l) => (
            <tr key={l.productId}>
              <td>{l.name}</td>
              <td>{euros(l.unitPriceCents)}</td>
              <td>
                <input
                  type="number"
                  min="0"
                  value={l.quantity}
                  onChange={(e) => setQuantity(l.productId, parseInt(e.target.value, 10) || 0)}
                />
              </td>
              <td>{euros(l.unitPriceCents * l.quantity)}</td>
              <td><button onClick={() => remove(l.productId)}>Retirer</button></td>
            </tr>
          ))}
        </tbody>
      </table>

      <p className="cart-total">Total : {euros(totalCents)}</p>
      <button type="button" disabled={lines.length === 0} onClick={validate}>
        Valider la vente
      </button>
    </section>
  );
};

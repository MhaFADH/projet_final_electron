import { useEffect, useState } from 'react';
import type { Sale, SaleWithItems } from '../../entities/types';
import { notifySuccess } from '../notify';

const euros = (cents: number) => (cents / 100).toFixed(2) + ' €';
const formatDate = (iso: string) => new Date(iso).toLocaleString('fr-FR');

export const HistoryPage = () => {
  const [day, setDay] = useState('');
  const [sales, setSales] = useState<Sale[]>([]);
  const [receipt, setReceipt] = useState<SaleWithItems | null>(null);

  useEffect(() => {
    const load = async () => setSales(await window.api.sales.history(day));
    void load();
  }, [day]);

  const openReceipt = async (id: number) =>
    setReceipt(await window.api.sales.receipt(id));

  const exportAs = async (format: 'csv' | 'pdf') => {
    const result = await window.api.export.run(format, day);
    if (result.saved) {
      notifySuccess('Export terminé', result.path ?? '');
    }
  };

  return (
    <section className="history">
      <h2>Historique des ventes</h2>

      <div className="history-filter">
        <input type="date" value={day} onChange={(e) => setDay(e.target.value)} />
        <button type="button" onClick={() => setDay('')}>Tout</button>
      </div>

      <div className="history-actions">
        <button type="button" onClick={() => exportAs('csv')}>Exporter CSV</button>
        <button type="button" onClick={() => exportAs('pdf')}>Exporter PDF</button>
      </div>

      <table className="sales-list">
        <thead>
          <tr><th>Date</th><th>Total</th><th></th></tr>
        </thead>
        <tbody>
          {sales.map((s) => (
            <tr key={s.id}>
              <td>{formatDate(s.createdAt)}</td>
              <td>{euros(s.totalCents)}</td>
              <td><button onClick={() => openReceipt(s.id)}>Reçu</button></td>
            </tr>
          ))}
        </tbody>
      </table>

      {receipt && (
        <div className="receipt">
          <h3>Reçu #{receipt.id} — {formatDate(receipt.createdAt)}</h3>
          <table>
            <thead>
              <tr><th>Produit</th><th>PU</th><th>Qté</th><th>Total</th></tr>
            </thead>
            <tbody>
              {receipt.items.map((i) => (
                <tr key={i.id}>
                  <td>{i.nameSnapshot}</td>
                  <td>{euros(i.unitPriceCents)}</td>
                  <td>{i.quantity}</td>
                  <td>{euros(i.lineTotalCents)}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <p className="cart-total">Total : {euros(receipt.totalCents)}</p>
          <button type="button" onClick={() => setReceipt(null)}>Fermer</button>
        </div>
      )}
    </section>
  );
};

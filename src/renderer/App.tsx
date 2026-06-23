import { useState } from 'react';
import { Toaster } from 'sonner';
import { ProductsPage } from './pages/ProductsPage';
import { SalesPage } from './pages/SalesPage';
import { HistoryPage } from './pages/HistoryPage';

type Page = 'products' | 'sales' | 'history';

export const App = () => {
  const [page, setPage] = useState<Page>('products');
  return (
    <main>
      <Toaster position="top-right" richColors />
      <h1>Caisse</h1>
      <nav className="tabs">
        <button onClick={() => setPage('products')} aria-current={page === 'products'}>
          Produits
        </button>
        <button onClick={() => setPage('sales')} aria-current={page === 'sales'}>
          Vente
        </button>
        <button onClick={() => setPage('history')} aria-current={page === 'history'}>
          Historique
        </button>
      </nav>
      {page === 'products' && <ProductsPage />}
      {page === 'sales' && <SalesPage />}
      {page === 'history' && <HistoryPage />}
    </main>
  );
};

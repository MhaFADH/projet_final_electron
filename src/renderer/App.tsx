import { useState } from 'react';
import { Toaster } from 'sonner';
import { ProductsPage } from './pages/ProductsPage';
import { SalesPage } from './pages/SalesPage';

type Page = 'products' | 'sales';

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
      </nav>
      {page === 'products' ? <ProductsPage /> : <SalesPage />}
    </main>
  );
};

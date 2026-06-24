import { useState } from 'react';
import { ConfigProvider, App as AntApp, Layout, Menu } from 'antd';
import { ProductsPage } from './pages/ProductsPage';
import { SalesPage } from './pages/SalesPage';
import { HistoryPage } from './pages/HistoryPage';

const { Header, Content } = Layout;

type Page = 'products' | 'sales' | 'history';

const items = [
  { key: 'products', label: 'Produits' },
  { key: 'sales', label: 'Vente' },
  { key: 'history', label: 'Historique' },
];

export const App = () => {
  const [page, setPage] = useState<Page>('products');
  return (
    <ConfigProvider theme={{ token: { colorPrimary: '#16a34a', borderRadius: 8 } }}>
      <AntApp>
        <Layout style={{ minHeight: '100vh' }}>
          <Header style={{ display: 'flex', alignItems: 'center', gap: 32 }}>
            <div className="brand">🛒 Caisse</div>
            <Menu
              mode="horizontal"
              theme="dark"
              selectedKeys={[page]}
              onClick={(e) => setPage(e.key as Page)}
              items={items}
              style={{ flex: 1, minWidth: 0 }}
            />
          </Header>
          <Content style={{ padding: 24 }}>
            <div style={{ maxWidth: 1100, margin: '0 auto' }}>
              {page === 'products' && <ProductsPage />}
              {page === 'sales' && <SalesPage />}
              {page === 'history' && <HistoryPage />}
            </div>
          </Content>
        </Layout>
      </AntApp>
    </ConfigProvider>
  );
};

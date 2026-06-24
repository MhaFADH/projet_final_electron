import { useEffect, useState } from 'react';
import { ConfigProvider, App as AntApp, Layout, Menu, Segmented, Button, Space, theme as antdTheme } from 'antd';
import { useTranslation } from 'react-i18next';
import type { Prefs } from '../entities/types';
import i18n from './i18n';
import { ProductsPage } from './pages/ProductsPage';
import { SalesPage } from './pages/SalesPage';
import { HistoryPage } from './pages/HistoryPage';

const { Header, Content } = Layout;

type Page = 'products' | 'sales' | 'history';

export const App = () => {
  const { t } = useTranslation();
  const [page, setPage] = useState<Page>('products');
  const [prefs, setPrefs] = useState<Prefs>({ language: 'fr', theme: 'light' });

  useEffect(() => {
    void (async () => {
      const loaded = await window.api.prefs.get();
      setPrefs(loaded);
      await i18n.changeLanguage(loaded.language);
    })();
  }, []);

  const setTheme = async (dark: boolean) => {
    const theme = dark ? 'dark' : 'light';
    setPrefs((p) => ({ ...p, theme }));
    await window.api.prefs.set({ theme });
  };

  const setLanguage = async (language: 'fr' | 'en') => {
    setPrefs((p) => ({ ...p, language }));
    await i18n.changeLanguage(language);
    await window.api.prefs.set({ language });
  };

  const items = [
    { key: 'products', label: t('nav.products') },
    { key: 'sales', label: t('nav.sales') },
    { key: 'history', label: t('nav.history') },
  ];

  return (
    <ConfigProvider
      theme={{
        algorithm: prefs.theme === 'dark' ? antdTheme.darkAlgorithm : antdTheme.defaultAlgorithm,
        token: { colorPrimary: '#16a34a', borderRadius: 8 },
      }}
    >
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
            <Space>
              <Segmented<'fr' | 'en'>
                options={['fr', 'en']}
                value={prefs.language}
                onChange={setLanguage}
              />
              <Button
                shape="circle"
                onClick={() => setTheme(prefs.theme !== 'dark')}
                aria-label="Theme"
              >
                {prefs.theme === 'dark' ? '☀️' : '🌙'}
              </Button>
            </Space>
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

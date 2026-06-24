import { useEffect, useState } from 'react';
import { App, Button, Card, Input, InputNumber, List, Modal, Space, Table, Typography } from 'antd';
import type { TableProps } from 'antd';
import type { Product, SaleWithItems } from '../../entities/types';
import { useCart, type CartLine } from '../hooks/useCart';
import { Receipt } from '../components/Receipt';

const euros = (cents: number) => (cents / 100).toFixed(2) + ' €';

export const SalesPage = () => {
  const { message } = App.useApp();
  const [products, setProducts] = useState<Product[]>([]);
  const [search, setSearch] = useState('');
  const [picking, setPicking] = useState(false);
  const { lines, add, setQuantity, remove, clear, totalCents } = useCart();
  const [lastSale, setLastSale] = useState<SaleWithItems | null>(null);

  const loadProducts = async () => setProducts(await window.api.products.list());
  useEffect(() => {
    void loadProducts();
  }, []);

  const visible = products.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase()),
  );

  const validate = async () => {
    try {
      const sale = await window.api.sales.create(
        lines.map((l) => ({ productId: l.productId, quantity: l.quantity })),
      );
      message.success(`Vente validée — total ${euros(sale.totalCents)}`);
      clear();
      await loadProducts();
      setLastSale(sale);
    } catch (error) {
      message.error((error as Error).message);
    }
  };

  const columns: TableProps<CartLine>['columns'] = [
    { title: 'Produit', dataIndex: 'name' },
    { title: 'PU', dataIndex: 'unitPriceCents', align: 'right', width: 120, render: euros },
    {
      title: 'Qté',
      key: 'qty',
      width: 120,
      render: (_, l) => (
        <InputNumber min={0} value={l.quantity} onChange={(v) => setQuantity(l.productId, Number(v) || 0)} />
      ),
    },
    { title: 'Total', key: 'total', align: 'right', width: 140, render: (_, l) => euros(l.unitPriceCents * l.quantity) },
    {
      title: '',
      key: 'x',
      align: 'right',
      width: 100,
      render: (_, l) => <Button size="small" danger onClick={() => remove(l.productId)}>Retirer</Button>,
    },
  ];

  return (
    <>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <Typography.Title level={3} style={{ margin: 0 }}>Vente</Typography.Title>
        <Space>
          {lines.length > 0 && <Button onClick={clear}>Vider le panier</Button>}
          <Button type="primary" onClick={() => setPicking(true)}>+ Ajouter un produit</Button>
        </Space>
      </div>

      <Card>
        <Table
          rowKey="productId"
          columns={columns}
          dataSource={lines}
          pagination={false}
          locale={{ emptyText: 'Panier vide — cliquez « Ajouter un produit »' }}
        />
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 24 }}>
          <Typography.Title level={3} style={{ margin: 0 }}>Total : {euros(totalCents)}</Typography.Title>
          <Button type="primary" size="large" disabled={lines.length === 0} onClick={validate}>
            Valider la vente
          </Button>
        </div>
      </Card>

      <Modal
        title="Ajouter un produit"
        open={picking}
        onCancel={() => setPicking(false)}
        footer={<Button onClick={() => setPicking(false)}>Fermer</Button>}
        destroyOnHidden
      >
        <Input.Search
          placeholder="Rechercher un produit"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ marginBottom: 12 }}
          allowClear
        />
        <List
          dataSource={visible}
          style={{ maxHeight: '50vh', overflow: 'auto' }}
          locale={{ emptyText: 'Aucun produit' }}
          renderItem={(p) => (
            <List.Item
              actions={[
                <Button key="add" type="link" disabled={p.stock === 0} onClick={() => add(p)}>
                  Ajouter
                </Button>,
              ]}
            >
              <List.Item.Meta title={p.name} description={`Stock ${p.stock} · ${euros(p.priceCents)}`} />
            </List.Item>
          )}
        />
      </Modal>

      <Modal title="Vente validée" open={lastSale !== null} onCancel={() => setLastSale(null)} footer={null} destroyOnHidden>
        {lastSale && <Receipt sale={lastSale} />}
      </Modal>
    </>
  );
};

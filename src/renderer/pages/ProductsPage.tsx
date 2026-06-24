import { useState } from 'react';
import { Table, Button, Input, Modal, Tag, Space, Popconfirm, Typography } from 'antd';
import type { TableProps } from 'antd';
import type { NewProduct, Product } from '../../entities/types';
import { useProducts } from '../hooks/useProducts';
import { ProductForm } from '../components/ProductForm';

const euros = (cents: number) => (cents / 100).toFixed(2) + ' €';

export const ProductsPage = () => {
  const { products, query, setQuery, add, update, remove } = useProducts();
  const [adding, setAdding] = useState(false);
  const [editing, setEditing] = useState<Product | null>(null);

  const onAdd = async (values: NewProduct) => {
    await add(values);
    setAdding(false);
  };
  const onEdit = async (values: NewProduct) => {
    if (editing) {
      await update(editing.id, values);
      setEditing(null);
    }
  };

  const columns: TableProps<Product>['columns'] = [
    {
      title: 'Nom',
      dataIndex: 'name',
      render: (name: string, p) => (
        <Space direction="vertical" size={0}>
          <Typography.Text strong>{name}</Typography.Text>
          {p.brand && <Typography.Text type="secondary">{p.brand}</Typography.Text>}
        </Space>
      ),
    },
    { title: 'Catégorie', dataIndex: 'category', render: (c?: string) => c || '—' },
    { title: 'Prix', dataIndex: 'priceCents', align: 'right', render: euros },
    {
      title: 'Stock',
      dataIndex: 'stock',
      align: 'right',
      render: (s: number) => <Tag color={s > 0 ? 'green' : 'red'}>{s}</Tag>,
    },
    {
      title: '',
      key: 'actions',
      align: 'right',
      render: (_, p) => (
        <Space>
          <Button size="small" onClick={() => setEditing(p)}>Modifier</Button>
          <Popconfirm title="Supprimer ce produit ?" onConfirm={() => remove(p.id)} okText="Oui" cancelText="Non">
            <Button size="small" danger>Supprimer</Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
        <Typography.Title level={3} style={{ margin: 0 }}>Produits</Typography.Title>
        <Button type="primary" onClick={() => setAdding(true)}>+ Ajouter un produit</Button>
      </div>

      <Input.Search
        placeholder="Rechercher (nom ou code-barres)"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        style={{ maxWidth: 360, marginBottom: 16 }}
        allowClear
      />

      <Table rowKey="id" columns={columns} dataSource={products} pagination={{ pageSize: 10, hideOnSinglePage: true }} />

      <Modal title="Ajouter un produit" open={adding} onCancel={() => setAdding(false)} footer={null} destroyOnHidden>
        <ProductForm submitLabel="Ajouter" onSubmit={onAdd} />
      </Modal>
      <Modal title="Modifier le produit" open={editing !== null} onCancel={() => setEditing(null)} footer={null} destroyOnHidden>
        {editing && <ProductForm initial={editing} submitLabel="Enregistrer" onSubmit={onEdit} />}
      </Modal>
    </>
  );
};

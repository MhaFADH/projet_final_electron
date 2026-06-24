import { useEffect, useState } from 'react';
import { App, Button, DatePicker, Modal, Space, Table, Typography } from 'antd';
import type { TableProps } from 'antd';
import type { Sale, SaleWithItems } from '../../entities/types';
import { Receipt } from '../components/Receipt';

const euros = (cents: number) => (cents / 100).toFixed(2) + ' €';
const formatDate = (iso: string) => new Date(iso).toLocaleString('fr-FR');

export const HistoryPage = () => {
  const { message } = App.useApp();
  const [day, setDay] = useState('');
  const [sales, setSales] = useState<Sale[]>([]);
  const [receipt, setReceipt] = useState<SaleWithItems | null>(null);

  useEffect(() => {
    const load = async () => setSales(await window.api.sales.history(day));
    void load();
  }, [day]);

  const openReceipt = async (id: number) => setReceipt(await window.api.sales.receipt(id));

  const exportAs = async (format: 'csv' | 'pdf') => {
    const result = await window.api.export.run(format, day);
    if (result.saved) {
      message.success('Export terminé');
    }
  };

  const columns: TableProps<Sale>['columns'] = [
    { title: 'Date', dataIndex: 'createdAt', render: formatDate },
    { title: 'Total', dataIndex: 'totalCents', align: 'right', render: euros },
    { title: '', key: 'x', align: 'right', render: (_, s) => <Button size="small" onClick={() => openReceipt(s.id)}>Voir le reçu</Button> },
  ];

  return (
    <>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <Typography.Title level={3} style={{ margin: 0 }}>Historique des ventes</Typography.Title>
        <Space>
          <DatePicker onChange={(_, ds) => setDay(typeof ds === 'string' ? ds : '')} placeholder="Filtrer par jour" />
          <Button onClick={() => exportAs('csv')}>Exporter CSV</Button>
          <Button onClick={() => exportAs('pdf')}>Exporter PDF</Button>
        </Space>
      </div>

      <Table rowKey="id" columns={columns} dataSource={sales} pagination={{ pageSize: 10, hideOnSinglePage: true }} locale={{ emptyText: 'Aucune vente' }} />

      <Modal title="Reçu" open={receipt !== null} onCancel={() => setReceipt(null)} footer={null} destroyOnHidden>
        {receipt && <Receipt sale={receipt} />}
      </Modal>
    </>
  );
};

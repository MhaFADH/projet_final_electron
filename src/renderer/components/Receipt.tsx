import { Table, Typography } from 'antd';
import type { TableProps } from 'antd';
import type { SaleItem, SaleWithItems } from '../../entities/types';

const euros = (cents: number) => (cents / 100).toFixed(2) + ' €';
const formatDate = (iso: string) => new Date(iso).toLocaleString('fr-FR');

const columns: TableProps<SaleItem>['columns'] = [
  { title: 'Produit', dataIndex: 'nameSnapshot' },
  { title: 'PU', dataIndex: 'unitPriceCents', align: 'right', render: euros },
  { title: 'Qté', dataIndex: 'quantity', align: 'right' },
  { title: 'Total', dataIndex: 'lineTotalCents', align: 'right', render: euros },
];

export const Receipt = ({ sale }: { sale: SaleWithItems }) => (
  <>
    <Typography.Paragraph type="secondary">
      Reçu #{sale.id} — {formatDate(sale.createdAt)}
    </Typography.Paragraph>
    <Table rowKey="id" size="small" columns={columns} dataSource={sale.items} pagination={false} />
    <Typography.Title level={4} style={{ textAlign: 'right', marginTop: 16 }}>
      Total : {euros(sale.totalCents)}
    </Typography.Title>
  </>
);

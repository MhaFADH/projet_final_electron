import { Table, Typography } from 'antd';
import type { TableProps } from 'antd';
import type { SaleItem, SaleWithItems } from '../../entities/types';
import { useTranslation } from 'react-i18next';

const euros = (cents: number) => (cents / 100).toFixed(2) + ' €';
const formatDate = (iso: string) => new Date(iso).toLocaleString('fr-FR');

export const Receipt = ({ sale }: { sale: SaleWithItems }) => {
  const { t } = useTranslation();

  const columns: TableProps<SaleItem>['columns'] = [
    { title: t('receipt.product'), dataIndex: 'nameSnapshot' },
    { title: t('receipt.unit'), dataIndex: 'unitPriceCents', align: 'right', render: euros },
    { title: t('receipt.qty'), dataIndex: 'quantity', align: 'right' },
    { title: t('receipt.total'), dataIndex: 'lineTotalCents', align: 'right', render: euros },
  ];

  return (
    <>
      <Typography.Paragraph type="secondary">
        {t('receipt.header', { id: sale.id, date: formatDate(sale.createdAt) })}
      </Typography.Paragraph>
      <Table rowKey="id" size="small" columns={columns} dataSource={sale.items} pagination={false} />
      <Typography.Title level={4} style={{ textAlign: 'right', marginTop: 16 }}>
        {t('receipt.grandTotal')} : {euros(sale.totalCents)}
      </Typography.Title>
    </>
  );
};

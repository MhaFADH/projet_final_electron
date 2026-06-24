import { Form, Input, InputNumber, Button, Space } from 'antd';
import type { NewProduct, Product } from '../../entities/types';
import { useTranslation } from 'react-i18next';

interface ProductFormProps {
  initial?: Product;
  submitLabel: string;
  onSubmit: (values: NewProduct) => Promise<void>;
}

interface FormValues {
  name: string;
  price: number;
  stock: number;
  barcode?: string;
  brand?: string;
  category?: string;
}

export const ProductForm = ({ initial, submitLabel, onSubmit }: ProductFormProps) => {
  const { t } = useTranslation();
  const [form] = Form.useForm<FormValues>();

  const lookup = async () => {
    const barcode = (form.getFieldValue('barcode') as string | undefined)?.trim();
    if (!barcode) {
      return;
    }
    const found = await window.api.off.lookup(barcode);
    if (found) {
      form.setFieldsValue({
        name: found.name ?? form.getFieldValue('name'),
        brand: found.brand ?? undefined,
        category: found.category ?? undefined,
      });
    }
  };

  const onFinish = (v: FormValues) =>
    onSubmit({
      name: v.name.trim(),
      priceCents: Math.round(v.price * 100),
      stock: v.stock,
      barcode: v.barcode?.trim() || null,
      brand: v.brand?.trim() || null,
      category: v.category?.trim() || null,
    });

  const initialValues: FormValues | undefined = initial
    ? {
        name: initial.name,
        price: initial.priceCents / 100,
        stock: initial.stock,
        barcode: initial.barcode ?? undefined,
        brand: initial.brand ?? undefined,
        category: initial.category ?? undefined,
      }
    : undefined;

  return (
    <Form form={form} layout="vertical" onFinish={onFinish} initialValues={initialValues}>
      <Form.Item label={t('form.barcode')} name="barcode">
        <Space.Compact style={{ width: '100%' }}>
          <Input placeholder={t('form.barcode')} />
          <Button onClick={lookup}>{t('form.lookup')}</Button>
        </Space.Compact>
      </Form.Item>
      <Form.Item label={t('form.name')} name="name" rules={[{ required: true, message: t('form.nameRequired') }]}>
        <Input />
      </Form.Item>
      <Space size="large">
        <Form.Item label={t('form.price')} name="price" rules={[{ required: true, message: t('form.priceRequired') }]}>
          <InputNumber min={0} step={0.01} style={{ width: 140 }} />
        </Form.Item>
        <Form.Item label={t('form.stock')} name="stock" rules={[{ required: true, message: t('form.stockRequired') }]}>
          <InputNumber min={0} style={{ width: 140 }} />
        </Form.Item>
      </Space>
      <Form.Item label={t('form.brand')} name="brand"><Input /></Form.Item>
      <Form.Item label={t('form.category')} name="category"><Input /></Form.Item>
      <Form.Item style={{ marginBottom: 0, textAlign: 'right' }}>
        <Button type="primary" htmlType="submit">{submitLabel}</Button>
      </Form.Item>
    </Form>
  );
};

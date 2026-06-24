import { Form, Input, InputNumber, Button, Space } from 'antd';
import type { NewProduct, Product } from '../../entities/types';

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
      <Form.Item label="Code-barres" name="barcode">
        <Space.Compact style={{ width: '100%' }}>
          <Input placeholder="Code-barres" />
          <Button onClick={lookup}>Chercher</Button>
        </Space.Compact>
      </Form.Item>
      <Form.Item label="Nom" name="name" rules={[{ required: true, message: 'Nom requis' }]}>
        <Input />
      </Form.Item>
      <Space size="large">
        <Form.Item label="Prix (€)" name="price" rules={[{ required: true, message: 'Prix requis' }]}>
          <InputNumber min={0} step={0.01} style={{ width: 140 }} />
        </Form.Item>
        <Form.Item label="Stock" name="stock" rules={[{ required: true, message: 'Stock requis' }]}>
          <InputNumber min={0} style={{ width: 140 }} />
        </Form.Item>
      </Space>
      <Form.Item label="Marque" name="brand"><Input /></Form.Item>
      <Form.Item label="Catégorie" name="category"><Input /></Form.Item>
      <Form.Item style={{ marginBottom: 0, textAlign: 'right' }}>
        <Button type="primary" htmlType="submit">{submitLabel}</Button>
      </Form.Item>
    </Form>
  );
};

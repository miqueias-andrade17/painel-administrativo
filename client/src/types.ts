export type MetricSummary = {
  totalProducts: number;
  lowStock: number;
  totalOrders: number;
  totalRevenue: number;
};

export type Product = {
  _id?: string;
  name: string;
  category: string;
  price: number;
  stock: number;
  status: 'Ativo' | 'Inativo';
  supplier: string;
  description: string;
  createdAt?: string;
};

export type Order = {
  _id?: string;
  customer: string;
  total: number;
  paymentStatus: 'Pago' | 'Pendente' | 'Atrasado';
  deliveryStatus: 'Preparando' | 'Enviado' | 'Entregue';
  createdAt?: string;
};

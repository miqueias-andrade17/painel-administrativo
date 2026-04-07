import { useEffect, useMemo, useState } from 'react';
import { api } from '../lib/api';
import { MetricSummary, Order, Product } from '../types';
import { Header } from '../components/Header';
import { StatCard } from '../components/StatCard';
import { ProductForm } from '../components/ProductForm';
import { ProductTable } from '../components/ProductTable';
import { DetailPanel } from '../components/DetailPanel';

const initialMetrics: MetricSummary = {
  totalProducts: 0,
  lowStock: 0,
  totalOrders: 0,
  totalRevenue: 0
};

export function DashboardPage() {
  const [metrics, setMetrics] = useState<MetricSummary>(initialMetrics);
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('Todos');
  const [categoryFilter, setCategoryFilter] = useState('Todas');

  async function loadData() {
    const [metricsData, productsData, ordersData] = await Promise.all([
      api<MetricSummary>('/api/metrics'),
      api<Product[]>('/api/products'),
      api<Order[]>('/api/orders')
    ]);
    setMetrics(metricsData);
    setProducts(productsData);
    setOrders(ordersData);
    if (!selectedProduct && productsData.length > 0) setSelectedProduct(productsData[0]);
  }

  useEffect(() => {
    loadData().catch(console.error);
  }, []);

  async function handleSubmit(product: Product) {
    if (editingProduct?._id) {
      await api(`/api/products/${editingProduct._id}`, {
        method: 'PUT',
        body: JSON.stringify(product)
      });
      setEditingProduct(null);
    } else {
      await api('/api/products', {
        method: 'POST',
        body: JSON.stringify(product)
      });
    }
    await loadData();
  }

  async function handleDelete(id: string) {
    await api(`/api/products/${id}`, { method: 'DELETE' });
    if (selectedProduct?._id === id) setSelectedProduct(null);
    await loadData();
  }

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesSearch = product.name.toLowerCase().includes(search.toLowerCase()) || product.supplier.toLowerCase().includes(search.toLowerCase());
      const matchesStatus = statusFilter === 'Todos' || product.status === statusFilter;
      const matchesCategory = categoryFilter === 'Todas' || product.category === categoryFilter;
      return matchesSearch && matchesStatus && matchesCategory;
    });
  }, [products, search, statusFilter, categoryFilter]);

  return (
    <main className="app-shell">
      <Header />

      <section className="stats-grid">
        <StatCard title="Produtos cadastrados" value={String(metrics.totalProducts)} helper="Base total no painel" />
        <StatCard title="Estoque baixo" value={String(metrics.lowStock)} helper="Itens que precisam de reposição" />
        <StatCard title="Pedidos recentes" value={String(metrics.totalOrders)} helper="Últimos registros de venda" />
        <StatCard title="Faturamento" value={`R$ ${metrics.totalRevenue.toFixed(2)}`} helper="Resumo dos pedidos pagos" />
      </section>

      <section className="content-grid">
        <div className="content-main">
          <div className="card filters-bar">
            <input placeholder="Buscar por produto ou fornecedor" value={search} onChange={(e) => setSearch(e.target.value)} />
            <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
              <option>Todos</option>
              <option>Ativo</option>
              <option>Inativo</option>
            </select>
            <select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)}>
              <option>Todas</option>
              <option>Mercearia</option>
              <option>Bebidas</option>
              <option>Higiene</option>
              <option>Limpeza</option>
              <option>Frios</option>
            </select>
          </div>

          <ProductTable
            products={filteredProducts}
            onEdit={setEditingProduct}
            onDelete={handleDelete}
            onSelect={setSelectedProduct}
          />

          <section className="card order-section">
            <div className="section-title-row">
              <div>
                <span className="eyebrow">Visão rápida</span>
                <h2>Pedidos recentes</h2>
              </div>
            </div>
            <div className="order-list">
              {orders.map((order) => (
                <div className="order-item" key={order._id}>
                  <div>
                    <strong>{order.customer}</strong>
                    <span>{new Date(order.createdAt || '').toLocaleDateString('pt-BR')}</span>
                  </div>
                  <div>
                    <span className={`badge ${order.paymentStatus === 'Pago' ? 'success' : order.paymentStatus === 'Atrasado' ? 'danger' : 'warning'}`}>{order.paymentStatus}</span>
                    <strong>R$ {order.total.toFixed(2)}</strong>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>

        <div className="content-side">
          <ProductForm onSubmit={handleSubmit} editingProduct={editingProduct} onCancel={() => setEditingProduct(null)} />
          <DetailPanel product={selectedProduct} />
        </div>
      </section>
    </main>
  );
}

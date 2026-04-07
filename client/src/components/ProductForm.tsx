import { useEffect, useState } from 'react';
import { Product } from '../types';

const emptyProduct: Product = {
  name: '',
  category: 'Mercearia',
  price: 0,
  stock: 0,
  status: 'Ativo',
  supplier: '',
  description: ''
};

export function ProductForm({
  onSubmit,
  editingProduct,
  onCancel
}: {
  onSubmit: (product: Product) => void;
  editingProduct?: Product | null;
  onCancel: () => void;
}) {
  const [formData, setFormData] = useState<Product>(emptyProduct);

  useEffect(() => {
    setFormData(editingProduct || emptyProduct);
  }, [editingProduct]);

  function handleChange<K extends keyof Product>(field: K, value: Product[K]) {
    setFormData((prev) => ({ ...prev, [field]: value }));
  }

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    onSubmit(formData);
    setFormData(emptyProduct);
  }

  return (
    <form className="card form-panel" onSubmit={handleSubmit}>
      <div className="section-title-row">
        <div>
          <span className="eyebrow">Cadastro</span>
          <h2>{editingProduct ? 'Editar registro' : 'Novo registro'}</h2>
        </div>
        {editingProduct && (
          <button type="button" className="ghost-button" onClick={onCancel}>
            Cancelar edição
          </button>
        )}
      </div>

      <div className="form-grid">
        <label>
          Nome do produto
          <input value={formData.name} onChange={(e) => handleChange('name', e.target.value)} required />
        </label>
        <label>
          Categoria
          <select value={formData.category} onChange={(e) => handleChange('category', e.target.value)}>
            <option>Mercearia</option>
            <option>Bebidas</option>
            <option>Higiene</option>
            <option>Limpeza</option>
            <option>Frios</option>
          </select>
        </label>
        <label>
          Preço
          <input type="number" step="0.01" value={formData.price} onChange={(e) => handleChange('price', Number(e.target.value))} required />
        </label>
        <label>
          Estoque
          <input type="number" value={formData.stock} onChange={(e) => handleChange('stock', Number(e.target.value))} required />
        </label>
        <label>
          Status
          <select value={formData.status} onChange={(e) => handleChange('status', e.target.value as Product['status'])}>
            <option>Ativo</option>
            <option>Inativo</option>
          </select>
        </label>
        <label>
          Fornecedor
          <input value={formData.supplier} onChange={(e) => handleChange('supplier', e.target.value)} required />
        </label>
      </div>
      <label>
        Descrição
        <textarea rows={4} value={formData.description} onChange={(e) => handleChange('description', e.target.value)} />
      </label>
      <button className="primary-button" type="submit">
        {editingProduct ? 'Salvar alterações' : 'Cadastrar produto'}
      </button>
    </form>
  );
}

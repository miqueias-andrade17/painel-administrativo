import { Product } from '../types';

export function DetailPanel({ product }: { product: Product | null }) {
  return (
    <aside className="card detail-panel">
      <div>
        <span className="eyebrow">Detalhes do registro</span>
        <h2>{product?.name || 'Selecione um item'}</h2>
      </div>
      {product ? (
        <div className="detail-list">
          <div><strong>Categoria:</strong> <span>{product.category}</span></div>
          <div><strong>Fornecedor:</strong> <span>{product.supplier}</span></div>
          <div><strong>Preço:</strong> <span>R$ {product.price.toFixed(2)}</span></div>
          <div><strong>Estoque:</strong> <span>{product.stock} unidades</span></div>
          <div><strong>Status:</strong> <span>{product.status}</span></div>
          <div><strong>Descrição:</strong> <span>{product.description || 'Sem descrição'}</span></div>
        </div>
      ) : (
        <p className="muted-text">Clique em “Detalhes” em qualquer registro para visualizar mais informações aqui.</p>
      )}
    </aside>
  );
}

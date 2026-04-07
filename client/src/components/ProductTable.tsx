import { Product } from '../types';

export function ProductTable({
  products,
  onEdit,
  onDelete,
  onSelect
}: {
  products: Product[];
  onEdit: (product: Product) => void;
  onDelete: (id: string) => void;
  onSelect: (product: Product) => void;
}) {
  return (
    <div className="card table-panel">
      <div className="section-title-row">
        <div>
          <span className="eyebrow">Registros</span>
          <h2>Tabela de produtos</h2>
        </div>
      </div>
      <div className="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>Produto</th>
              <th>Categoria</th>
              <th>Preço</th>
              <th>Estoque</th>
              <th>Status</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product._id}>
                <td>
                  <strong>{product.name}</strong>
                  <span>{product.supplier}</span>
                </td>
                <td>{product.category}</td>
                <td>R$ {product.price.toFixed(2)}</td>
                <td>{product.stock}</td>
                <td>
                  <span className={`badge ${product.status === 'Ativo' ? 'success' : 'neutral'}`}>
                    {product.status}
                  </span>
                </td>
                <td>
                  <div className="table-actions">
                    <button className="ghost-button" onClick={() => onSelect(product)}>Detalhes</button>
                    <button className="ghost-button" onClick={() => onEdit(product)}>Editar</button>
                    <button className="danger-button" onClick={() => product._id && onDelete(product._id)}>Excluir</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

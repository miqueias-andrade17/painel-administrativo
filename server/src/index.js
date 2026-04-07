import express from 'express';
import cors from 'cors';
import Datastore from 'nedb';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dbDir = path.join(__dirname, '../data');

const productsDb = new Datastore({ filename: path.join(dbDir, 'products.db'), autoload: true });
const ordersDb = new Datastore({ filename: path.join(dbDir, 'orders.db'), autoload: true });

const app = express();
app.use(cors());
app.use(express.json());

function seedDatabase() {
  productsDb.count({}, (err, count) => {
    if (count === 0) {
      productsDb.insert([
        { name: 'Arroz Tipo 1', category: 'Mercearia', price: 28.9, stock: 16, status: 'Ativo', supplier: 'Alimentos Bom Grão', description: 'Pacote com 5kg e boa saída no varejo.', createdAt: new Date().toISOString() },
        { name: 'Detergente Neutro', category: 'Limpeza', price: 3.99, stock: 8, status: 'Ativo', supplier: 'Casa Limpa Distribuidora', description: 'Item com reposição frequente.', createdAt: new Date().toISOString() },
        { name: 'Refrigerante 2L', category: 'Bebidas', price: 9.5, stock: 4, status: 'Ativo', supplier: 'Bebidas Norte', description: 'Produto com estoque baixo.', createdAt: new Date().toISOString() },
        { name: 'Creme Dental', category: 'Higiene', price: 6.75, stock: 23, status: 'Inativo', supplier: 'Saúde Oral LTDA', description: 'Produto pausado por troca de fornecedor.', createdAt: new Date().toISOString() }
      ]);
    }
  });

  ordersDb.count({}, (err, count) => {
    if (count === 0) {
      ordersDb.insert([
        { customer: 'Maria Helena', total: 148.7, paymentStatus: 'Pago', deliveryStatus: 'Entregue', createdAt: new Date().toISOString() },
        { customer: 'Mercadinho São José', total: 89.9, paymentStatus: 'Pendente', deliveryStatus: 'Preparando', createdAt: new Date(Date.now() - 86400000).toISOString() },
        { customer: 'José Pereira', total: 212.4, paymentStatus: 'Atrasado', deliveryStatus: 'Enviado', createdAt: new Date(Date.now() - 172800000).toISOString() }
      ]);
    }
  });
}

seedDatabase();

app.get('/api/products', (_, res) => {
  productsDb.find({}).sort({ createdAt: -1 }).exec((err, docs) => {
    if (err) return res.status(500).json({ message: 'Erro ao buscar produtos.' });
    res.json(docs);
  });
});

app.post('/api/products', (req, res) => {
  const doc = { ...req.body, createdAt: new Date().toISOString() };
  productsDb.insert(doc, (err, newDoc) => {
    if (err) return res.status(500).json({ message: 'Erro ao cadastrar produto.' });
    res.status(201).json(newDoc);
  });
});

app.put('/api/products/:id', (req, res) => {
  const { id } = req.params;
  productsDb.update({ _id: id }, { $set: req.body }, {}, (err) => {
    if (err) return res.status(500).json({ message: 'Erro ao atualizar produto.' });
    productsDb.findOne({ _id: id }, (findErr, doc) => {
      if (findErr) return res.status(500).json({ message: 'Erro ao buscar produto atualizado.' });
      res.json(doc);
    });
  });
});

app.delete('/api/products/:id', (req, res) => {
  const { id } = req.params;
  productsDb.remove({ _id: id }, {}, (err) => {
    if (err) return res.status(500).json({ message: 'Erro ao excluir produto.' });
    res.json({ success: true });
  });
});

app.get('/api/orders', (_, res) => {
  ordersDb.find({}).sort({ createdAt: -1 }).exec((err, docs) => {
    if (err) return res.status(500).json({ message: 'Erro ao buscar pedidos.' });
    res.json(docs);
  });
});

app.get('/api/metrics', (_, res) => {
  productsDb.find({}, (productErr, products) => {
    if (productErr) return res.status(500).json({ message: 'Erro ao gerar métricas.' });
    ordersDb.find({}, (orderErr, orders) => {
      if (orderErr) return res.status(500).json({ message: 'Erro ao gerar métricas.' });
      const paidOrders = orders.filter((order) => order.paymentStatus === 'Pago');
      res.json({
        totalProducts: products.length,
        lowStock: products.filter((product) => product.stock <= 8).length,
        totalOrders: orders.length,
        totalRevenue: paidOrders.reduce((sum, order) => sum + order.total, 0)
      });
    });
  });
});

const port = 3001;
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});

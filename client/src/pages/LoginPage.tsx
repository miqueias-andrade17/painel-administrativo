import { useState } from 'react';
import { useAuth } from '../context/AuthContext';

export function LoginPage() {
  const { login } = useAuth();
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('123456');
  const [error, setError] = useState('');

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setError('');
    try {
      await login(username, password);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao fazer login.');
    }
  }

  return (
    <main className="login-page">
      <section className="login-card card">
        <div>
          <span className="eyebrow">Sistema profissional</span>
          <h1>Painel administrativo para mercado</h1>
          <p>Controle produtos, estoque, pedidos e dados importantes em uma interface moderna e pronta para portfólio.</p>
        </div>
        <form onSubmit={handleSubmit}>
          <label>
            Usuário
            <input value={username} onChange={(e) => setUsername(e.target.value)} required />
          </label>
          <label>
            Senha
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          </label>
          {error && <p className="error-message">{error}</p>}
          <button className="primary-button" type="submit">Entrar no painel</button>
        </form>
      </section>
    </main>
  );
}

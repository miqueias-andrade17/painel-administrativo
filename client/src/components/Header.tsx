import { useAuth } from '../context/AuthContext';

export function Header() {
  const { logout } = useAuth();
  return (
    <header className="topbar card">
      <div>
        <span className="eyebrow">Painel administrativo</span>
        <h1>MarketFlow Admin</h1>
      </div>
      <div className="topbar-actions">
        <button className="ghost-button">Olá, Admin</button>
        <button className="primary-button" onClick={logout}>Sair</button>
      </div>
    </header>
  );
}

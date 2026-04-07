import { createContext, useContext, useEffect, useMemo, useState } from 'react';

type AuthContextType = {
  isAuthenticated: boolean;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    setIsAuthenticated(localStorage.getItem('admin-auth') === 'true');
  }, []);

  const value = useMemo(
    () => ({
      isAuthenticated,
      async login(username: string, password: string) {
        if (username === 'admin' && password === '123456') {
          localStorage.setItem('admin-auth', 'true');
          setIsAuthenticated(true);
          return;
        }
        throw new Error('Usuário ou senha inválidos.');
      },
      logout() {
        localStorage.removeItem('admin-auth');
        setIsAuthenticated(false);
      }
    }),
    [isAuthenticated]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
}

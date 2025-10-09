import { ThemeProvider } from './ThemeContext';
import { AuthProvider } from './AuthContext';
import { SessionProvider } from './SessionContext';

export function AppProviders({ children }) {
  return (
    <ThemeProvider>
      <AuthProvider>
        <SessionProvider>
          {children}
        </SessionProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

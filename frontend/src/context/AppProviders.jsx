import { ThemeProvider } from './ThemeContext';
import { AuthProvider } from './AuthContext';
import { SessionProvider } from './SessionContext';
import { ViewModeProvider } from './ViewModeContext';

export function AppProviders({ children }) {
  return (
    <ThemeProvider>
      <AuthProvider>
        <SessionProvider>
          <ViewModeProvider>
            {children}
          </ViewModeProvider>
        </SessionProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

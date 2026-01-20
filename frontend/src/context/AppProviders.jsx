import { ThemeProvider } from './ThemeContext';
import { AuthProvider } from './AuthContext';
import { SessionProvider } from './SessionContext';
import { ViewModeProvider } from './ViewModeContext';
import { AvatarCacheProvider } from './AvatarCacheContext';

export function AppProviders({ children }) {
  return (
    <ThemeProvider>
      <AuthProvider>
        <SessionProvider>
          <ViewModeProvider>
            <AvatarCacheProvider>
              {children}
            </AvatarCacheProvider>
          </ViewModeProvider>
        </SessionProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

import { useState } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { LoginPage } from './components/auth/LoginPage';
import { ForgotPasswordPage } from './components/auth/ForgotPasswordPage';
import { SignupPage } from './components/auth/SignupPage';
import { Dashboard } from './components/Dashboard';
import { Toaster } from './components/ui/sonner';

type AuthView = 'login' | 'forgotPassword' | 'signup';

function AppContent() {
  const { isAuthenticated } = useAuth();
  const [authView, setAuthView] = useState<AuthView>('login');

  if (isAuthenticated) {
    return <Dashboard />;
  }

  switch (authView) {
    case 'login':
      return (
        <LoginPage
          onNavigateToForgotPassword={() => setAuthView('forgotPassword')}
          onNavigateToSignup={() => setAuthView('signup')}
        />
      );
    case 'forgotPassword':
      return (
        <ForgotPasswordPage
          onBack={() => setAuthView('login')}
        />
      );
    case 'signup':
      return (
        <SignupPage
          onBack={() => setAuthView('login')}
        />
      );
    default:
      return (
        <LoginPage
          onNavigateToForgotPassword={() => setAuthView('forgotPassword')}
          onNavigateToSignup={() => setAuthView('signup')}
        />
      );
  }
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
      <Toaster />
    </AuthProvider>
  );
}

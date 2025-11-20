import { createContext, useContext, useState, ReactNode, useEffect } from 'react';

export interface User {
  id: string;
  email: string;
  name: string;
  siteName: string;
  phone?: string;
  department?: string;
  bio?: string;
  createdAt?: string;
  lastLoginAt?: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  updateUser: (userData: Partial<User>) => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  // 초기 상태는 null (로그인 화면부터 시작)
  const [user, setUser] = useState<User | null>(null);

  // localStorage에 사용자 정보 저장
  useEffect(() => {
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
    } else {
      localStorage.removeItem('user');
    }
  }, [user]);

  const login = async (email: string, password: string): Promise<boolean> => {
    // 실제 환경에서는 API 호출
    // 데모를 위해 간단한 검증만 수행
    if (email && password) {
      // Mock user data - 로그인 시 기본 정보 설정
      const now = new Date().toISOString();
      const newUser: User = {
        id: '1',
        email: email,
        name: '관리자',
        siteName: 'Cafe24',
        phone: '010-1234-5678',
        department: '운영팀',
        bio: '성장통 상품 분석 대시보드의 관리자입니다.',
        createdAt: user?.createdAt || '2024-01-15T00:00:00.000Z',
        lastLoginAt: now,
      };
      setUser(newUser);
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  const updateUser = (userData: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...userData };
      setUser(updatedUser);
    }
  };

  const value = {
    user,
    login,
    logout,
    updateUser,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

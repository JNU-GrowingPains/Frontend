# 인증 시스템 문서

## 목차
1. [개요](#개요)
2. [시스템 아키텍처](#시스템-아키텍처)
3. [파일 구조](#파일-구조)
4. [컴포넌트 상세](#컴포넌트-상세)
5. [인증 흐름](#인증-흐름)
6. [API 연동 가이드](#api-연동-가이드)
7. [상태 관리](#상태-관리)
8. [보안 고려사항](#보안-고려사항)
9. [커스터마이징](#커스터마이징)
10. [트러블슈팅](#트러블슈팅)

---

## 개요

성장통 상품 분석 대시보드의 인증 시스템은 React Context API를 활용한 클라이언트 사이드 인증 구조로 설계되었습니다.

### 주요 기능
- ✅ 로그인 / 로그아웃
- ✅ 회원가입
- ✅ 비밀번호 찾기
- ✅ 인증 상태 관리
- ✅ 보호된 라우팅
- ✅ Toast 알림 시스템

### 기술 스택
- **React 18+**: 컴포넌트 기반 UI
- **Context API**: 전역 상태 관리
- **TypeScript**: 타입 안정성
- **TailwindCSS**: 스타일링
- **Shadcn/ui**: UI 컴포넌트
- **Sonner**: Toast 알림

---

## 시스템 아키텍처

```
┌─────────────────┐
│    App.tsx      │
│  (Entry Point)  │
└────────┬────────┘
         │
    ┌────▼─────┐
    │ AuthProvider │
    │  (Context)   │
    └────┬─────┘
         │
    ┌────▼────────┐
    │ AppContent  │
    └────┬────────┘
         │
    ┌────▼─────────────────────┐
    │ isAuthenticated?         │
    └──┬──────────────────┬────┘
       │ Yes              │ No
       │                  │
   ┌───▼────┐        ┌────▼────────┐
   │Dashboard│       │ Auth Pages  │
   └────────┘        │ (Login/등)  │
                    └─────────────┘
```

---

## 파일 구조

```
/
├── App.tsx                          # 메인 엔트리 포인트
├── contexts/
│   └── AuthContext.tsx              # 인증 컨텍스트 및 훅
├── components/
│   ├── Dashboard.tsx                # 인증 후 메인 대시보드
│   ├── auth/
│   │   ├── LoginPage.tsx           # 로그인 페이지
│   │   ├── SignupPage.tsx          # 회원가입 페이지
│   │   └── ForgotPasswordPage.tsx  # 비밀번호 찾기 페이지
│   └── ui/
│       ├── button.tsx              # 버튼 컴포넌트
│       ├── input.tsx               # 입력 필드
│       ├── label.tsx               # 레이블
│       ├── checkbox.tsx            # 체크박스
│       └── sonner.tsx              # Toast 알림
└── docs/
    └── authentication.md           # 이 문서
```

---

## 컴포넌트 상세

### 1. AuthContext (`/contexts/AuthContext.tsx`)

#### 역할
전역 인증 상태를 관리하고 인증 관련 기능을 제공합니다.

#### 인터페이스

```typescript
interface User {
  id: string;           // 사용자 고유 ID
  email: string;        // 이메일 주소
  name: string;         // 사용자 이름
  siteName: string;     // 쇼핑몰 사이트명
  phone?: string;       // 전화번호
  department?: string;  // 부서
  bio?: string;         // 소개
  createdAt?: string;   // 가입일
  lastLoginAt?: string; // 마지막 로그인 시간
}

interface AuthContextType {
  user: User | null;                                    // 현재 로그인한 사용자
  login: (email: string, password: string) => Promise<boolean>;  // 로그인 함수
  logout: () => void;                                   // 로그아웃 함수
  updateUser: (userData: Partial<User>) => void;        // 사용자 정보 업데이트
  isAuthenticated: boolean;                             // 인증 상태
}
```

#### 사용법

```tsx
import { useAuth } from '../contexts/AuthContext';

function MyComponent() {
  const { user, login, logout, isAuthenticated, updateUser } = useAuth();
  
  // 로그인 체크
  if (!isAuthenticated) {
    return <div>로그인이 필요합니다</div>;
  }
  
  return <div>환영합니다, {user.name}님!</div>;
}
```

#### 현재 구현 (Mock)

```typescript
const login = async (email: string, password: string): Promise<boolean> => {
  // 현재: 단순 검증
  if (email && password) {
    const now = new Date().toISOString();
    setUser({
      id: '1',
      email: email,
      name: '관리자',
      siteName: 'Cafe24',
      phone: '010-1234-5678',
      department: '운영팀',
      bio: '성장통 상품 분석 대시보드의 관리자입니다.',
      createdAt: user?.createdAt || '2024-01-15T00:00:00.000Z',
      lastLoginAt: now,
    });
    return true;
  }
  return false;
};
```

---

### 2. LoginPage (`/components/auth/LoginPage.tsx`)

#### 화면 구성
```
┌──────────────────────────────┐
│   Coredata에 오신걸 환영합니다 │
├──────────────────────────────┤
│  아이디                      │
│  [________________]          │
│                              │
│  비밀번호                    │
│  [________________]          │
│                              │
│            비밀번호 찾기  →  │
│                              │
│  [      로그인      ]        │
│                              │
│        회원가입  →           │
└──────────────────────────────┘
```

#### Props

```typescript
interface LoginPageProps {
  onNavigateToForgotPassword: () => void;  // 비밀번호 찾기 페이지로 이동
  onNavigateToSignup: () => void;          // 회원가입 페이지로 이동
}
```

#### 주요 기능
1. **입력 검증**: 이메일/비밀번호 필수 입력 확인
2. **로그인 처리**: AuthContext의 login 함수 호출
3. **에러 처리**: Toast를 통한 사용자 피드백
4. **로딩 상태**: 로그인 중 버튼 비활성화

#### 검증 로직

```typescript
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  
  // 1. 입력값 검증
  if (!email || !password) {
    toast.error('아이디와 비밀번호를 입력해주세요.');
    return;
  }
  
  // 2. 로그인 시도
  setIsLoading(true);
  try {
    const success = await login(email, password);
    if (success) {
      toast.success('로그인에 성공했습니다.');
    } else {
      toast.error('아이디 또는 비밀번호가 올바르지 않습니다.');
    }
  } catch (error) {
    toast.error('로그인 중 오류가 발생했습니다.');
  } finally {
    setIsLoading(false);
  }
};
```

---

### 3. SignupPage (`/components/auth/SignupPage.tsx`)

#### 화면 구성
```
┌──────────────────────────────┐
│  ← 로그인으로 돌아가기        │
│                              │
│        회원가입              │
├──────────────────────────────┤
│  사이트 종류                 │
│  [Cafe24_______________]     │
│                              │
│  사이트 이름 (도메인)        │
│  [____________________]      │
│                              │
│  쇼핑몰 URL (도메인 주소)    │
│  [____________________]      │
│                              │
│  사이트 타임존               │
│  [아시아 / 서울_______]     │
│                              │
│  업종 카테고리 (옵션)        │
│  [____________________]      │
│                              │
│  이름          성            │
│  [_______]   [_______]       │
│                              │
│  Email                       │
│  [____________________]      │
│                              │
│  비밀번호                    │
│  [____________________]      │
│                              │
│  ☑ 개인정보 제공 동의        │
│                              │
│  [      가입하기      ]      │
└──────────────────────────────┘
```

#### Props

```typescript
interface SignupPageProps {
  onBack: () => void;  // 로그인 페이지로 돌아가기
}
```

#### 폼 데이터 구조

```typescript
interface SignupFormData {
  siteName: string;           // 사이트 호칭 (필수)
  siteNameDomain: string;     // 사이트 이름/도메인 (필수)
  shopUrl: string;            // 쇼핑몰 URL (선택)
  siteManager: string;        // 사이트 담당로 (선택)
  businessCategory: string;   // 영중 카테고리 (선택)
  firstName: string;          // 이름 (필수)
  lastName: string;           // 성 (필수)
  email: string;              // Email (필수)
  password: string;           // 비밀번호 (필수)
}
```

#### 검증 규칙

| 필드 | 필수 여부 | 검증 규칙 |
|------|----------|-----------|
| siteName | 필수 | 비어있지 않아야 함 |
| siteNameDomain | 필수 | 비어있지 않아야 함 |
| shopUrl | 선택 | - |
| siteManager | 선택 | - |
| businessCategory | 선택 | - |
| firstName | 필수 | 비어있지 않아야 함 |
| lastName | 필수 | 비어있지 않아야 함 |
| email | 필수 | 이메일 형식 검증 |
| password | 필수 | 비어있지 않아야 함 |
| agreedToTerms | 필수 | 체크되어야 함 |

#### 이메일 검증

```typescript
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
if (!emailRegex.test(formData.email)) {
  toast.error('올바른 이메일 주소를 입력해주세요.');
  return;
}
```

---

### 4. ForgotPasswordPage (`/components/auth/ForgotPasswordPage.tsx`)

#### 화면 구성
```
┌──────────────────────────────┐
│  ← 로그인으로 돌아가기        │
│                              │
│  비밀번호를 잊으셨나요?      │
├──────────────────────────────┤
│  이메일 주소                 │
│  [bae02091982@gmail.com]     │
│                              │
│  [ 이메일 주소로           ] │
│  [ 비밀번호 전송하기       ] │
└──────────────────────────────┘
```

#### Props

```typescript
interface ForgotPasswordPageProps {
  onBack: () => void;  // 로그인 페이지로 돌아가기
}
```

#### 처리 흐름

```typescript
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  
  // 1. 이메일 입력 확인
  if (!email) {
    toast.error('이메일 주소를 입력해주세요.');
    return;
  }
  
  // 2. 이메일 형식 검증
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    toast.error('올바른 이메일 주소를 입력해주세요.');
    return;
  }
  
  // 3. 비밀번호 재설정 이메일 전송
  setIsLoading(true);
  try {
    // API 호출
    await sendPasswordResetEmail(email);
    toast.success('비밀번호 재설정 링크가 이메일로 전송되었습니다.');
    
    // 2초 후 로그인 페이지로 자동 이동
    setTimeout(() => {
      onBack();
    }, 2000);
  } catch (error) {
    toast.error('이메일 전송 중 오류가 발생했습니다.');
  } finally {
    setIsLoading(false);
  }
};
```

---

### 5. Dashboard (`/components/Dashboard.tsx`)

#### 역할
인증된 사용자만 접근할 수 있는 메인 대시보드 화면입니다.

#### 추가 기능
- **로그아웃 버튼**: 사이드바 하단에 위치
- **사용자 정보 표시**: 로그인한 이메일 주소 표시

#### 사이드바 구조

```
┌─────────────────┐
│  🌱 성장통      │
├─────────────────┤
│ 📦 주요 상품별  │
│    데이터       │
│ 💎 충성 고객    │
│    분석         │
│ ⚙️ 내 계정 관리 │
│                 │
│                 │
│     (여백)      │
│                 │
├─────────────────┤
│ 🚪 로그아웃     │
│ user@email.com  │
└─────────────────┘
```

#### 로그아웃 처리

```tsx
const { logout, user } = useAuth();

<button onClick={logout}>
  <LogOut className="w-5 h-5" />
  <span>로그아웃</span>
</button>

{user && (
  <p className="text-xs text-gray-500">{user.email}</p>
)}
```

---

## 인증 흐름

### 0. 초기 상태

```
앱 시작
  │
  ├─> AuthContext 초기화
  │     │
  │     └─> user = null (localStorage 자동 로드 없음)
  │
  ├─> isAuthenticated = false
  │
  └─> LoginPage 렌더링 (항상 로그인 화면부터 시작)
```

**참고**: 현재 구현은 초기 상태에서 localStorage를 자동으로 불러오지 않습니다. 항상 로그인 화면부터 시작하며, 새로고침 시에도 다시 로그인해야 합니다.

### 1. 로그인 플로우

```
사용자
  │
  ├─> 아이디/비밀번호 입력
  │
  ├─> "로그인" 버튼 클릭
  │
  ├─> LoginPage.handleSubmit()
  │     │
  │     ├─> 입력값 검증
  │     │
  │     ├─> AuthContext.login()
  │     │     │
  │     │     ├─> API 호출 (현재: Mock)
  │     │     │
  │     │     ├─> 성공 시: setUser()
  │     │     │
  │     │     └─> 실패 시: return false
  │     │
  │     └─> Toast 알림
  │
  ├─> isAuthenticated === true
  │
  └─> Dashboard 렌더링
```

### 2. 회원가입 플로우

```
사용자
  │
  ├─> "회원가입" 링크 클릭
  │
  ├─> SignupPage 렌더링
  │
  ├─> 폼 입력
  │
  ├─> "가입하기" 버튼 클릭
  │
  ├─> SignupPage.handleSubmit()
  │     │
  │     ├─> 필수 필드 검증
  │     │
  │     ├─> 이메일 형식 검증
  │     │
  │     ├─> 개인정보 동의 확인
  │     │
  │     ├─> API 호출 (현재: Mock)
  │     │
  │     └─> 성공 시: Toast + 로그인 페이지로 이동
  │
  └─> LoginPage로 돌아가기
```

### 3. 비밀번호 찾기 플로우

```
사용자
  │
  ├─> "비밀번호 찾기" 링크 클릭
  │
  ├─> ForgotPasswordPage 렌더링
  │
  ├─> 이메일 입력
  │
  ├─> "전송하기" 버튼 클릭
  │
  ├─> ForgotPasswordPage.handleSubmit()
  │     │
  │     ├─> 이메일 형식 검증
  │     │
  │     ├─> API 호출 (현재: Mock)
  │     │
  │     └─> 성공 시: Toast + 2초 후 자동 이동
  │
  └─> LoginPage로 돌아가기
```

### 4. 로그아웃 플로우

```
사용자
  │
  ├─> "로그아웃" 버튼 클릭
  │
  ├─> AuthContext.logout()
  │     │
  │     └─> setUser(null)
  │
  ├─> isAuthenticated === false
  │
  └─> LoginPage 렌더링
```

---

## API 연동 가이드

### 현재 상태
현재는 **Mock 데이터**를 사용하고 있습니다. 실제 백엔드 API 연동 시 아래 가이드를 참고.

### 1. 로그인 API 연동

#### 위치
`/contexts/AuthContext.tsx` - `login` 함수

#### 현재 코드
```typescript
const login = async (email: string, password: string): Promise<boolean> => {
  if (email && password) {
    setUser({
      id: '1',
      email: email,
      name: '관리자',
      siteName: 'Cafe24',
    });
    return true;
  }
  return false;
};
```

#### 실제 API 연동 예시
```typescript
const login = async (email: string, password: string): Promise<boolean> => {
  try {
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });
    
    if (!response.ok) {
      return false;
    }
    
    const data = await response.json();
    
    // JWT 토큰 저장
    localStorage.setItem('accessToken', data.accessToken);
    localStorage.setItem('refreshToken', data.refreshToken);
    
    // 사용자 정보 설정
    setUser({
      id: data.user.id,
      email: data.user.email,
      name: data.user.name,
      siteName: data.user.siteName,
    });
    
    return true;
  } catch (error) {
    console.error('Login error:', error);
    return false;
  }
};
```

### 2. 회원가입 API 연동

#### 위치
`/components/auth/SignupPage.tsx` - `handleSubmit` 함수

#### 실제 API 연동 예시
```typescript
setIsLoading(true);
try {
  const response = await fetch('/api/auth/signup', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      siteName: formData.siteName,
      siteNameDomain: formData.siteNameDomain,
      shopUrl: formData.shopUrl,
      siteManager: formData.siteManager,
      businessCategory: formData.businessCategory,
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email,
      password: formData.password,
    }),
  });
  
  if (!response.ok) {
    const error = await response.json();
    toast.error(error.message || '회원가입 중 오류가 발생했습니다.');
    return;
  }
  
  toast.success('회원가입이 완료되었습니다!');
  setTimeout(() => {
    onBack();
  }, 2000);
} catch (error) {
  console.error('Signup error:', error);
  toast.error('회원가입 중 오류가 발생했습니다.');
} finally {
  setIsLoading(false);
}
```

### 3. 비밀번호 찾기 API 연동

#### 위치
`/components/auth/ForgotPasswordPage.tsx` - `handleSubmit` 함수

#### 실제 API 연동 예시
```typescript
setIsLoading(true);
try {
  const response = await fetch('/api/auth/forgot-password', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email }),
  });
  
  if (!response.ok) {
    throw new Error('Failed to send email');
  }
  
  toast.success('비밀번호 재설정 링크가 이메일로 전송되었습니다.');
  setEmail('');
  setTimeout(() => {
    onBack();
  }, 2000);
} catch (error) {
  console.error('Forgot password error:', error);
  toast.error('이메일 전송 중 오류가 발생했습니다.');
} finally {
  setIsLoading(false);
}
```

### 4. 로그아웃 API 연동

#### 위치
`/contexts/AuthContext.tsx` - `logout` 함수

#### 실제 API 연동 예시
```typescript
const logout = async () => {
  try {
    const token = localStorage.getItem('accessToken');
    
    // 서버에 로그아웃 요청 (옵션)
    await fetch('/api/auth/logout', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
  } catch (error) {
    console.error('Logout error:', error);
  } finally {
    // 로컬 스토리지 정리
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
    
    // 사용자 상태 초기화
    setUser(null);
  }
};
```

### 5. 토큰 자동 갱신

#### 구현 예시
```typescript
// /utils/api.ts
export async function refreshAccessToken() {
  const refreshToken = localStorage.getItem('refreshToken');
  
  if (!refreshToken) {
    throw new Error('No refresh token');
  }
  
  try {
    const response = await fetch('/api/auth/refresh', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ refreshToken }),
    });
    
    if (!response.ok) {
      throw new Error('Token refresh failed');
    }
    
    const data = await response.json();
    localStorage.setItem('accessToken', data.accessToken);
    
    return data.accessToken;
  } catch (error) {
    // 리프레시 실패 시 로그아웃 처리
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    window.location.href = '/';
    throw error;
  }
}
```

### API 엔드포인트 요약

| 기능 | Method | Endpoint | Request Body | Response |
|------|--------|----------|--------------|----------|
| 로그인 | POST | `/api/auth/login` | `{ email, password }` | `{ accessToken, refreshToken, user }` |
| 회원가입 | POST | `/api/auth/signup` | `{ ...formData }` | `{ message, user }` |
| 비밀번호 찾기 | POST | `/api/auth/forgot-password` | `{ email }` | `{ message }` |
| 로그아웃 | POST | `/api/auth/logout` | - | `{ message }` |
| 토큰 갱신 | POST | `/api/auth/refresh` | `{ refreshToken }` | `{ accessToken }` |

---

## 상태 관리

### AuthContext 상태 구조

```typescript
{
  user: User | null,           // 로그인한 사용자 정보
  isAuthenticated: boolean,    // 로그인 여부 (user !== null)
  login: Function,             // 로그인 함수
  logout: Function,            // 로그아웃 함수
  updateUser: Function         // 사용자 정보 업데이트 함수
}
```

### 상태 흐름도

```
초기 상태
  user: null
  isAuthenticated: false
      │
      │ login() 호출
      ▼
로그인 상태
  user: { id, email, name, siteName, ... }
  isAuthenticated: true
      │
      │ logout() 호출
      ▼
로그아웃 상태
  user: null
  isAuthenticated: false
```

### 로컬 스토리지 활용

세션 유지를 위해 로컬 스토리지를 활용합니다:

```typescript
// AuthContext.tsx
export function AuthProvider({ children }: { children: ReactNode }) {
  // 초기 상태는 null (로그인 화면부터 시작)
  const [user, setUser] = useState<User | null>(null);

  // localStorage에 사용자 정보 저장 (로그인 후에만)
  useEffect(() => {
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
    } else {
      localStorage.removeItem('user');
    }
  }, [user]);

  // ...
}
```

**참고**: 현재 구현은 초기 상태에서 localStorage를 자동으로 불러오지 않습니다. 항상 로그인 화면부터 시작하며, 로그인 후에만 사용자 정보가 localStorage에 저장됩니다. 새로고침 시 다시 로그인해야 합니다.

---

## 보안 고려사항

### 1. 비밀번호 보안

#### 클라이언트 측
- ✅ 비밀번호 필드는 `type="password"` 사용
- ✅ 비밀번호는 평문으로 저장하지 않음
- ⚠️ 비밀번호 강도 검증 추가 권장

#### 비밀번호 강도 검증 예시
```typescript
function validatePassword(password: string): { valid: boolean; message: string } {
  if (password.length < 8) {
    return { valid: false, message: '비밀번호는 최소 8자 이상이어야 합니다.' };
  }
  
  if (!/[A-Z]/.test(password)) {
    return { valid: false, message: '비밀번호는 최소 1개의 대문자를 포함해야 합니다.' };
  }
  
  if (!/[a-z]/.test(password)) {
    return { valid: false, message: '비밀번호는 최소 1개의 소문자를 포함해야 합니다.' };
  }
  
  if (!/[0-9]/.test(password)) {
    return { valid: false, message: '비밀번호는 최소 1개의 숫자를 포함해야 합니다.' };
  }
  
  if (!/[!@#$%^&*]/.test(password)) {
    return { valid: false, message: '비밀번호는 최소 1개의 특수문자를 포함해야 합니다.' };
  }
  
  return { valid: true, message: '' };
}
```

### 2. JWT 토큰 관리

#### Access Token
- 짧은 만료 시간 (15분 권장)
- LocalStorage 또는 HttpOnly Cookie에 저장
- API 요청 시 Authorization 헤더에 포함

#### Refresh Token
- 긴 만료 시간 (7일 권장)
- HttpOnly Cookie에 저장 (더 안전)
- Access Token 갱신에만 사용

#### 구현 예시
```typescript
// API 요청 인터셉터
async function apiRequest(url: string, options: RequestInit = {}) {
  let token = localStorage.getItem('accessToken');
  
  const response = await fetch(url, {
    ...options,
    headers: {
      ...options.headers,
      'Authorization': `Bearer ${token}`,
    },
  });
  
  // 401 에러 시 토큰 갱신 시도
  if (response.status === 401) {
    try {
      token = await refreshAccessToken();
      
      // 재시도
      return fetch(url, {
        ...options,
        headers: {
          ...options.headers,
          'Authorization': `Bearer ${token}`,
        },
      });
    } catch (error) {
      // 갱신 실패 시 로그아웃
      window.location.href = '/';
      throw error;
    }
  }
  
  return response;
}
```

### 3. XSS (Cross-Site Scripting) 방지

- ✅ React는 기본적으로 XSS 방지
- ⚠️ `dangerouslySetInnerHTML` 사용 금지
- ⚠️ 사용자 입력값 sanitization

### 4. CSRF (Cross-Site Request Forgery) 방지

- CSRF 토큰 사용
- SameSite Cookie 속성 설정

```typescript
// 서버 측 설정 예시 (Node.js/Express)
app.use(cookieParser());
app.use(csrf({ cookie: { sameSite: 'strict' } }));
```

### 5. HTTPS 사용

- 프로덕션 환경에서는 반드시 HTTPS 사용
- 민감한 정보 전송 시 암호화 필수

### 6. Rate Limiting

로그인 시도 횟수 제한:

```typescript
// 클라이언트 측 간단한 제한
let loginAttempts = 0;
const MAX_ATTEMPTS = 5;
const LOCKOUT_TIME = 15 * 60 * 1000; // 15분

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  
  if (loginAttempts >= MAX_ATTEMPTS) {
    toast.error('로그인 시도 횟수를 초과했습니다. 15분 후 다시 시도해주세요.');
    return;
  }
  
  const success = await login(email, password);
  
  if (!success) {
    loginAttempts++;
    if (loginAttempts >= MAX_ATTEMPTS) {
      setTimeout(() => {
        loginAttempts = 0;
      }, LOCKOUT_TIME);
    }
  } else {
    loginAttempts = 0;
  }
};
```

---

## 커스터마이징

### 1. 로그인 페이지 브랜딩 변경

#### 제목 변경
```tsx
// LoginPage.tsx
<h1 className="text-2xl text-gray-900 mb-2">
  {YOUR_BRAND_NAME}에 오신걸 환영합니다
</h1>
```

#### 로고 추가
```tsx
<div className="mb-8 text-center">
  <img src="/logo.png" alt="Logo" className="h-12 mx-auto mb-4" />
  <h1 className="text-2xl text-gray-900 mb-2">
    Coredata에 오신걸 환영합니다
  </h1>
</div>
```

#### 버튼 색상 변경
```tsx
<Button className="w-full bg-[#YOUR_COLOR] hover:bg-[#YOUR_HOVER_COLOR]">
  로그인
</Button>
```

### 2. 회원가입 필드 커스터마이징

#### 필드 추가
```tsx
// SignupPage.tsx
const [formData, setFormData] = useState({
  // 기존 필드...
  phoneNumber: '',  // 새 필드 추가
});

// JSX
<div className="space-y-2">
  <Label htmlFor="phoneNumber">전화번호</Label>
  <Input
    id="phoneNumber"
    type="tel"
    value={formData.phoneNumber}
    onChange={(e) => handleChange('phoneNumber', e.target.value)}
    placeholder="010-1234-5678"
  />
</div>
```

#### 필드 제거
불필요한 필드를 주석 처리하거나 삭제합니다.

### 3. 검증 규칙 수정

```typescript
// 비밀번호 최소 길이 변경
if (formData.password.length < 10) {  // 8 → 10
  toast.error('비밀번호는 최소 10자 이상이어야 합니다.');
  return;
}

// 이메일 도메인 제한
const allowedDomains = ['company.com', 'partner.com'];
const emailDomain = formData.email.split('@')[1];
if (!allowedDomains.includes(emailDomain)) {
  toast.error('허용된 이메일 도메인이 아닙니다.');
  return;
}
```

### 4. Toast 메시지 커스터마이징

#### 위치 변경
```tsx
// App.tsx
<Toaster position="top-right" />  // 기본: top-center
```

#### 스타일 변경
```tsx
// sonner.tsx
<Sonner
  theme="dark"  // light → dark
  richColors    // 색상 강조
  {...props}
/>
```

### 5. 소셜 로그인 추가

```tsx
// LoginPage.tsx
import { FcGoogle } from 'react-icons/fc';
import { FaGithub } from 'react-icons/fa';

<div className="space-y-3 mt-6">
  <div className="relative">
    <div className="absolute inset-0 flex items-center">
      <div className="w-full border-t border-gray-300" />
    </div>
    <div className="relative flex justify-center text-sm">
      <span className="px-2 bg-white text-gray-500">또는</span>
    </div>
  </div>

  <Button
    type="button"
    variant="outline"
    className="w-full"
    onClick={() => handleSocialLogin('google')}
  >
    <FcGoogle className="mr-2 h-4 w-4" />
    Google로 로그인
  </Button>

  <Button
    type="button"
    variant="outline"
    className="w-full"
    onClick={() => handleSocialLogin('github')}
  >
    <FaGithub className="mr-2 h-4 w-4" />
    GitHub로 로그인
  </Button>
</div>
```

---

## 트러블슈팅

### 문제 1: 로그인 후에도 LoginPage가 표시됨

#### 원인
AuthContext가 제대로 설정되지 않았거나 user 상태가 null입니다.

#### 해결방법
1. AuthProvider로 App이 감싸져 있는지 확인
```tsx
<AuthProvider>
  <AppContent />
</AuthProvider>
```

2. 개발자 도구에서 상태 확인
```tsx
const { user, isAuthenticated } = useAuth();
console.log('User:', user);
console.log('Authenticated:', isAuthenticated);
```

### 문제 2: Toast 알림이 표시되지 않음

#### 원인
Toaster 컴포넌트가 렌더링되지 않았습니다.

#### 해결방법
App.tsx에 Toaster 추가
```tsx
import { Toaster } from './components/ui/sonner';

<AuthProvider>
  <AppContent />
  <Toaster />  {/* 추가 */}
</AuthProvider>
```

### 문제 3: 페이지 새로고침 시 로그아웃됨

#### 원인
user 상태가 메모리에만 저장되어 새로고침 시 사라집니다.

#### 해결방법
로컬 스토리지에 user 정보 저장 (위의 "상태 관리" 섹션 참고)

### 문제 4: API 호출 시 CORS 에러

#### 원인
백엔드 서버에서 CORS 설정이 되어있지 않습니다.

#### 해결방법
백엔드에서 CORS 설정 추가

```javascript
// Node.js/Express 예시
const cors = require('cors');

app.use(cors({
  origin: 'http://localhost:3000',  // 프론트엔드 URL
  credentials: true,
}));
```

### 문제 5: 로그인 버튼 클릭 시 반응 없음

#### 원인
1. form의 onSubmit 이벤트가 제대로 바인딩되지 않음
2. preventDefault가 호출되지 않아 페이지 리로드됨

#### 해결방법
```tsx
<form onSubmit={handleSubmit}>  {/* onSubmit 확인 */}
  {/* ... */}
</form>

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();  // 필수!
  // ...
};
```

### 문제 6: TypeScript 타입 에러

#### 에러 예시
```
Property 'user' does not exist on type 'AuthContextType | undefined'
```

#### 해결방법
useAuth 훅을 사용하세요:
```tsx
// ❌ 잘못된 방법
const context = useContext(AuthContext);
const user = context.user;

// ✅ 올바른 방법
const { user } = useAuth();
```

### 문제 7: 회원가입 후 로그인 페이지로 이동하지 않음

#### 원인
onBack 함수가 제대로 전달되지 않았습니다.

#### 해결방법
```tsx
// App.tsx
<SignupPage onBack={() => setAuthView('login')} />
```

---

## 부록

### A. 환경 변수 설정

`.env` 파일 생성:
```bash
VITE_API_BASE_URL=http://localhost:3000/api
VITE_APP_NAME=성장통
```

사용:
```typescript
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const response = await fetch(`${API_BASE_URL}/auth/login`, {
  // ...
});
```

### B. 테스트 계정

개발 중 테스트를 위한 Mock 계정:

| Email | Password | Role |
|-------|----------|------|
| admin@test.com | admin123 | 관리자 |
| user@test.com | user123 | 일반 사용자 |

### C. 유용한 라이브러리

| 라이브러리 | 용도 | 설치 명령 |
|-----------|------|----------|
| react-hook-form | 폼 관리 | `npm install react-hook-form` |
| zod | 스키마 검증 | `npm install zod` |
| jwt-decode | JWT 디코딩 | `npm install jwt-decode` |
| react-query | API 상태 관리 | `npm install @tanstack/react-query` |

### D. 참고 자료

- [React Context API 공식 문서](https://react.dev/reference/react/useContext)
- [JWT 소개](https://jwt.io/introduction)
- [OWASP 인증 가이드](https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html)
- [Shadcn/ui 문서](https://ui.shadcn.com/)

---

## 변경 이력

| 날짜 | 버전 | 변경 사항 | 작성자 |
|------|------|----------|--------|
| 2025-01-XX | 1.0.0 | 초기 문서 작성 | - |

---

## 라이선스

이 프로젝트는 MIT 라이선스를 따릅니다.

---

**문의사항이나 개선 제안이 있으시면 이슈를 등록해주세요.**


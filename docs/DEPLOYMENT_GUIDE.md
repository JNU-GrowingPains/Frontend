# 배포 가이드 및 API 연동 가능성 분석

## ✅ 배포 가능성: 가능

이 프로젝트는 백엔드 API와 연동하여 배포할 수 있습니다. 현재 구조가 API 연동을 고려하여 설계되어 있습니다.

---

## 🔍 현재 상태 분석

### ✅ 잘 준비된 부분

1. **타입 정의 완료**
   - `src/types/index.ts`에 모든 데이터 타입이 정의되어 있음
   - API 응답 타입으로 바로 사용 가능

2. **Mock 데이터 구조화**
   - `src/data/mockData.ts`에 Mock 데이터가 중앙 관리됨
   - API 호출로 쉽게 교체 가능

3. **컴포넌트 분리**
   - 각 컴포넌트가 데이터를 props로 받아서 사용
   - 데이터 소스 변경 시 컴포넌트 수정 최소화

4. **빌드 설정 완료**
   - Vite 빌드 설정 완료
   - `npm run build`로 프로덕션 빌드 가능

5. **환경 변수 지원**
   - Vite의 환경 변수 시스템 사용 가능 (`VITE_*`)

---

## ⚠️ 배포 전 해결해야 할 사항

### 1. API 서비스 레이어 생성 필요

**현재 상태**: Mock 데이터를 직접 import하여 사용

**필요한 작업**:
```typescript
// src/services/api.ts (새로 생성)
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';

export async function fetchProducts(): Promise<Product[]> {
  const response = await fetch(`${API_BASE_URL}/products`);
  if (!response.ok) throw new Error('Failed to fetch products');
  return response.json();
}
```

### 2. 인증 시스템 개선 필요

**현재 상태**: `AuthContext`가 Mock 인증만 구현

**필요한 작업**:
- 실제 로그인 API 연동
- JWT 토큰 관리
- API 요청에 인증 헤더 추가
- 토큰 갱신 로직

```typescript
// src/services/authService.ts (새로 생성)
export async function login(email: string, password: string) {
  const response = await fetch(`${API_BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  const data = await response.json();
  localStorage.setItem('token', data.token);
  return data;
}
```

### 3. 에러 처리 및 로딩 상태

**현재 상태**: 에러 처리 및 로딩 상태가 일부 컴포넌트에만 구현

**필요한 작업**:
- 전역 에러 처리 (ErrorBoundary 추가)
- 로딩 스피너 컴포넌트 추가
- API 에러 메시지 표시

### 4. 환경 변수 설정

**필요한 파일**: `.env.production`
```env
VITE_API_BASE_URL=https://api.yourdomain.com/api
VITE_ENV=production
```

---

## 📋 API 연동 단계별 가이드

### Step 1: API 서비스 레이어 생성

```bash
mkdir src/services
```

**src/services/api.ts**
```typescript
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';

async function request<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const token = localStorage.getItem('token');
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options?.headers,
    },
  });
  
  if (!response.ok) {
    throw new Error(`API Error: ${response.statusText}`);
  }
  
  return response.json();
}

export const api = {
  products: {
    getAll: () => request<Product[]>('/products'),
    getById: (id: string) => request<Product>(`/products/${id}`),
    search: (query: string) => request<Product[]>(`/products/search?q=${query}`),
  },
  performance: {
    getByProduct: (productId: string) => request<PerformanceData>(`/performance/${productId}`),
  },
  customers: {
    getDevices: () => request<DeviceData[]>('/customers/devices'),
  },
};
```

### Step 2: 컴포넌트 수정

**Before (Mock)**
```typescript
import { mockProducts } from "../data/mockData";
const products = mockProducts;
```

**After (API)**
```typescript
import { api } from "../services/api";
const [products, setProducts] = useState<Product[]>([]);

useEffect(() => {
  api.products.getAll().then(setProducts);
}, []);
```

### Step 3: 인증 연동

**src/contexts/AuthContext.tsx** 수정
```typescript
const login = async (email: string, password: string) => {
  try {
    const data = await authService.login(email, password);
    setUser(data.user);
    setIsAuthenticated(true);
    return true;
  } catch (error) {
    console.error('Login failed:', error);
    return false;
  }
};
```

---

## 🚀 배포 방법

### 1. 프로덕션 빌드

```bash
npm run build
```

빌드 결과물은 `dist/` 폴더에 생성됩니다.

### 2. 배포 옵션

#### 옵션 A: 정적 호스팅 (Vercel, Netlify, GitHub Pages)
- `dist/` 폴더를 업로드
- 환경 변수 설정 필요

#### 옵션 B: Nginx 서버
```nginx
server {
    listen 80;
    server_name yourdomain.com;
    root /path/to/dist;
    index index.html;
    
    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

#### 옵션 C: Docker
```dockerfile
FROM nginx:alpine
COPY dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

---

## 🔒 보안 고려사항

1. **API 키 관리**
   - 환경 변수로 관리
   - `.env` 파일을 Git에 커밋하지 않음

2. **CORS 설정**
   - 백엔드에서 프론트엔드 도메인 허용

3. **인증 토큰**
   - `localStorage` 대신 `httpOnly` 쿠키 고려
   - 토큰 만료 시간 관리

4. **HTTPS 사용**
   - 프로덕션에서는 반드시 HTTPS 사용

---

## 📊 필요한 API 엔드포인트

### 인증
- `POST /api/auth/login` - 로그인
- `POST /api/auth/logout` - 로그아웃
- `POST /api/auth/register` - 회원가입
- `POST /api/auth/forgot-password` - 비밀번호 찾기

### 상품
- `GET /api/products` - 상품 리스트
- `GET /api/products/:id` - 상품 상세
- `GET /api/products/search?q={query}` - 상품 검색

### 성과 지표
- `GET /api/performance/:productId` - 상품별 성과 지표
- `GET /api/performance/:productId?period=weekly|monthly` - 기간별 성과

### 고객 정보
- `GET /api/customers/devices` - 디바이스 분포
- `GET /api/customers/loyalty` - 충성 고객 분석 데이터

### 계정 관리
- `GET /api/account/profile` - 프로필 조회
- `PUT /api/account/profile` - 프로필 수정
- `PUT /api/account/password` - 비밀번호 변경

---

## ✅ 체크리스트

배포 전 확인 사항:

- [ ] API 서비스 레이어 생성 (`src/services/`)
- [ ] 모든 Mock 데이터를 API 호출로 교체
- [ ] 인증 시스템 API 연동
- [ ] 에러 처리 및 로딩 상태 추가
- [ ] 환경 변수 설정 (`.env.production`)
- [ ] CORS 설정 확인
- [ ] 프로덕션 빌드 테스트 (`npm run build`)
- [ ] 배포 환경에서 테스트

---

## 💡 추가 권장 사항

1. **API 클라이언트 라이브러리 사용**
   - `axios` 또는 `fetch` 래퍼 사용
   - 요청/응답 인터셉터 추가

2. **상태 관리**
   - 복잡해지면 `Zustand` 또는 `Redux` 고려

3. **캐싱 전략**
   - React Query 또는 SWR 사용 고려

4. **모니터링**
   - 에러 추적 (Sentry 등)
   - 성능 모니터링

---

## 🎯 결론

**배포 가능**: ✅ 가능

**예상 작업 시간**: 
- API 연동: 2-3일
- 인증 시스템: 1-2일
- 테스트 및 배포: 1일

**주요 장점**:
- 타입 안정성 (TypeScript)
- 구조화된 코드
- Mock 데이터로 쉽게 테스트 가능

**주의사항**:
- 백엔드 API가 준비되어 있어야 함
- CORS 설정 필요
- 인증 토큰 관리 필요




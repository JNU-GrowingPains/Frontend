# API 연동 가이드
> 성장통 대시보드를 실제 API와 연동하여 사용자 데이터를 표시하는 방법

## 📋 목차

1. [현재 구조 개요](#현재-구조-개요)
2. [API 연동 준비사항](#api-연동-준비사항)
3. [단계별 연동 가이드](#단계별-연동-가이드)
4. [데이터 스키마](#데이터-스키마)
5. [인증 및 보안](#인증-및-보안)
6. [에러 핸들링](#에러-핸들링)
7. [성능 최적화](#성능-최적화)
8. [테스트 및 디버깅](#테스트-및-디버깅)

---

## 🏗️ 현재 구조 개요

현재 대시보드는 Mock 데이터로 동작하며, 실제 API 연동을 위한 구조가 이미 준비되어 있습니다.

### 주요 파일 구조
```
/services/api.ts          # API 서비스 레이어 (현재 Mock 데이터)
/hooks/useDashboardData.ts # 데이터 훅들 (로딩/에러 처리 포함)
/types/dashboard.ts       # 타입 정의
```

### Mock API 클래스
`DashboardAPI` 클래스에서 현재 제공하는 메소드들:
- `getProductList()` - 상품 목록
- `getBuyersData()` - 구매자 데이터
- `getClickCartData()` - 클릭/장바구니 데이터
- `getAvgStayTimeData()` - 평균 체류시간
- `getCustomerAnalytics()` - 고객 분석 데이터
- `getKPIData()` - KPI 지표
- `getSalesData()` - 판매 데이터
- `getConversionData()` - 전환율 데이터
- `getHotProductsData()` - 인기 상품 데이터
- `getPerformanceChartData()` - 성과 차트 데이터
- `getLoyalCustomerKPI()` - 충성 고객 KPI

---

## 🚀 API 연동 준비사항

### 1. 환경변수 설정
프로젝트 루트에 `.env` 파일을 생성하세요:

```env
# API 설정
VITE_API_BASE_URL=https://your-api-domain.com/api
VITE_API_VERSION=v1

# 인증 설정
VITE_API_KEY=your_api_key_here
VITE_CLIENT_ID=your_client_id_here
VITE_CLIENT_SECRET=your_client_secret_here

# 환경 설정
VITE_ENVIRONMENT=development
VITE_DEBUG_MODE=true
```

### 2. 필요한 라이브러리 설치
```bash
# 인증 관련 (필요시)
npm install axios
npm install @tanstack/react-query  # 데이터 캐싱 및 동기화
```

---

## 📝 단계별 연동 가이드

### 1단계: API 기본 설정 업데이트

`/services/api.ts` 파일의 상단 설정을 수정하세요:

```typescript
// 환경변수에서 API 설정 가져오기
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';
const API_VERSION = import.meta.env.VITE_API_VERSION || 'v1';
const API_KEY = import.meta.env.VITE_API_KEY;

// API 헤더 설정
const defaultHeaders = {
  'Content-Type': 'application/json',
  'Accept': 'application/json',
  ...(API_KEY && { 'Authorization': `Bearer ${API_KEY}` }),
};
```

### 2단계: apiCall 함수 개선

기존 `apiCall` 함수를 다음과 같이 개선하세요:

```typescript
export const apiCall = async (endpoint: string, options?: RequestInit) => {
  try {
    const url = `${API_BASE_URL}/${API_VERSION}${endpoint}`;
    
    const response = await fetch(url, {
      headers: {
        ...defaultHeaders,
        ...options?.headers,
      },
      ...options,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        `API Error: ${response.status} ${response.statusText}` +
        (errorData.message ? ` - ${errorData.message}` : '')
      );
    }

    return await response.json();
  } catch (error) {
    console.error('API call failed:', error);
    
    // 네트워크 에러 또는 서버 에러 구분
    if (error instanceof TypeError) {
      throw new Error('네트워크 연결을 확인해주세요.');
    }
    
    throw error;
  }
};
```

### 3단계: Mock API를 실제 API로 교체

`DashboardAPI` 클래스의 각 메소드를 실제 API 호출로 교체하세요:

```typescript
export class DashboardAPI {
  static async getProductList(timeRange: TimeRange = 'month'): Promise<ProductData[]> {
    // Mock 데이터 주석 처리
    // const mockProducts = [...];
    
    // 실제 API 호출
    return await apiCall(`/products?timeRange=${timeRange}`);
  }

  static async getBuyersData(timeRange: TimeRange = 'month'): Promise<ChartDataPoint[]> {
    return await apiCall(`/analytics/buyers?timeRange=${timeRange}`);
  }

  static async getKPIData(timeRange: TimeRange = 'month'): Promise<KPIData[]> {
    return await apiCall(`/analytics/kpi?timeRange=${timeRange}`);
  }

  // 나머지 메소드들도 동일하게 수정...
}
```

### 4단계: 점진적 마이그레이션 (권장)

한 번에 모든 API를 교체하지 말고 점진적으로 진행하세요:

```typescript
export class DashboardAPI {
  // 개발 모드에서 Mock/Real API 선택
  private static USE_MOCK_DATA = import.meta.env.VITE_DEBUG_MODE === 'true';

  static async getProductList(timeRange: TimeRange = 'month'): Promise<ProductData[]> {
    if (this.USE_MOCK_DATA) {
      // 기존 Mock 데이터 로직
      const mockProducts = [...];
      return mockProducts.map(product => ({...}));
    }
    
    // 실제 API 호출
    return await apiCall(`/products?timeRange=${timeRange}`);
  }
}
```

---

## 📊 데이터 스키마

실제 API 응답이 현재 타입과 일치하는지 확인하세요.

### 상품 데이터 (ProductData)
```typescript
interface ProductData {
  id: number;
  name: string;
  category: string;
  sales: number;
  clicks: number;
  revenue: string;        // "₩2,400,000" 형식
  conversionRate: string; // "35.3%" 형식
}
```

### KPI 데이터 (KPIData)
```typescript
interface KPIData {
  title: string;
  value: string;
  change: string;
  changeType: 'positive' | 'negative' | 'neutral';
  icon: string;           // 아이콘 이름
  color: string;          // Tailwind 클래스
}
```

### API 응답 예시
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "청 셔츠",
      "category": "의류",
      "sales": 1200,
      "clicks": 3400,
      "revenue": "₩2,400,000",
      "conversionRate": "35.3%"
    }
  ],
  "meta": {
    "total": 100,
    "page": 1,
    "limit": 10
  }
}
```

---

## 🔐 인증 및 보안

### 1. Bearer Token 인증
```typescript
const authHeaders = {
  'Authorization': `Bearer ${getAccessToken()}`,
};

// 토큰 만료 시 갱신
const getAccessToken = () => {
  const token = localStorage.getItem('access_token');
  const expiry = localStorage.getItem('token_expiry');
  
  if (!token || Date.now() > parseInt(expiry || '0')) {
    return refreshToken();
  }
  
  return token;
};
```

### 2. API 키 인증
```typescript
const apiHeaders = {
  'X-API-Key': import.meta.env.VITE_API_KEY,
  'X-Client-ID': import.meta.env.VITE_CLIENT_ID,
};
```

### 3. CORS 설정 확인
백엔드에서 적절한 CORS 헤더를 설정했는지 확인하세요:
```
Access-Control-Allow-Origin: https://your-frontend-domain.com
Access-Control-Allow-Methods: GET, POST, PUT, DELETE
Access-Control-Allow-Headers: Content-Type, Authorization
```

---

## ⚠️ 에러 핸들링

### 1. 네트워크 에러 처리
```typescript
const handleApiError = (error: Error): string => {
  if (error.message.includes('Failed to fetch')) {
    return '서버에 연결할 수 없습니다. 네트워크 상태를 확인해주세요.';
  }
  
  if (error.message.includes('401')) {
    return '인증이 만료되었습니다. 다시 로그인해주세요.';
  }
  
  if (error.message.includes('403')) {
    return '접근 권한이 없습니다.';
  }
  
  if (error.message.includes('500')) {
    return '서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.';
  }
  
  return error.message || '알 수 없는 오류가 발생했습니다.';
};
```

### 2. 훅에서 에러 처리 개선
`/hooks/useDashboardData.ts`에서 에러 메시지를 사용자 친화적으로 변경:

```typescript
export function useProductList(timeRange: TimeRange = 'month') {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const result = await DashboardAPI.getProductList(timeRange);
        setData(result);
      } catch (err) {
        const friendlyMessage = handleApiError(err as Error);
        setError(friendlyMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [timeRange]);

  return { data, loading, error, refetch: () => setLoading(true) };
}
```

---

## ⚡ 성능 최적화

### 1. 데이터 캐싱
React Query를 사용한 캐싱 구현:

```typescript
import { useQuery } from '@tanstack/react-query';

export function useProductList(timeRange: TimeRange = 'month') {
  return useQuery({
    queryKey: ['productList', timeRange],
    queryFn: () => DashboardAPI.getProductList(timeRange),
    staleTime: 5 * 60 * 1000, // 5분
    cacheTime: 10 * 60 * 1000, // 10분
    retry: 3,
    retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 30000),
  });
}
```

### 2. 요청 최적화
```typescript
// 중복 요청 방지
const requestCache = new Map();

const cachedApiCall = async (endpoint: string, options?: RequestInit) => {
  const key = `${endpoint}_${JSON.stringify(options)}`;
  
  if (requestCache.has(key)) {
    return requestCache.get(key);
  }
  
  const promise = apiCall(endpoint, options);
  requestCache.set(key, promise);
  
  // 5초 후 캐시에서 제거
  setTimeout(() => {
    requestCache.delete(key);
  }, 5000);
  
  return promise;
};
```

### 3. 페이지네이션 구현
```typescript
interface PaginatedResponse<T> {
  data: T[];
  meta: {
    total: number;
    page: number;
    limit: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

static async getProductList(
  timeRange: TimeRange = 'month',
  page: number = 1,
  limit: number = 50
): Promise<PaginatedResponse<ProductData>> {
  return await apiCall(`/products?timeRange=${timeRange}&page=${page}&limit=${limit}`);
}
```

---

## 🧪 테스트 및 디버깅

### 1. API 응답 검증
```typescript
const validateApiResponse = (data: any, expectedKeys: string[]) => {
  if (!data || typeof data !== 'object') {
    throw new Error('Invalid API response format');
  }
  
  for (const key of expectedKeys) {
    if (!(key in data)) {
      console.warn(`Missing expected key: ${key}`);
    }
  }
};

// 사용 예시
static async getProductList(timeRange: TimeRange = 'month'): Promise<ProductData[]> {
  const response = await apiCall(`/products?timeRange=${timeRange}`);
  
  if (Array.isArray(response)) {
    response.forEach(item => 
      validateApiResponse(item, ['id', 'name', 'category', 'sales', 'clicks', 'revenue', 'conversionRate'])
    );
  }
  
  return response;
}
```

### 2. 개발 도구 설정
```typescript
// 개발 모드에서 API 호출 로깅
const logApiCall = (endpoint: string, response: any, duration: number) => {
  if (import.meta.env.DEV) {
    console.group(`🌐 API Call: ${endpoint}`);
    console.log('Response:', response);
    console.log(`Duration: ${duration}ms`);
    console.groupEnd();
  }
};
```

### 3. Mock/Real API 스위칭
개발 중에 쉽게 전환할 수 있도록:

```typescript
// .env.development
VITE_USE_MOCK_API=true

// .env.production  
VITE_USE_MOCK_API=false

// api.ts
const USE_MOCK_API = import.meta.env.VITE_USE_MOCK_API === 'true';
```

---

## 🚀 배포 전 체크리스트

### 1. 환경변수 확인
- [ ] 프로덕션 API URL 설정
- [ ] API 키/토큰 설정
- [ ] Mock 데이터 비활성화
- [ ] 디버그 모드 비활성화

### 2. 보안 검토
- [ ] API 키가 클라이언트에 노출되지 않는지 확인
- [ ] HTTPS 사용 확인
- [ ] 민감한 데이터 로깅 제거

### 3. 성능 검토
- [ ] 불필요한 API 호출 최소화
- [ ] 적절한 캐싱 전략 적용
- [ ] 로딩 상태 UX 개선

### 4. 에러 처리 검토
- [ ] 모든 API 호출에 에러 처리 적용
- [ ] 사용자 친화적 에러 메시지
- [ ] 오프라인 상태 처리

---

API 연동 과정에서 문제가 발생하면:

1. 브라우저 개발자 도구의 Network 탭을 확인
2. 콘솔 에러 메시지를 확인
3. API 응답 형식이 예상과 일치하는지 확인
4. 백엔드 개발과 API 스펙 재확인

---

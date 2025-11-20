# 성장통 - 상품 분석 대시보드

상품별 데이터 분석을 위한 대시보드 웹 애플리케이션입니다.

## 주요 기능

### 1. 주요 상품별 데이터
- 상품 리스트 테이블 (검색 및 페이지네이션 지원)
  - 페이지당 10개 상품 표시
  - 실시간 검색 기능
  - 페이지 번호로 이동
- 상품별 성과 지표 차트
  - 구매자 수 (주별/월별) - Bar Chart
  - 클릭 수 & 장바구니 추가 수 - Line Chart
  - 유입 주요 매체 - Bar Chart
  - 고객 흐름 요약도 - Sankey Chart
- 고객 디바이스 분포 - Pie Chart

### 2. 충성 고객 분석 (비활성화)
- 메뉴는 회색으로 표시되며 클릭 불가
- 컴포넌트는 유지되어 있어 추후 활성화 가능
- 등급별 고객 분포, 월별 재구매 추이, 고객 생애 가치 (LTV)

### 3. 내 계정 관리
- 프로필 관리 (로그인 정보와 자동 연동)
  - 이름, 이메일, 전화번호, 부서, 소개 수정
  - 가입일 및 마지막 로그인 시간 표시
- 보안 설정 (비밀번호 변경)

### 4. 인증 시스템
- 로그인 / 로그아웃
- 회원가입
- 비밀번호 찾기
- 사용자 정보 localStorage 저장

## 기술 스택

- **Frontend**: React 18 + TypeScript
- **Styling**: Tailwind CSS v4
- **Charts**: Recharts, D3.js, d3-sankey
- **UI Components**: shadcn/ui
- **Toast**: Sonner
- **Build Tool**: Vite

## 프로젝트 구조

```
├── /components           # React 컴포넌트
│   ├── ProductTable.tsx      # 상품 리스트 (페이지네이션)
│   ├── PerformanceMetrics.tsx  # 성과 지표 차트
│   ├── CustomerInfo.tsx     # 고객 정보
│   ├── SankeyChart.tsx      # Sankey 다이어그램
│   ├── AccountManagement.tsx # 계정 관리
│   ├── Dashboard.tsx        # 메인 대시보드
│   ├── LoyaltyAnalysis.tsx  # 충성 고객 분석 (비활성화)
│   ├── /auth                # 인증 컴포넌트
│   └── /ui                  # shadcn/ui 컴포넌트
├── /data                # Mock 데이터 관리
│   └── mockData.ts
├── /types               # TypeScript 타입 정의
│   └── index.ts
├── /contexts            # React Context
│   └── AuthContext.tsx   # 인증 상태 관리
├── /docs                # 문서
│   └── authentication.md
├── index.css            # 전역 스타일
└── App.tsx              # 메인 애플리케이션
```

## 주요 기능 설명

### 상품 선택 기능
- ProductTable에서 상품을 클릭하면 해당 상품 ID가 선택됨
- 선택된 상품 ID에 따라 PerformanceMetrics가 해당 상품의 데이터를 표시
- 각 상품마다 다른 성과 데이터를 보여줌

### 검색 기능
- 상품명, 상/중/소 카테고리로 검색 가능
- 실시간 필터링
- 검색 시 첫 페이지로 자동 리셋

### 페이지네이션
- 페이지당 10개 상품 표시
- 이전/다음 버튼
- 페이지 번호 버튼 (스마트 표시)
- 전체 개수 및 현재 표시 범위 표시

### 주별/월별 데이터 전환
- Weekly/Monthly 토글로 기간 전환
- 주별: 월~일 (7일)
- 월별: 1일~30일

### 인증 및 사용자 정보
- **초기 상태**: 항상 로그인 화면부터 시작 (localStorage 자동 로드 없음)
- 로그인 시 사용자 정보가 AuthContext에 저장되고 localStorage에 저장
- 계정 관리 페이지에서 로그인 정보 자동 표시
- 프로필 수정 시 AuthContext와 localStorage 자동 업데이트
- **참고**: 새로고침 시 다시 로그인 필요 (세션 유지 기능 없음)

## API 연동 가이드

현재는 Mock 데이터를 사용하고 있지만, 실제 API 연동을 위해 다음과 같이 구조화되어 있습니다:

### 1. 데이터 타입 정의
`/types/index.ts`에 모든 데이터 타입이 정의되어 있습니다.

### 2. Mock 데이터 위치
`/data/mockData.ts`에 모든 Mock 데이터가 중앙 관리되고 있습니다.

### 3. API 연동 방법

#### 상품 데이터 연동 (페이지네이션)
```typescript
// Before (Mock)
import { mockProducts } from "../data/mockData";

// After (API)
const fetchProducts = async (page: number, pageSize: number) => {
  const response = await fetch(`/api/products?page=${page}&pageSize=${pageSize}`);
  return response.json(); // { data: Product[], pagination: {...} }
};
```

#### 성과 지표 데이터 연동
```typescript
// Before (Mock)
import { getPerformanceDataByProduct } from "../data/mockData";
const data = getPerformanceDataByProduct(productId);

// After (API)
const fetchPerformanceData = async (productId: string) => {
  const response = await fetch(`/api/performance/${productId}`);
  return response.json(); // PerformanceData 형태로 반환
};
```

### 4. 주요 API 엔드포인트 (예상)

- `GET /api/products?page=1&pageSize=10` - 상품 리스트 (페이지네이션)
- `GET /api/products/search?q={query}` - 상품 검색
- `GET /api/performance/{productId}` - 상품별 성과 지표
- `GET /api/customers/devices` - 고객 디바이스 분포
- `GET /api/loyalty` - 충성 고객 분석 데이터
- `POST /api/auth/login` - 로그인
- `POST /api/auth/register` - 회원가입
- `PUT /api/user/profile` - 프로필 수정
- `PUT /api/user/password` - 비밀번호 변경

## 실행 방법

### 개발 서버 실행
```bash
npm install
npm run dev
```

### 프로덕션 빌드
```bash
npm run build
```

### 환경 변수 설정
`.env` 파일 생성:
```env
VITE_API_BASE_URL=http://localhost:8000/api
VITE_ENV=development
```

## 관련 문서

- **[PROJECT_OVERVIEW.md](./PROJECT_OVERVIEW.md)**: 프로젝트 전체 개요 및 주요 기능 설명
- **[FILE_STRUCTURE.md](./FILE_STRUCTURE.md)**: 파일 및 폴더 구조 상세 설명
- **[authentication.md](./authentication.md)**: 인증 시스템 상세 문서
- **[DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md)**: 배포 및 API 연동 가이드
- **[PACKAGE_INSTALLATION.md](./PACKAGE_INSTALLATION.md)**: 패키지 설치 가이드

## 다음 단계

1. API 서버 구축 및 엔드포인트 설계
2. `/data/mockData.ts`의 함수들을 API 호출로 교체
3. 인증 시스템 API 연동
4. 데이터 캐싱 전략 구현 (React Query 또는 SWR)
5. 로딩 및 에러 상태 처리
6. 충성 고객 분석 메뉴 활성화 (선택사항)


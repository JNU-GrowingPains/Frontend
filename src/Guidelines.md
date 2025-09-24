# 주요상품분석대시보드 프로젝트 가이드라인 (최종 버전)

## 📊 프로젝트 개요

**성장통** 브랜드의 E-commerce 분석 대시보드로, 상품 성과와 고객 데이터를 시각화하여 비즈니스 인사이트를 제공하는 데스크톱 전용 웹 애플리케이션입니다.

### 🛠️ 기술 스택
- **Frontend**: React + TypeScript
- **Styling**: Tailwind CSS v4
- **Charts**: Recharts 라이브러리
- **UI Components**: shadcn/ui
- **State Management**: React Hooks
- **Routing**: 커스텀 Router 시스템

---

## 🏗️ 최종 프로젝트 구조

### 핵심 파일들 (최적화 완료)
```
📁 프로젝트 루트
├── 📄 App.tsx                              # 메인 애플리케이션 엔트리포인트
├── 📄 Guidelines.md                        # 프로젝트 가이드라인 (이 파일)
├── 📄 API_Integration_Guide.md             # API 연동 상세 가이드
│
📁 /components (핵심 컴포넌트만 유지)
├── 📄 MainProductAnalysisDashboard.tsx     # 메인 대시보드 (순위 시스템)
├── 📄 ProductFocusDashboard.tsx            # 주력 상품 분석
├── 📄 PerformanceAnalysisDashboard.tsx     # 성과 지표 분석
├── 📄 CustomerAnalysisDashboard.tsx        # 고객 정보 관리
├── 📄 Sidebar.tsx                          # 네비게이션 사이드바
├── 📄 Router.tsx                           # 커스텀 라우팅 시스템
│
📁 /components/ui (shadcn/ui 컴포넌트들)
├── 📄 button.tsx, card.tsx, tabs.tsx      # 주요 UI 컴포넌트들
├── 📄 loading-spinner.tsx                 # 로딩/에러 처리
└── 📄 ... (기타 UI 컴포넌트들)
│
📁 /components/figma
└── 📄 ImageWithFallback.tsx               # 이미지 폴백 컴포넌트
│
📁 /hooks
└── 📄 useDashboardData.ts                 # API 데이터 훅들 (11개 훅)
│
📁 /services  
├── 📄 api.ts                              # API 서비스 + Mock 데이터
└── 📄 dashboardApi.ts                     # (삭제됨)
│
📁 /types
└── 📄 dashboard.ts                        # TypeScript 타입 정의
│
📁 /styles
└── 📄 globals.css                         # Tailwind v4 설정
```


## 🎯 API 연동 현황

### ✅ 완성된 API 구조
```typescript
// 모든 대시보드에서 사용하는 11개 API 훅
- useProductList()         # 상품 리스트 (Top 5)
- useBuyersData()          # 구매자 수 데이터
- useClickCartData()       # 클릭 & 장바구니 데이터
- useAvgStayTimeData()     # 평균 체류시간
- useCustomerAnalytics()   # 고객 분석 (연령/성별/디바이스)
- useKPIData()            # 성과 KPI 지표
- useSalesData()          # 판매 데이터 (4종류)
- useConversionData()     # 전환율 데이터
- useHotProductsData()    # 인기 상품 데이터
- usePerformanceChartData() # 성과 차트 데이터
- useLoyalCustomerKPI()   # 충성 고객 KPI
```

### 🔄 Mock → Real API 전환 준비
- **현재**: 완전한 Mock 데이터로 동작
- **전환 방법**: `DashboardAPI` 클래스의 메서드만 수정
- **환경변수**: `.env` 파일로 Mock/Real API 전환 가능
- **에러 처리**: 모든 훅에 로딩/에러 상태 포함
- **상세 가이드**: `API_Integration_Guide.md` 참조

---

## 🎨 디자인 시스템

### 색상 팔레트
- **Primary Blue**: `#3b82f6` (주요 데이터)
- **Purple Accent**: `#7857FF` (강조 데이터)
- **Gray Tones**: `#9CA3AF`, `#C1C7CD` (보조 데이터)
- **Background**: `#f0f0f0` (그리드), `#6b7280` (축)

### 순위 시스템 색상
- **1등 (금메달)**: `bg-yellow-500`
- **2등 (은메달)**: `bg-gray-400`
- **3등 (동메달)**: `bg-orange-600`
- **4-5등**: `bg-blue-500`

### 레이아웃 규칙
- **사이드바**: 고정 너비 64px
- **최대 콘텐츠 너비**: `max-w-7xl mx-auto`
- **차트 높이**: 주요 차트 `h-80` (320px), 보조 차트 `h-64` (256px)
- **반응형**: 데스크톱 전용, 모바일/태블릿 미지원

---

## 🏗️ 컴포넌트 구조

### 메인 대시보드 (`MainProductAnalysisDashboard.tsx`)
```
📈 헤더 (제목 + 시간 범위 탭)
├── 📋 상품 리스트 (Top 5, 순위 시스템, 인라인 상세보기)
├── 📊 구매자 수 차트 (전체 너비, 세로 배치)
├── 📈 클릭 & 장바구니 차트 (전체 너비, 세로 배치)
├── ⏱️ 평균 체류시간 차트 (전체 너비, 세로 배치)
└── 👥 고객 정보
    ├── 📊 연령대 분포 (전체 너비로 크게)
    └── 🔄 성별/디바이스 분포 (2개로 나누어)
```

### 상품 리스트 특징
- **Top 5 상품 표시**: `products.slice(0, 5)`
- **순위 시스템**: 1-3등은 메달 색상, 4-5등은 파란색
- **인라인 상세보기**: 상품 클릭 시 해당 행 아래 상세 정보 표시
- **체크박스 없음**: 순위 시스템으로 대체

---

## 🎯 기능 가이드라인

### 네비게이션
- **사이드바 기반**: 페이지 간 이동은 사이드바 메뉴만 사용
- **섹션 클릭 이동 금지**: 대시보드 섹션 클릭 시 다른 페이지로 이동하지 않음
- **현재 경로 하이라이트**: 활성 메뉴 아이템은 그라디언트 배경으로 표시

### 상품 상호작용
```typescript
// 상품 클릭 시 상세 정보 토글
const handleProductClick = (product: any) => {
  setSelectedProduct(selectedProduct?.id === product.id ? null : product);
};
```

### 시간 범위 필터
- **전역 적용**: 헤더의 탭이 모든 차트에 적용
- **옵션**: 어제(추후 24시간으로 변경??) / 이번주 / 이번달
- **기본값**: `'month'`

---

## 📊 차트 구현 현황

### Recharts 사용 현황
```typescript
// 사용된 차트 타입들:
- BarChart: 구매자 수, 평균 체류시간, 연령대 분포
- LineChart: 클릭 & 장바구니 추가 수
- PieChart: 성별/디바이스 분포
- ComposedChart: 전환율 트렌드 (PerformanceAnalysisDashboard)
- AreaChart: 상세 전환 분석 (PerformanceAnalysisDashboard)
```

### 각 대시보드별 차트 현황
- **메인 대시보드**: 5개 차트 (Bar 3개, Line 1개, Pie 2개)
- **주력 상품 분석**: 3개 차트 (Bar 1개, Pie 2개)
- **성과 지표 분석**: 6개 차트 (Bar 4개, ComposedChart 1개, AreaChart 1개)
- **고객 분석**: KPI 카드 + 분석 차트들

---

## 🔄 상태 관리 패턴

### 커스텀 훅 사용
```typescript
const { data, loading, error } = useProductList(selectedTab);
const { data: buyersData } = useBuyersData(selectedTab);
const { data: customerData } = useCustomerAnalytics(selectedTab);
```

### 로딩 및 에러 처리
```typescript
if (hasError) {
  return <ErrorMessage message={hasError} />;
}

if (isLoading) {
  return <LoadingSpinner />;
}
```

---

## 🎨 스타일링 벵스트 프랙티스

### Tailwind 클래스 패턴
```typescript
// 카드 스타일
className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"

// 호버 효과  
className="hover:bg-gray-50 transition-colors cursor-pointer"

// 순위 배지
className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold text-white"
```

### 반응형 그리드
```typescript
// 기본: 1열, 대형 화면: 2열
className="grid grid-cols-1 lg:grid-cols-2 gap-6"
```

---

## 🚀 배포 및 운영

### 유지보수 가이드
1. **API 연동 시**: `API_Integration_Guide.md` 참조
2. **디자인 변경 시**: 색상 팔레트 및 레이아웃 규칙 준수
3. **성능 이슈 시**: React DevTools로 렌더링 최적화

---

## 📝 최종 요약

### ✅ 완성된 기능들
- 🎯 **메인 대시보드**: Top 5 순위 시스템, 인라인 상세보기
- 📊 **11개 API 훅**: 완전한 데이터 흐름 구현
- 🎨 **통일된 디자인**: 메달 시스템, 일관된 색상 팔레트
- 🔄 **실시간 필터링**: 시간 범위별 동적 데이터 변경
- ⚡ **최적화된 구조**: 필요한 파일만 유지
- 🛠️ **API 연동 준비**: Mock → Real API 전환 준비 완료

### 🚀 바로 사용 가능한 상태
이 대시보드는 현재 **완전히 기능하는 상태**이며, 실제 API 연동만 하면 프로덕션에서 바로 사용 가능합니다.

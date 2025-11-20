# 프로젝트 전체 개요

## 📋 프로젝트 소개

이 프로젝트는 **상품 분석 대시보드**로, 상품별 성과 지표, 고객 분석, 매체별 유입 경로 등을 시각화하는 웹 애플리케이션입니다.

---

## 🏗️ 프로젝트 구조

```
DASHBOARD_2/
├── src/
│   ├── components/          # React 컴포넌트
│   │   ├── ProductTable.tsx          # 주요 상품 리스트 (페이지네이션 지원)
│   │   ├── PerformanceMetrics.tsx    # 성과 지표 차트
│   │   ├── CustomerInfo.tsx          # 고객 정보
│   │   ├── SankeyChart.tsx           # Sankey 다이어그램
│   │   ├── AccountManagement.tsx     # 계정 관리 (로그인 정보 연동)
│   │   ├── LoyaltyAnalysis.tsx       # 충성 고객 분석 (비활성화)
│   │   ├── Dashboard.tsx             # 메인 대시보드 레이아웃
│   │   ├── auth/                     # 인증 관련 컴포넌트
│   │   │   ├── LoginPage.tsx
│   │   │   ├── SignupPage.tsx
│   │   │   └── ForgotPasswordPage.tsx
│   │   └── ui/                       # shadcn/ui 컴포넌트
│   │
│   ├── data/
│   │   └── mockData.ts               # Mock 데이터
│   │
│   ├── types/
│   │   └── index.ts                  # TypeScript 타입 정의
│   │
│   ├── contexts/
│   │   └── AuthContext.tsx           # 인증 상태 관리
│   │
│   ├── docs/
│   │   └── authentication.md        # 인증 시스템 문서
│   │
│   ├── guidelines/
│   │   └── Guidelines.md             # 개발 가이드라인
│   │
│   ├── App.tsx                       # 메인 앱 컴포넌트
│   ├── main.tsx                      # 진입점
│   └── index.css                     # 전역 스타일
│
├── package.json
├── vite.config.ts
├── index.html
└── docs/                             # 프로젝트 문서
    ├── README.md
    ├── PROJECT_OVERVIEW.md
    ├── FILE_STRUCTURE.md
    ├── DEPLOYMENT_GUIDE.md
    ├── PACKAGE_INSTALLATION.md
    └── authentication.md
```

---

## 🎯 주요 기능

### 1. 주요 상품별 데이터
- **상품 리스트**: 페이지네이션을 지원하는 상품 테이블 (페이지당 10개)
- **상품 선택**: 상품을 클릭하여 상세 분석 확인
- **검색 기능**: 상품명, 카테고리로 실시간 검색
- **성과 지표**: 선택한 상품의 주간/월간 성과 차트
  - 구매자 수 (Bar Chart)
  - 클릭 수 & 장바구니 추가 수 (Line Chart)
  - 유입 주요 매체 (Bar Chart)
  - 고객 흐름 요약도 (Sankey 다이어그램)

### 2. 고객 정보
- **디바이스 분포**: 모바일, 데스크톱, 태블릿 비율 (Pie Chart)

### 3. 계정 관리
- **프로필 관리**: 로그인 시 저장된 사용자 정보 표시 및 수정
- **비밀번호 변경**: 비밀번호 변경 기능
- **정보 동기화**: 로그인 정보와 계정 관리 정보가 자동으로 연동

### 4. 충성 고객 분석 (비활성화)
- 메뉴는 회색으로 표시되며 클릭 불가
- 컴포넌트는 유지되어 있어 추후 활성화 가능
- `disabled: true` 플래그로 관리

---

## 📊 데이터 흐름

### 현재 구조 (Mock 데이터)

```
mockData.ts
    ↓
Component State
    ↓
UI Rendering
```

### API 연동 후 예상 구조

```
Backend API
    ↓
API Service Layer (/services)
    ↓
React Hook (useState, useEffect)
    ↓
Component State
    ↓
UI Rendering
```

---

## 🗂️ 주요 상품 리스트 표시 방식

### 현재 구현
- **방식**: 페이지네이션을 지원하는 테이블 (페이지당 10개)
- **위치**: `src/components/ProductTable.tsx`
- **기능**:
  - 검색 기능 (실시간 필터링)
  - 페이지네이션 (이전/다음, 페이지 번호)
  - 상품 선택 기능
  - 반응형 테이블
  - 검색 결과가 없을 때 안내 메시지

### 페이지네이션 상세
- **페이지당 항목 수**: 10개 (`ITEMS_PER_PAGE = 10`)
- **스마트 페이지 번호 표시**: 페이지가 많을 경우 현재 페이지 주변만 표시
- **검색 시 자동 리셋**: 검색어 변경 시 첫 페이지로 이동
- **전체 개수 표시**: "전체 N개 중 X-Y개 표시" 형식

### API 연동 시 권장 방식

#### 옵션 1: 페이지네이션 (현재 구현 방식과 동일) ⭐
```typescript
// API 호출 예시
GET /api/products?page=1&pageSize=10

// 응답 구조
{
  "data": Product[],
  "pagination": {
    "page": 1,
    "pageSize": 10,
    "total": 100,
    "totalPages": 10
  }
}
```

**장점**:
- 대량의 상품 데이터 처리에 효율적
- 서버 부하 감소
- 사용자가 원하는 페이지로 바로 이동 가능
- 대시보드 환경에 적합

**구현 방법**:
- shadcn/ui `Pagination` 컴포넌트 사용 (이미 구현됨)
- `page`, `pageSize` 파라미터로 API 호출
- 페이지 번호 버튼 추가 (이미 구현됨)

---

## 🔐 인증 시스템

### 현재 구현
- **인증 방식**: React Context API 기반 클라이언트 사이드 인증
- **상태 관리**: `AuthContext`를 통한 전역 상태 관리
- **저장소**: localStorage를 사용한 사용자 정보 저장
- **기능**:
  - 로그인 / 로그아웃
  - 회원가입
  - 비밀번호 찾기
  - 인증 상태 관리
  - 보호된 라우팅
  - Toast 알림 시스템

### 사용자 정보 연동
- **초기 상태**: 항상 로그인 화면부터 시작 (localStorage 자동 로드 없음)
- 로그인 시 저장된 정보가 계정 관리 페이지에 자동 표시
- 프로필 수정 시 AuthContext와 localStorage에 자동 업데이트
- **참고**: 새로고침 시 다시 로그인 필요 (세션 유지 기능 없음)

---

## 🎨 사용 기술 스택

### Frontend
- **React 18** - UI 라이브러리
- **TypeScript** - 타입 안정성
- **Vite** - 빌드 도구
- **Tailwind CSS v4** - 스타일링
- **shadcn/ui** - UI 컴포넌트 라이브러리
- **Recharts** - 차트 라이브러리
- **D3.js** - 데이터 시각화
- **d3-sankey** - Sankey 다이어그램
- **Sonner** - Toast 알림

### 데이터 시각화
- **Recharts**: Bar Chart, Line Chart, Pie Chart
- **D3.js + d3-sankey**: Sankey 다이어그램

---

## 📁 파일 구조 상세

### `/src/components`
주요 컴포넌트 파일들:

- **ProductTable.tsx**: 상품 리스트 테이블
  - 검색 기능
  - 페이지네이션 (페이지당 10개)
  - 상품 선택 기능
  - 반응형 테이블

- **PerformanceMetrics.tsx**: 성과 지표 차트
  - 구매자 수 (Bar Chart)
  - 클릭 수 & 장바구니 추가 수 (Line Chart)
  - 유입 주요 매체 (Bar Chart)
  - 고객 흐름 요약도 (Sankey Chart)

- **CustomerInfo.tsx**: 고객 정보
  - 디바이스 분포 (Pie Chart)

- **SankeyChart.tsx**: Sankey 다이어그램 컴포넌트
  - 반응형 지원
  - 매체별 색상 지정
  - 호버 효과

- **AccountManagement.tsx**: 계정 관리
  - 프로필 수정 (로그인 정보 연동)
  - 비밀번호 변경

- **Dashboard.tsx**: 메인 대시보드 레이아웃
  - 사이드바 네비게이션
  - 메뉴별 콘텐츠 렌더링
  - 충성 고객 분석 메뉴 비활성화

- **LoyaltyAnalysis.tsx**: 충성 고객 분석 (비활성화)
  - 현재 메뉴는 비활성화
  - 컴포넌트는 유지 (향후 활성화 예정)

### `/src/data`
- **mockData.ts**: Mock 데이터
  - `mockProducts`: 상품 데이터
  - `mockPerformanceData`: 성과 데이터
  - `mockDeviceData`: 디바이스 데이터
  - `mockTrafficSourceSankey`: Sankey 데이터 (매체별 유입 경로)
  - `mockLoyaltyData`: 충성 고객 데이터 (비활성화된 기능)

### `/src/types`
- **index.ts**: TypeScript 타입 정의
  - `Product`: 상품 타입
  - `PerformanceData`: 성과 데이터 타입
  - `DeviceData`: 디바이스 데이터 타입
  - `SankeyData`: Sankey 데이터 타입
  - `LoyaltyData`: 충성 고객 데이터 타입
  - `User`: 사용자 타입 (인증 시스템)

### `/src/contexts`
- **AuthContext.tsx**: 인증 상태 전역 관리
  - `isAuthenticated`: 로그인 여부
  - `login()`: 로그인 함수
  - `logout()`: 로그아웃 함수
  - `updateUser()`: 사용자 정보 업데이트
  - `user`: 현재 사용자 정보

---

## 🚀 개발 가이드

### 개발 서버 실행
```bash
npm run dev
```

### 빌드
```bash
npm run build
```

### 환경 변수
`.env` 파일 생성:
```env
VITE_API_BASE_URL=http://localhost:8000/api
VITE_ENV=development
```

---

## 🔄 마이그레이션 체크리스트

API 연동 시 확인 사항:

- [ ] `/services` 폴더 생성 및 API 서비스 구현
- [ ] Mock 데이터를 API 호출로 교체
- [ ] 인증 시스템 API 연동
- [ ] 에러 처리 및 로딩 상태 추가
- [ ] 환경 변수 설정 (`.env.production`)
- [ ] CORS 설정 확인
- [ ] 프로덕션 빌드 테스트 (`npm run build`)

자세한 내용은 `DEPLOYMENT_GUIDE.md` 참고

---

## 🎯 다음 단계

1. **API 연동**: Mock 데이터를 실제 API로 교체
2. **충성 고객 분석 활성화**: 비활성화된 메뉴 활성화 (선택사항)
3. **에러 처리**: 전역 에러 처리 추가
4. **로딩 상태**: 로딩 스피너 컴포넌트 추가
5. **데이터 캐싱**: React Query 또는 SWR 사용 고려

---

## 💡 참고사항

- 모든 변경사항은 다른 기능에 영향을 주지 않도록 주의하여 진행되었습니다.
- 비활성화된 컴포넌트는 향후 활성화 예정이므로 삭제하지 않았습니다.
- 사용되지 않는 데이터는 명확하게 식별되어 삭제되었습니다.
- 페이지네이션은 API 연동 시 서버 사이드 페이지네이션으로 쉽게 변경 가능합니다.


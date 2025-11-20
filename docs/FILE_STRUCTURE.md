# 프로젝트 파일 및 폴더 구조 설명

이 문서는 프로젝트의 모든 파일과 폴더의 역할을 설명합니다.

---

## 📂 전체 디렉토리 구조

```
project-root/
├── 📄 index.html                  # HTML 엔트리포인트
├── 📄 package.json                # 프로젝트 의존성 및 스크립트
├── 📄 vite.config.ts              # Vite 번들러 설정
├── 📄 tsconfig.json               # TypeScript 설정
├── 📄 tsconfig.node.json          # TypeScript Node 설정
│
├── 📁 docs/                       # 프로젝트 문서
│   ├── 📄 README.md               # 프로젝트 README
│   ├── 📄 PROJECT_OVERVIEW.md     # 프로젝트 전체 개요
│   ├── 📄 FILE_STRUCTURE.md       # 파일 구조 설명 (현재 파일)
│   ├── 📄 DEPLOYMENT_GUIDE.md     # 배포 가이드
│   ├── 📄 PACKAGE_INSTALLATION.md # 패키지 설치 가이드
│   └── 📄 authentication.md      # 인증 시스템 문서
│
├── 📁 src/
│   ├── 📄 main.tsx                # React 엔트리포인트
│   ├── 📄 App.tsx                 # 메인 애플리케이션
│   ├── 📄 index.css               # 전역 스타일 (Tailwind CSS)
│   │
│   ├── 📁 components/             # React 컴포넌트
│   │   ├── 📄 ProductTable.tsx        # 상품 테이블 (페이지네이션 지원)
│   │   ├── 📄 PerformanceMetrics.tsx  # 성과 지표 차트
│   │   ├── 📄 CustomerInfo.tsx        # 고객 정보
│   │   ├── 📄 SankeyChart.tsx         # Sankey 다이어그램
│   │   ├── 📄 AccountManagement.tsx   # 계정 관리 (로그인 정보 연동)
│   │   ├── 📄 Dashboard.tsx           # 메인 대시보드 레이아웃
│   │   ├── 📄 LoyaltyAnalysis.tsx     # 충성 고객 분석 (비활성화)
│   │   │
│   │   ├── 📁 auth/                   # 인증 관련 컴포넌트
│   │   │   ├── 📄 LoginPage.tsx
│   │   │   ├── 📄 SignupPage.tsx
│   │   │   └── 📄 ForgotPasswordPage.tsx
│   │   │
│   │   └── 📁 ui/                     # shadcn/ui 컴포넌트 라이브러리
│   │       ├── 📄 button.tsx
│   │       ├── 📄 card.tsx
│   │       ├── 📄 input.tsx
│   │       ├── 📄 table.tsx
│   │       ├── 📄 pagination.tsx      # 페이지네이션 컴포넌트
│   │       └── ... (40개 이상의 UI 컴포넌트)
│   │
│   ├── 📁 data/                   # 데이터 레이어
│   │   └── 📄 mockData.ts         # Mock 데이터 (API 연동 전)
│   │       - `mockProducts`: 상품 데이터
│   │       - `mockPerformanceData`: 성과 데이터
│   │       - `mockDeviceData`: 디바이스 데이터
│   │       - `mockTrafficSourceSankey`: Sankey 데이터 (매체별 유입 경로)
│   │       - `mockLoyaltyData`: 충성 고객 데이터 (비활성화된 기능)
│   │
│   ├── 📁 types/                  # TypeScript 타입 정의
│   │   └── 📄 index.ts            # 모든 데이터 타입
│   │
│   ├── 📁 contexts/               # React Context
│   │   └── 📄 AuthContext.tsx     # 인증 상태 전역 관리
│   │
│   └── 📁 guidelines/             # 프로젝트 가이드라인
│       └── 📄 Guidelines.md       # 개발 가이드라인
│
└── 📁 node_modules/               # 의존성 패키지
```

---

## 📄 루트 레벨 파일

### `index.html`
- **역할**: HTML 엔트리포인트
- **설명**: 브라우저가 처음 로드하는 HTML 파일
- **주요 내용**:
  - `<div id="root">` - React 앱이 마운트되는 DOM 노드
  - `<script src="/src/main.tsx">` - React 앱 진입점
  - 메타 태그: "상품 분석 대시보드 - 상품별 성과 지표 및 고객 분석"
- **수정 필요**: 거의 없음 (제목, 메타 태그 정도만)

### `package.json`
- **역할**: 프로젝트 메타데이터 및 의존성 관리
- **주요 내용**:
  - 프로젝트 이름, 버전
  - 스크립트 명령어 (`dev`, `build`, `preview`)
  - 의존성 패키지 목록
- **수정 시점**: 새 패키지 설치시 자동 업데이트

### `vite.config.ts`
- **역할**: Vite 번들러 설정
- **주요 내용**:
  - React 플러그인
  - Tailwind CSS 플러그인
  - 경로 별칭 (`@/` → `./src`)
  - 빌드 최적화 설정
- **수정 필요**: 빌드 최적화, 플러그인 추가시

### `tsconfig.json`
- **역할**: TypeScript 컴파일러 설정
- **주요 내용**:
  - 타겟 버전 (ES2020)
  - JSX 모드 (react-jsx)
  - 경로 별칭 설정
  - 엄격 모드 설정
- **수정 필요**: 타입 체크 규칙 변경시

---

## 📁 src/ (소스 코드)

### `main.tsx`
- **역할**: React 애플리케이션 진입점
- **설명**: React를 DOM에 마운트하고 전역 스타일을 import
- **주요 내용**:
  ```tsx
  import { createRoot } from "react-dom/client";
  import App from "./App.tsx";
  import "./index.css";
  
  createRoot(document.getElementById("root")!).render(<App />);
  ```
- **수정 필요**: Context Provider 추가시에만

### `App.tsx`
- **역할**: 메인 애플리케이션 컴포넌트
- **설명**: 전체 레이아웃, 인증 상태 관리, 라우팅
- **주요 기능**:
  - 인증 상태에 따른 화면 전환
  - 로그인/회원가입/비밀번호 찾기 페이지 라우팅
  - 대시보드 렌더링
- **주요 State**:
  - `authView`: 현재 인증 화면 ('login' | 'forgotPassword' | 'signup')

### `index.css`
- **역할**: Tailwind CSS 전역 스타일
- **주요 내용**:
  - CSS 변수 정의 (색상, 간격 등)
  - 다크 모드 설정
  - 기본 타이포그래피
  - Tailwind 레이어 설정
- **수정 시점**:
  - 전역 색상 변경
  - 타이포그래피 조정
  - 새로운 CSS 변수 추가
- **주의**: Tailwind v4 문법 사용

---

## 📁 components/ (React 컴포넌트)

### `ProductTable.tsx`
- **역할**: 상품 리스트 테이블 컴포넌트
- **주요 기능**:
  - 상품 데이터 표시 (테이블 형태)
  - 검색 기능 (상품명, 카테고리)
  - 페이지네이션 (페이지당 10개)
  - 상품 선택 기능 (클릭시 상세 데이터 표시)
- **Props**:
  - `selectedProductId`: 현재 선택된 상품 ID
  - `onProductSelect`: 상품 선택 콜백
- **사용 데이터**: `mockProducts` (향후 API로 교체)
- **페이지네이션**:
  - 페이지당 10개 표시
  - 이전/다음 버튼
  - 페이지 번호 버튼 (스마트 표시)
  - 전체 개수 및 현재 표시 범위 표시
  - 검색 시 첫 페이지로 자동 리셋

### `PerformanceMetrics.tsx`
- **역할**: 상품별 성과 지표 차트 컴포넌트
- **주요 기능**:
  - 구매자 수 (Bar Chart)
  - 클릭 수 & 장바구니 추가 수 (Line Chart)
  - 유입 주요 매체 (Bar Chart)
  - 고객 흐름 요약도 (Sankey Chart - 매체별 유입 경로)
- **Props**:
  - `selectedProductId`: 선택된 상품 ID
- **사용 데이터**: `mockPerformanceData`, `mockTrafficSourceSankey`
- **기간 전환**: Weekly/Monthly 토글

### `SankeyChart.tsx`
- **역할**: Sankey 다이어그램 컴포넌트
- **주요 기능**:
  - 매체별 고객 유입 경로 시각화
  - 반응형 지원 (`ResponsiveSankeyChart`)
  - 호버 효과
  - 노드별 색상 지정
- **사용 위치**: `PerformanceMetrics.tsx` 내부
- **사용 데이터**: `mockTrafficSourceSankey`
- **라이브러리**: D3.js, d3-sankey

### `CustomerInfo.tsx`
- **역할**: 고객 정보 컴포넌트
- **주요 기능**:
  - 디바이스 분포 (Pie Chart)
- **사용 데이터**: `mockDeviceData`
- **라이브러리**: Recharts

### `AccountManagement.tsx`
- **역할**: 계정 관리 컴포넌트
- **주요 기능**:
  - 프로필 수정 (로그인 정보와 연동)
  - 비밀번호 변경
  - 사용자 정보 표시 (이름, 이메일, 전화번호, 부서, 소개)
  - 가입일 및 마지막 로그인 시간 표시
- **사용 UI 컴포넌트**: Card, Input, Button, Label, Tabs, Avatar
- **인증 연동**: `AuthContext`의 `user` 정보 사용
- **정보 동기화**: 프로필 수정 시 `updateUser()` 함수로 AuthContext 업데이트

### `Dashboard.tsx`
- **역할**: 메인 대시보드 레이아웃 컴포넌트
- **주요 기능**:
  - 사이드바 네비게이션
  - 메뉴별 콘텐츠 렌더링
  - 상품 선택 상태 관리
  - 충성 고객 분석 메뉴 비활성화
- **주요 State**:
  - `activeMenu`: 현재 활성 메뉴 ('products' | 'loyalty' | 'account')
  - `selectedProductId`: 선택된 상품 ID
- **메뉴 구성**:
  - 주요 상품별데이터 (활성)
  - 충성 고객 분석 (비활성화 - 회색 표시, 클릭 불가)
  - 내 계정 관리 (활성)

### `LoyaltyAnalysis.tsx` ⚠️
- **역할**: 충성 고객 분석 컴포넌트
- **상태**: 비활성화됨 (메뉴는 비활성화되어 있으나 컴포넌트는 유지)
- **주요 기능**:
  - 충성 고객 티어 분포
  - 반복 구매 추이
  - 고객 생애 가치
- **사용 데이터**: `mockLoyaltyData`
- **참고**: 향후 활성화 예정
- **사용 라이브러리**: Recharts

### `auth/LoginPage.tsx`
- **역할**: 로그인 페이지 컴포넌트
- **주요 기능**:
  - 이메일/비밀번호 입력
  - 로그인 처리
  - 회원가입/비밀번호 찾기 페이지로 이동
- **인증 연동**: `AuthContext`의 `login()` 함수 사용
- **Toast 알림**: Sonner 사용

### `auth/SignupPage.tsx`
- **역할**: 회원가입 페이지 컴포넌트
- **주요 기능**:
  - 사용자 정보 입력
  - 회원가입 처리
  - 로그인 페이지로 돌아가기

### `auth/ForgotPasswordPage.tsx`
- **역할**: 비밀번호 찾기 페이지 컴포넌트
- **주요 기능**:
  - 이메일 입력
  - 비밀번호 찾기 처리
  - 로그인 페이지로 돌아가기

### `ui/` (shadcn/ui 컴포넌트 라이브러리)
- **역할**: 재사용 가능한 UI 컴포넌트 라이브러리
- **설명**: Radix UI 기반의 shadcn/ui 컴포넌트 (40개 이상)
- **특징**:
  - 복사/붙여넣기 방식 (npm 패키지 아님)
  - Tailwind CSS 스타일링
  - TypeScript 완벽 지원
  - 접근성 (ARIA) 준수
- **주요 컴포넌트 카테고리**:
  - **레이아웃**: `card.tsx`, `separator.tsx`, `aspect-ratio.tsx`
  - **폼**: `input.tsx`, `button.tsx`, `select.tsx`, `checkbox.tsx`, `form.tsx`
  - **데이터 표시**: `table.tsx`, `badge.tsx`, `avatar.tsx`, `progress.tsx`
  - **차트**: `chart.tsx` (Recharts 래퍼)
  - **오버레이**: `dialog.tsx`, `sheet.tsx`, `popover.tsx`, `tooltip.tsx`
  - **네비게이션**: `tabs.tsx`, `breadcrumb.tsx`, `pagination.tsx`
  - **알림**: `alert.tsx`, `sonner.tsx` (토스트)
- **프로젝트에서 사용 중**:
  - ProductTable: `Card`, `Table`, `Input`, `Pagination`
  - PerformanceMetrics: `Card`, `Button`, `ChartContainer`
  - AccountManagement: `Card`, `Form`, `Input`, `Button`, `Tabs`, `Avatar`
  - Dashboard: `Button` (로그아웃)
- **수정 가능 여부**:
  - ✅ 스타일 커스터마이징 가능
  - ✅ variants 추가 가능
  - ❌ 핵심 구조 변경 권장 안 함
  - ❌ 새 파일 생성 금지 (필요시 shadcn 공식 사이트에서 복사)

---

## 📁 data/ (데이터 레이어)

### `mockData.ts`
- **역할**: Mock 데이터 중앙 관리
- **설명**: API 연동 전 개발/테스트용 가짜 데이터
- **주요 데이터**:
  - `mockProducts`: 상품 리스트 (5개)
  - `mockPerformanceData`: 상품별 성과 데이터
  - `mockDeviceData`: 디바이스 분포
  - `mockTrafficSourceSankey`: Sankey 데이터 (매체별 유입 경로)
  - `mockLoyaltyData`: 충성 고객 분석 (비활성화된 기능)
- **주요 함수**:
  - `getPerformanceDataByProduct(id)`: 상품별 성과 조회
  - `searchProducts(products, query)`: 상품 검색
- **향후 계획**: API 서비스로 완전 교체 예정

---

## 📁 types/ (타입 정의)

### `index.ts`
- **역할**: 모든 TypeScript 타입 정의
- **설명**: 프로젝트 전체에서 사용하는 데이터 타입
- **주요 타입**:
  - `Product`: 상품 데이터
  - `PerformanceData`: 성과 지표
  - `DeviceData`: 디바이스 분포
  - `LoyaltyData`: 충성 고객 데이터
  - `SankeyData`: Sankey 다이어그램 데이터
  - `SankeyNode`, `SankeyLink`: Sankey 노드/링크 타입
- **중요성**: API 응답 타입으로도 사용됨
- **수정 시점**: 데이터 구조 변경시

---

## 📁 contexts/ (React Context)

### `AuthContext.tsx`
- **역할**: 인증 상태 전역 관리
- **제공값**:
  - `isAuthenticated`: 로그인 여부
  - `login(email, password)`: 로그인 함수
  - `logout()`: 로그아웃 함수
  - `updateUser(userData)`: 사용자 정보 업데이트 함수
  - `user`: 현재 사용자 정보
- **사용자 정보 타입**:
  ```typescript
  interface User {
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
  ```
- **저장소**: localStorage를 사용한 사용자 정보 저장
- **사용 예시**:
  ```typescript
  const { isAuthenticated, login, user, updateUser } = useAuth();
  ```

---

## 📁 docs/ (문서)

### `authentication.md`
- **역할**: 인증 시스템 상세 문서
- **주요 내용**:
  - 인증 시스템 아키텍처
  - 컴포넌트 상세 설명
  - 인증 흐름
  - API 연동 가이드
  - 보안 고려사항

---

## 📁 guidelines/ (가이드라인)

### `Guidelines.md`
- **역할**: 프로젝트 개발 가이드라인
- **주요 내용**:
  - 코딩 컨벤션
  - 컴포넌트 작성 규칙
  - 파일 구조 가이드
- **대상**: 개발팀 전체

---

## 📊 파일 의존성 관계도

```
index.html
    ↓
main.tsx
    ↓
App.tsx
    ├─→ AuthContext (인증 상태 관리)
    ├─→ LoginPage / SignupPage / ForgotPasswordPage
    └─→ Dashboard
        ├─→ ProductTable
        │       ├─→ ui/ (Card, Table, Input, Pagination)
        │       └─→ data/mockData.ts
        ├─→ PerformanceMetrics
        │       ├─→ SankeyChart
        │       ├─→ ui/ (Card, Button, Chart)
        │       └─→ data/mockData.ts
        ├─→ CustomerInfo
        │       ├─→ ui/ (Card, Chart)
        │       └─→ data/mockData.ts
        ├─→ AccountManagement
        │       ├─→ AuthContext (user 정보)
        │       └─→ ui/ (Card, Form, Input, Button, Tabs, Avatar)
        └─→ LoyaltyAnalysis (비활성화)
                └─→ data/mockData.ts
```

---

## 🎯 파일 수정 우선순위

### 자주 수정하는 파일 (높음)
1. `components/` - UI 개선, 기능 추가
2. `data/mockData.ts` - Mock 데이터 조정
3. `App.tsx` - 레이아웃, 라우팅 변경
4. `contexts/AuthContext.tsx` - 인증 로직 변경

### 가끔 수정하는 파일 (중간)
6. `types/index.ts` - 타입 추가/수정
7. `index.css` - 스타일 조정
8. `.env` - 환경 변수 변경

### 거의 수정 안 하는 파일 (낮음)
9. `vite.config.ts` - 빌드 설정
10. `main.tsx` - 진입점
11. `index.html` - HTML

---

## 💡 파일 네이밍 규칙

- **컴포넌트**: PascalCase (예: `ProductTable.tsx`)
- **Hook**: camelCase with `use` prefix (예: `useProducts.ts`)
- **Service**: camelCase with `Service` suffix (예: `productService.ts`)
- **타입 파일**: camelCase (예: `index.ts`)
- **스타일 파일**: kebab-case (예: `index.css`)

---

## ❌ 삭제된 파일/폴더

다음 파일과 폴더는 프로젝트에서 삭제되었습니다:

- ❌ `src/components/ErrorBoundary.tsx` - 어디서도 import되지 않음
- ❌ `src/components/LoadingSpinner.tsx` - 어디서도 import되지 않음
- ❌ `src/components/figma/ImageWithFallback.tsx` - 어디서도 import되지 않음
- ❌ `src/components/figma/` - 빈 폴더
- ❌ `src/styles/globals.css` - 사용되지 않음 (index.css 사용)
- ❌ `src/styles/` - 빈 폴더
- ❌ `src/config/branding.ts` - 어디서도 import되지 않음 (회사명은 Dashboard.tsx에 하드코딩)
- ❌ `src/config/` - 빈 폴더
- ❌ `src/Attributions.md` - Figma 관련 파일

---

이 문서를 참고하여 프로젝트 구조를 이해하고 필요한 파일을 쉽게 찾을 수 있습니다! 🎉




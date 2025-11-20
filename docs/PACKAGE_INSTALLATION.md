# 패키지 설치 가이드

## ✅ 설치 방법

**모든 패키지는 `npm install` 한 번으로 설치됩니다!**

개별적으로 설치할 필요가 없습니다. `package.json`에 정의된 모든 의존성이 자동으로 설치됩니다.

```bash
npm install
```

---

## 📦 현재 package.json에 정의된 패키지

### 프레임워크 & 빌드 도구
- ✅ `react` - React 라이브러리
- ✅ `react-dom` - React DOM 렌더링
- ✅ `vite` - 빌드 도구 및 개발 서버 (devDependencies)

### UI & 스타일링
- ✅ `tailwindcss` - Tailwind CSS v4 (devDependencies)
- ✅ `@tailwindcss/vite` - Tailwind Vite 플러그인 (devDependencies)
- ✅ `clsx` - 클래스 이름 유틸리티
- ✅ `tailwind-merge` - Tailwind 클래스 병합
- ✅ `class-variance-authority` - 컴포넌트 variant 관리

### 차트 & 시각화
- ✅ `recharts` - 차트 라이브러리
- ✅ `d3` - 데이터 시각화
- ✅ `d3-sankey` - Sankey 다이어그램
- ✅ `@types/d3` - D3 타입 정의 (devDependencies)
- ✅ `@types/d3-sankey` - d3-sankey 타입 정의 (devDependencies)

### UI 컴포넌트 (shadcn/ui)
- ✅ `@radix-ui/react-*` - Radix UI 프리미티브 컴포넌트들 (20개 이상)
- ✅ `lucide-react` - 아이콘 라이브러리
- ✅ `date-fns` - 날짜 유틸리티
- ✅ `cmdk` - Command 메뉴 컴포넌트
- ✅ `embla-carousel-react` - 캐러셀 컴포넌트
- ✅ `input-otp` - OTP 입력 컴포넌트
- ✅ `react-day-picker` - 날짜 선택 컴포넌트
- ✅ `react-resizable-panels` - 리사이즈 가능한 패널
- ✅ `vaul` - Drawer 컴포넌트
- ✅ `next-themes` - 테마 관리

### 폼 관리
- ✅ `react-hook-form` - 폼 상태 관리

### 기타
- ✅ `sonner` - 토스트 알림
- ✅ `@vitejs/plugin-react-swc` - Vite React 플러그인 (devDependencies)
- ✅ `@types/node` - Node.js 타입 정의 (devDependencies)

---

## ❓ 누락된 패키지 확인

### TypeScript 관련
현재 `package.json`에 TypeScript가 명시적으로 없지만, 프로젝트는 TypeScript로 작성되어 있습니다.

**확인 필요:**
- `typescript` - TypeScript 컴파일러
- `@types/react` - React 타입 정의
- `@types/react-dom` - React DOM 타입 정의

**설치 방법 (필요한 경우):**
```bash
npm install -D typescript @types/react @types/react-dom
```

### 폼 유효성 검사 (선택사항)
현재 코드에서 사용하지 않지만, 폼 유효성 검사를 원한다면:

- `zod` - 스키마 검증 라이브러리
- `@hookform/resolvers` - react-hook-form과 zod 연동

**설치 방법 (필요한 경우):**
```bash
npm install zod @hookform/resolvers
```

---

## 🚀 설치 절차

### 1. 기본 설치 (권장)
```bash
npm install
```

이 명령어 하나로 `package.json`에 정의된 모든 패키지가 설치됩니다.

### 2. TypeScript 타입 정의 추가 (권장)
```bash
npm install -D typescript @types/react @types/react-dom
```

### 3. 폼 유효성 검사 추가 (선택사항)
```bash
npm install zod @hookform/resolvers
```

---

## 📋 설치 확인

설치가 완료되면 다음 명령어로 확인할 수 있습니다:

```bash
# 설치된 패키지 목록 확인
npm list --depth=0

# 특정 패키지 확인
npm list react
npm list typescript
```

---

## ⚠️ 주의사항

1. **개별 설치 불필요**: `package.json`에 정의된 패키지는 `npm install`로 자동 설치됩니다.
2. **버전 관리**: `package.json`의 버전을 확인하고 필요시 업데이트하세요.
3. **node_modules**: `.gitignore`에 포함되어 있어 Git에 커밋되지 않습니다.
4. **package-lock.json**: 자동 생성되며, 정확한 버전을 보장합니다.

---

## 🔍 현재 상태

대부분의 패키지가 이미 `package.json`에 정의되어 있으므로, `npm install`만 실행하면 됩니다.

**추가로 설치가 필요한 경우:**
- TypeScript 타입 정의 (개발 의존성)
- 폼 유효성 검사 라이브러리 (선택사항)




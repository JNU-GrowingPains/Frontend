// 상품 관련 타입
export interface Product {
  id: number;
  name: string;
  category: string;
  subCategory: string;
  smallCategory: string;
  price: number;
  priceDisplay: string;
  title: string;
  checked?: boolean;
  imageUrl?: string;
  status: 'active' | 'inactive' | 'soldout';
  createdAt: string;
  updatedAt: string;
}

// 성과 지표 타입
export interface PerformanceMetrics {
  totalVisitors: number;
  totalSales: number;
  conversionRate: number;
  averageOrderValue: number;
  period: 'daily' | 'weekly' | 'monthly';
  date: string;
}

// 차트 데이터 타입
export interface ChartData {
  month: string;
  buyers: number;
  clicks?: number;
  cartAdds?: number;
  time?: number;
}

// 고객 분석 타입
export interface CustomerAnalytics {
  ageGroups: Array<{
    ageGroup: string;
    count: number;
    percentage: number;
  }>;
  genderDistribution: Array<{
    name: string;
    value: number;
    color: string;
  }>;
  deviceDistribution: Array<{
    name: string;
    value: number;
    color: string;
  }>;
}

// 고객 정보 타입
export interface Customer {
  id: number;
  name: string;
  email: string;
  totalSpent: number;
  totalOrders: number;
  lastOrderDate: string;
  joinDate: string;
  status: 'active' | 'inactive' | 'vip';
  ageGroup: string;
  gender: 'male' | 'female' | 'unknown';
  device: 'pc' | 'mobile' | 'tablet';
  location: string;
}

// ✅ 추가: 주력 상품 분석 타입
export interface ProductFocusData {
  kpis: Array<{
    title: string;
    value: string;
    unit: string;
    icon: string;
    color: string;
  }>;
  hotProducts: Array<{
    id: string;
    name: string;
    sales: number;
    clicks: number;
    revenue: string;
    conversionRate: string;
  }>;
  performanceChart: Array<{
    period: string;
    sales: number;
    revenue: number;
    clicks: number;
  }>;
  categoryDistribution: Array<{
    name: string;
    value: number;
    color: string;
  }>;
  channelDistribution: Array<{
    name: string;
    value: number;
    color: string;
  }>;
}

// ✅ 추가: 성과 분석 타입
export interface PerformanceAnalysisData {
  kpis: Array<{
    title: string;
    value: string;
    change: string;
    changeType: 'positive' | 'negative';
    icon: string;
    color: string;
  }>;
  salesRevenue: Array<{
    period: string;
    value: number;
  }>;
  totalPurchases: Array<{
    period: string;
    value: number;
  }>;
  totalClicks: Array<{
    period: string;
    value: number;
  }>;
  cartAdditions: Array<{
    period: string;
    value: number;
  }>;
  cartConversion: Array<{
    period: string;
    cartAdds: number;
    purchases: number;
    conversionRate: number;
  }>;
  detailedConversion: Array<{
    period: string;
    clicks: number;
    cartAdds: number;
    purchases: number;
  }>;
}

// ✅ 추가: 고객 분석 타입
export interface CustomerAnalysisData {
  loyalCustomerKPIs: Array<{
    title: string;
    value: string;
    change?: string;
    changeType?: 'positive' | 'negative' | null;
    icon: string;
    color: string;
  }>;
  vipStats: Array<{
    icon: string;
    title: string;
    mainValue: string;
    subValue: string;
    bgColor: string;
  }>;
  repurchaseTime: Array<{
    time: string;
    count: number;
  }>;
  deviceUsage: Array<{
    name: string;
    value: number;
    color: string;
  }>;
  preferredCategories: Array<{
    category: string;
    value: number;
    color: string;
  }>;
  accessPages: Array<{
    page: string;
    value: number;
    color: string;
  }>;
  loyaltyFlow: Array<{
    period: string;
    repurchaseRate: number;
    avgLTV: number;
    vipContribution: number;
  }>;
}

// 통합 대시보드 데이터 타입
export interface DashboardData {
  products: Product[];
  performanceMetrics: PerformanceMetrics;
  buyersData: ChartData[];
  clicksCartData: ChartData[];
  stayTimeData: ChartData[];
  customerAnalytics: CustomerAnalytics;
  topCustomers: Customer[];
  // ✅ 추가: 세부 대시보드 데이터
  productFocus: ProductFocusData;
  performanceAnalysis: PerformanceAnalysisData;
  customerAnalysis: CustomerAnalysisData;
  lastUpdated: Date;
}

// API 응답 타입
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  error?: string;
}

// API 요청 필터 타입
export interface DashboardFilters {
  dateRange: {
    startDate: string;
    endDate: string;
  };
  period: 'daily' | 'weekly' | 'monthly';
  productIds?: number[];
  customerSegment?: 'all' | 'new' | 'returning' | 'vip';
}
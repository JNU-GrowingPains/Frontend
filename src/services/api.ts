// 성장통 대시보드 API 서비스

export type TimeRange = 'yesterday' | 'week' | 'month';
export type ChartType = 'sales' | 'revenue' | 'clicks';

// 기본 API 설정 (브라우저 환경에서 process.env 사용 불가)
const API_BASE_URL = '/api'; // 실제 API 연동 시 변경

// API 응답 타입들
export interface KPIData {
  title: string;
  value: string;
  change: string;
  changeType: 'positive' | 'negative' | 'neutral';
  icon: string;
  color: string;
}

export interface ChartDataPoint {
  period: string;
  value: number;
}

export interface ProductData {
  id: number;
  name: string;
  category: string;
  sales: number;
  clicks: number;
  revenue: string;
  conversionRate: string;
}

export interface ConversionData {
  period: string;
  cartAdds: number;
  purchases: number;
  conversionRate: number;
  clicks?: number;
}

export interface CustomerData {
  ageGroup: string;
  count: number;
  percentage?: number;
}

// Mock 데이터 (실제 API 연동 전까지 사용)
export class DashboardAPI {
  // 메인 대시보드 API
  static async getProductList(timeRange: TimeRange = 'month'): Promise<ProductData[]> {
    // TODO: 실제 API 호출로 교체
    const mockProducts = [
      { id: 1, name: '청 셔츠', category: 'Cell Text', sales: 1200, clicks: 3400, revenue: '₩2,400,000', conversionRate: '35.3%' },
      { id: 2, name: '퍼티그 패츠', category: 'Cell Text', sales: 890, clicks: 2800, revenue: '₩1,780,000', conversionRate: '31.8%' },
      { id: 3, name: '화이트 스니커즈', category: 'Cell Text', sales: 1450, clicks: 3900, revenue: '₩2,900,000', conversionRate: '37.2%' },
      { id: 4, name: '블랙 재킷', category: 'Cell Text', sales: 670, clicks: 2100, revenue: '₩1,340,000', conversionRate: '31.9%' },
      { id: 5, name: '데님 패츠', category: 'Cell Text', sales: 1100, clicks: 3200, revenue: '₩2,200,000', conversionRate: '34.4%' }
    ];

    // 시간 범위에 따른 데이터 조정 시뮬레이션
    const multiplier = timeRange === 'yesterday' ? 0.1 : timeRange === 'week' ? 0.3 : 1;
    
    return mockProducts.map(product => ({
      ...product,
      sales: Math.round(product.sales * multiplier),
      clicks: Math.round(product.clicks * multiplier)
    }));
  }

  static async getBuyersData(timeRange: TimeRange = 'month'): Promise<ChartDataPoint[]> {
    const baseBuyersData = [
      { period: '1월', value: 1200 },
      { period: '2월', value: 1100 },
      { period: '3월', value: 1300 },
      { period: '4월', value: 1150 },
      { period: '5월', value: 1400 },
      { period: '6월', value: 1250 },
      { period: '7월', value: 1350 }
    ];

    // 시간 범위에 따른 데이터 변환
    if (timeRange === 'yesterday') {
      return [{ period: '어제', value: 1200 }];
    } else if (timeRange === 'week') {
      return [
        { period: '월', value: 180 },
        { period: '화', value: 165 },
        { period: '수', value: 190 },
        { period: '목', value: 175 },
        { period: '금', value: 200 },
        { period: '토', value: 160 },
        { period: '일', value: 140 }
      ];
    }

    return baseBuyersData;
  }

  static async getClickCartData(timeRange: TimeRange = 'month'): Promise<ChartDataPoint[]> {
    const baseClickCartData = [
      { period: '1월', value: 2800 },
      { period: '2월', value: 2400 },
      { period: '3월', value: 3100 },
      { period: '4월', value: 2600 },
      { period: '5월', value: 3300 },
      { period: '6월', value: 2900 },
      { period: '7월', value: 3200 }
    ];

    if (timeRange === 'yesterday') {
      return [{ period: '어제', value: 2800 }];
    } else if (timeRange === 'week') {
      return [
        { period: '월', value: 420 },
        { period: '화', value: 380 },
        { period: '수', value: 450 },
        { period: '목', value: 410 },
        { period: '금', value: 480 },
        { period: '토', value: 360 },
        { period: '일', value: 320 }
      ];
    }

    return baseClickCartData;
  }

  static async getAvgStayTimeData(timeRange: TimeRange = 'month'): Promise<ChartDataPoint[]> {
    const baseStayTimeData = [
      { period: '1월', value: 180 },
      { period: '2월', value: 165 },
      { period: '3월', value: 195 },
      { period: '4월', value: 170 },
      { period: '5월', value: 200 },
      { period: '6월', value: 185 },
      { period: '7월', value: 190 }
    ];

    if (timeRange === 'yesterday') {
      return [{ period: '어제', value: 180 }];
    } else if (timeRange === 'week') {
      return [
        { period: '월', value: 28 },
        { period: '화', value: 25 },
        { period: '수', value: 32 },
        { period: '목', value: 27 },
        { period: '금', value: 30 },
        { period: '토', value: 22 },
        { period: '일', value: 20 }
      ];
    }

    return baseStayTimeData;
  }

  static async getCustomerAnalytics(timeRange: TimeRange = 'month'): Promise<{
    ageData: CustomerData[];
    genderData: CustomerData[];
    deviceData: CustomerData[];
  }> {
    // Mock 고객 분석 데이터
    const baseAgeData = [
      { ageGroup: '10-19', count: 280, percentage: 11.3 },
      { ageGroup: '20-29', count: 520, percentage: 21.0 },
      { ageGroup: '30-39', count: 680, percentage: 27.4 },
      { ageGroup: '40-49', count: 590, percentage: 23.8 },
      { ageGroup: '50-59', count: 330, percentage: 13.3 },
      { ageGroup: '60+', count: 80, percentage: 3.2 }
    ];

    const baseGenderData = [
      { ageGroup: '남성', count: 1180, percentage: 47.6 },
      { ageGroup: '여성', count: 1300, percentage: 52.4 }
    ];

    const baseDeviceData = [
      { ageGroup: 'PC', count: 1240, percentage: 50.0 },
      { ageGroup: '모바일', count: 990, percentage: 39.9 },
      { ageGroup: '태블릿', count: 250, percentage: 10.1 }
    ];

    // 시간 범위에 따른 데이터 조정
    const multiplier = timeRange === 'yesterday' ? 0.05 : timeRange === 'week' ? 0.2 : 1;

    return {
      ageData: baseAgeData.map(item => ({
        ...item,
        count: Math.round(item.count * multiplier)
      })),
      genderData: baseGenderData.map(item => ({
        ...item,
        count: Math.round(item.count * multiplier)
      })),
      deviceData: baseDeviceData.map(item => ({
        ...item,
        count: Math.round(item.count * multiplier)
      }))
    };
  }

  // 성과 지표 대시보드 API
  static async getKPIData(timeRange: TimeRange = 'month'): Promise<KPIData[]> {
    const baseKPIData = [
      { title: '총 매출액', value: '₩125,000,000', change: '+12%', changeType: 'positive' as const, icon: 'DollarSign', color: 'text-green-600' },
      { title: '총 구매 수', value: '1,250', change: '+8%', changeType: 'positive' as const, icon: 'ShoppingCart', color: 'text-blue-600' },
      { title: '총 사용자 수', value: '1,240', change: '+7%', changeType: 'positive' as const, icon: 'Users', color: 'text-purple-600' },
      { title: '총 장바구니 추가 수', value: '2,300', change: '+5%', changeType: 'positive' as const, icon: 'Activity', color: 'text-orange-600' }
    ];

    // 시간 범위에 따른 값 조정
    if (timeRange === 'yesterday') {
      return [
        { ...baseKPIData[0], value: '₩4,200,000' },
        { ...baseKPIData[1], value: '42' },
        { ...baseKPIData[2], value: '38' },
        { ...baseKPIData[3], value: '76' }
      ];
    } else if (timeRange === 'week') {
      return [
        { ...baseKPIData[0], value: '₩25,000,000' },
        { ...baseKPIData[1], value: '250' },
        { ...baseKPIData[2], value: '248' },
        { ...baseKPIData[3], value: '460' }
      ];
    }

    return baseKPIData;
  }

  static async getSalesData(timeRange: TimeRange = 'month'): Promise<{
    salesRevenue: ChartDataPoint[];
    totalPurchases: ChartDataPoint[];
    totalClicks: ChartDataPoint[];
    cartAdditions: ChartDataPoint[];
  }> {
    // 기본 월별 데이터
    const baseSalesRevenue = [
      { period: '1월', value: 125000000 },
      { period: '2월', value: 98000000 },
      { period: '3월', value: 87000000 },
      { period: '4월', value: 102000000 },
      { period: '5월', value: 89000000 },
      { period: '6월', value: 134000000 },
      { period: '7월', value: 78000000 }
    ];

    const baseTotalPurchases = [
      { period: '1월', value: 1450 },
      { period: '2월', value: 1200 },
      { period: '3월', value: 980 },
      { period: '4월', value: 1100 },
      { period: '5월', value: 890 },
      { period: '6월', value: 1380 },
      { period: '7월', value: 750 }
    ];

    const baseTotalClicks = [
      { period: '1월', value: 8500 },
      { period: '2월', value: 7200 },
      { period: '3월', value: 6800 },
      { period: '4월', value: 7500 },
      { period: '5월', value: 6200 },
      { period: '6월', value: 8900 },
      { period: '7월', value: 5800 }
    ];

    const baseCartAdditions = [
      { period: '1월', value: 3200 },
      { period: '2월', value: 2800 },
      { period: '3월', value: 2400 },
      { period: '4월', value: 2900 },
      { period: '5월', value: 2100 },
      { period: '6월', value: 3400 },
      { period: '7월', value: 1900 }
    ];

    // 시간 범위에 따른 데이터 변환
    if (timeRange === 'yesterday') {
      return {
        salesRevenue: [{ period: '어제', value: 4200000 }],
        totalPurchases: [{ period: '어제', value: 48 }],
        totalClicks: [{ period: '어제', value: 280 }],
        cartAdditions: [{ period: '어제', value: 110 }]
      };
    } else if (timeRange === 'week') {
      return {
        salesRevenue: [
          { period: '월', value: 18000000 },
          { period: '화', value: 15000000 },
          { period: '수', value: 22000000 },
          { period: '목', value: 19000000 },
          { period: '금', value: 25000000 },
          { period: '토', value: 14000000 },
          { period: '일', value: 12000000 }
        ],
        totalPurchases: [
          { period: '월', value: 200 },
          { period: '화', value: 180 },
          { period: '수', value: 240 },
          { period: '목', value: 210 },
          { period: '금', value: 280 },
          { period: '토', value: 160 },
          { period: '일', value: 140 }
        ],
        totalClicks: [
          { period: '월', value: 1200 },
          { period: '화', value: 1100 },
          { period: '수', value: 1350 },
          { period: '목', value: 1250 },
          { period: '금', value: 1450 },
          { period: '토', value: 900 },
          { period: '일', value: 800 }
        ],
        cartAdditions: [
          { period: '월', value: 450 },
          { period: '화', value: 420 },
          { period: '수', value: 520 },
          { period: '목', value: 480 },
          { period: '금', value: 580 },
          { period: '토', value: 350 },
          { period: '일', value: 300 }
        ]
      };
    }

    return {
      salesRevenue: baseSalesRevenue,
      totalPurchases: baseTotalPurchases,
      totalClicks: baseTotalClicks,
      cartAdditions: baseCartAdditions
    };
  }

  static async getConversionData(timeRange: TimeRange = 'month'): Promise<ConversionData[]> {
    const baseConversionData = [
      { period: '1월', cartAdds: 3200, purchases: 1450, conversionRate: 45.3, clicks: 8500 },
      { period: '2월', cartAdds: 2800, purchases: 1200, conversionRate: 42.9, clicks: 7200 },
      { period: '3월', cartAdds: 2400, purchases: 980, conversionRate: 40.8, clicks: 6800 },
      { period: '4월', cartAdds: 2900, purchases: 1100, conversionRate: 37.9, clicks: 7500 },
      { period: '5월', cartAdds: 2100, purchases: 890, conversionRate: 42.4, clicks: 6200 },
      { period: '6월', cartAdds: 3400, purchases: 1380, conversionRate: 40.6, clicks: 8900 },
      { period: '7월', cartAdds: 1900, purchases: 750, conversionRate: 39.5, clicks: 5800 }
    ];

    if (timeRange === 'yesterday') {
      return [{ period: '어제', cartAdds: 110, purchases: 48, conversionRate: 43.6, clicks: 280 }];
    } else if (timeRange === 'week') {
      return [
        { period: '월', cartAdds: 450, purchases: 200, conversionRate: 44.4, clicks: 1200 },
        { period: '화', cartAdds: 420, purchases: 180, conversionRate: 42.9, clicks: 1100 },
        { period: '수', cartAdds: 520, purchases: 240, conversionRate: 46.2, clicks: 1350 },
        { period: '목', cartAdds: 480, purchases: 210, conversionRate: 43.8, clicks: 1250 },
        { period: '금', cartAdds: 580, purchases: 280, conversionRate: 48.3, clicks: 1450 },
        { period: '토', cartAdds: 350, purchases: 160, conversionRate: 45.7, clicks: 900 },
        { period: '일', cartAdds: 300, purchases: 140, conversionRate: 46.7, clicks: 800 }
      ];
    }

    return baseConversionData;
  }

  // 주력 상품 분석 API
  static async getHotProductsData(timeRange: TimeRange = 'month'): Promise<ProductData[]> {
    const baseHotProducts = [
      { id: 1, name: '상품 A', category: '의류', sales: 7000, clicks: 1900, revenue: '₩15,000,000', conversionRate: '5.8%' },
      { id: 2, name: '상품 B', category: '신발', sales: 5200, clicks: 1600, revenue: '₩12,000,000', conversionRate: '4.2%' },
      { id: 3, name: '상품 C', category: '액세서리', sales: 4800, clicks: 1400, revenue: '₩8,500,000', conversionRate: '3.9%' },
      { id: 4, name: '상품 D', category: '가방', sales: 3900, clicks: 1200, revenue: '₩9,800,000', conversionRate: '3.2%' },
      { id: 5, name: '상품 E', category: '의류', sales: 3400, clicks: 1100, revenue: '₩7,200,000', conversionRate: '2.8%' }
    ];

    const multiplier = timeRange === 'yesterday' ? 0.05 : timeRange === 'week' ? 0.2 : 1;
    
    return baseHotProducts.map(product => ({
      ...product,
      sales: Math.round(product.sales * multiplier),
      clicks: Math.round(product.clicks * multiplier)
    }));
  }

  static async getPerformanceChartData(timeRange: TimeRange = 'month', chartType: ChartType = 'sales'): Promise<ChartDataPoint[]> {
    const baseData = {
      sales: [
        { period: '1월', value: 4200 },
        { period: '2월', value: 3800 },
        { period: '3월', value: 4500 },
        { period: '4월', value: 3900 },
        { period: '5월', value: 4800 },
        { period: '6월', value: 4200 },
        { period: '7월', value: 4600 }
      ],
      revenue: [
        { period: '1월', value: 8500 },
        { period: '2월', value: 7800 },
        { period: '3월', value: 9200 },
        { period: '4월', value: 8100 },
        { period: '5월', value: 9800 },
        { period: '6월', value: 8700 },
        { period: '7월', value: 9400 }
      ],
      clicks: [
        { period: '1월', value: 12000 },
        { period: '2월', value: 11200 },
        { period: '3월', value: 13500 },
        { period: '4월', value: 11800 },
        { period: '5월', value: 14200 },
        { period: '6월', value: 12800 },
        { period: '7월', value: 13800 }
      ]
    };

    let data = baseData[chartType];

    if (timeRange === 'yesterday') {
      return [{ period: '어제', value: data[0].value * 0.05 }];
    } else if (timeRange === 'week') {
      return [
        { period: '월', value: Math.round(data[0].value * 0.15) },
        { period: '화', value: Math.round(data[1].value * 0.14) },
        { period: '수', value: Math.round(data[2].value * 0.16) },
        { period: '목', value: Math.round(data[3].value * 0.15) },
        { period: '금', value: Math.round(data[4].value * 0.18) },
        { period: '토', value: Math.round(data[5].value * 0.12) },
        { period: '일', value: Math.round(data[6].value * 0.10) }
      ];
    }

    return data;
  }

  // 고객 분석 대시보드 API  
  static async getLoyalCustomerKPI(timeRange: TimeRange = 'month'): Promise<KPIData[]> {
    const baseLoyalKPI = [
      { title: '재구매율', value: '28.5%', change: '+1.2%p', changeType: 'positive' as const, icon: 'RefreshCw', color: 'text-green-600' },
      { title: '평균 LTV', value: '₩450,000', change: '+8.5%', changeType: 'positive' as const, icon: 'DollarSign', color: 'text-blue-600' },
      { title: 'VIP 고객수', value: '342명', change: '+15명', changeType: 'positive' as const, icon: 'Star', color: 'text-yellow-600' },
      { title: 'VIP 매출 기여도', value: '62.8%', change: '+2.1%p', changeType: 'positive' as const, icon: 'TrendingUp', color: 'text-purple-600' },
      { title: '평균 구매 간격', value: '18일', change: '-2일', changeType: 'positive' as const, icon: 'Calendar', color: 'text-orange-600' }
    ];

    // 시간 범위에 따른 값 조정
    if (timeRange === 'yesterday') {
      return [
        { ...baseLoyalKPI[0], value: '32.1%' },
        { ...baseLoyalKPI[1], value: '₩15,000' },
        { ...baseLoyalKPI[2], value: '12명' },
        { ...baseLoyalKPI[3], value: '68.5%' },
        { ...baseLoyalKPI[4], value: '1일' }
      ];
    } else if (timeRange === 'week') {
      return [
        { ...baseLoyalKPI[0], value: '29.8%' },
        { ...baseLoyalKPI[1], value: '₩90,000' },
        { ...baseLoyalKPI[2], value: '68명' },
        { ...baseLoyalKPI[3], value: '64.2%' },
        { ...baseLoyalKPI[4], value: '4일' }
      ];
    }

    return baseLoyalKPI;
  }
}

// 실제 API 연동 시 사용할 함수들
export const apiCall = async (endpoint: string, options?: RequestInit) => {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
      ...options,
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('API call failed:', error);
    throw error;
  }
};

// 실제 API 연동 예시 (사용 안함, 참고용)
export const RealAPI = {
  // 실제 API 연동 시 DashboardAPI 클래스의 메서드들을 이런 식으로 구현
  async getProductList(timeRange: TimeRange) {
    return apiCall(`/products?timeRange=${timeRange}`);
  },
  
  async getKPIData(timeRange: TimeRange) {
    return apiCall(`/kpi?timeRange=${timeRange}`);
  }
  
  // ... 기타 API 엔드포인트들
};
import type { Product, PerformanceData, DeviceData, LoyaltyData } from "../types";
import type { SankeyData } from "../types";
import { format } from "date-fns";
import { ko } from "date-fns/locale";

// 한달치 일별 데이터 생성 헬퍼 함수
function generateDailyData(
  baseBuyers: number[],
  baseClicks: number[],
  baseCartAdds: number[],
  year: number = 2025,
  month: number = 1
) {
  const daysInMonth = new Date(year, month, 0).getDate();
  const buyers: { day: string; count: number }[] = [];
  const clicks: { day: string; clicks: number; cartAdds: number }[] = [];

  for (let day = 1; day <= daysInMonth; day++) {
    const date = new Date(year, month - 1, day);
    const dayLabel = format(date, "yyyy-MM-dd", { locale: ko });
    const dayOfWeek = date.getDay(); // 0(일) ~ 6(토)
    
    // 요일별 패턴 적용 (주말에 더 높은 값)
    const weekdayMultiplier = (dayOfWeek === 0 || dayOfWeek === 6) ? 1.15 : 1.0;
    const baseIndex = dayOfWeek === 0 ? 6 : dayOfWeek - 1; // 월요일부터 시작
    
    // buyers 데이터
    const baseBuyerValue = baseBuyers[baseIndex % baseBuyers.length];
    const buyerVariation = Math.floor(Math.random() * 80) - 40; // ±40 랜덤 변동
    buyers.push({
      day: dayLabel,
      count: Math.max(0, Math.floor(baseBuyerValue * weekdayMultiplier + buyerVariation)),
    });

    // clicks 데이터
    const baseClickValue = baseClicks[baseIndex % baseClicks.length];
    const baseCartAddValue = baseCartAdds[baseIndex % baseCartAdds.length];
    const clickVariation = Math.floor(Math.random() * 100) - 50;
    const cartVariation = Math.floor(Math.random() * 80) - 40;
    clicks.push({
      day: dayLabel,
      clicks: Math.max(0, Math.floor(baseClickValue * weekdayMultiplier + clickVariation)),
      cartAdds: Math.max(0, Math.floor(baseCartAddValue * weekdayMultiplier + cartVariation)),
    });
  }

  return { buyers, clicks };
}

// Mock products data
export const mockProducts: Product[] = [
  {
    id: "1",
    name: "청 셔츠",
    topCategory: "남성",
    midCategory: "상의",
    subCategory: "셔츠",
    price: "110,000원",
    productNumber: "98766789"
  },
  {
    id: "2", 
    name: "퍼티그 팬츠",
    topCategory: "남성",
    midCategory: "하의",
    subCategory: "바지",
    price: "110,000원",
    productNumber: "89489389"
  },
  {
    id: "3",
    name: "샴브레이 셔츠",
    topCategory: "남성",
    midCategory: "상의",
    subCategory: "셔츠",
    price: "110,000원",
    productNumber: "12341412"
  },
  {
    id: "4",
    name: "셀비지 데님",
    topCategory: "남성",
    midCategory: "하의",
    subCategory: "바지",
    price: "110,000원",
    productNumber: "123415112"
  },
  {
    id: "5",
    name: "연청 데님",
    topCategory: "남성",
    midCategory: "하의",
    subCategory: "바지",
    price: "110,000원",
    productNumber: "112847363"
  }
];

// Mock performance data for each product
export const mockPerformanceData: Record<string, PerformanceData> = {
  "1": {
    productId: "1",
    weekly: {
      buyers: [
        { day: "월", count: 750 },
        { day: "화", count: 720 },
        { day: "수", count: 680 },
        { day: "목", count: 710 },
        { day: "금", count: 750 },
        { day: "토", count: 770 },
        { day: "일", count: 820 }
      ],
      clicks: [
        { day: "월", clicks: 820, cartAdds: 680 },
        { day: "화", clicks: 790, cartAdds: 650 },
        { day: "수", clicks: 760, cartAdds: 630 },
        { day: "목", clicks: 810, cartAdds: 670 },
        { day: "금", clicks: 850, cartAdds: 700 },
        { day: "토", clicks: 880, cartAdds: 730 },
        { day: "일", clicks: 920, cartAdds: 760 }
      ]
    },
    monthly: {
      buyers: Array.from({ length: 30 }, (_, i) => ({
        day: `${i + 1}일`,
        count: 700 + Math.floor(Math.random() * 150)
      })),
      clicks: Array.from({ length: 30 }, (_, i) => ({
        day: `${i + 1}일`,
        clicks: 750 + Math.floor(Math.random() * 200),
        cartAdds: 600 + Math.floor(Math.random() * 150)
      }))
    },
    daily: generateDailyData(
      [750, 720, 680, 710, 750, 770, 820],
      [820, 790, 760, 810, 850, 880, 920],
      [680, 650, 630, 670, 700, 730, 760]
    ),
    trafficSources: [
      { source: "네이버", count: 820 },
      { source: "Insta", count: 750 },
      { source: "Daum", count: 730 },
      { source: "Google", count: 680 },
      { source: "Facebook", count: 710 },
      { source: "Kakao", count: 750 },
      { source: "모름", count: 770 }
    ]
  },
  "2": {
    productId: "2",
    weekly: {
      buyers: [
        { day: "월", count: 850 },
        { day: "화", count: 820 },
        { day: "수", count: 780 },
        { day: "목", count: 810 },
        { day: "금", count: 850 },
        { day: "토", count: 870 },
        { day: "일", count: 920 }
      ],
      clicks: [
        { day: "월", clicks: 920, cartAdds: 780 },
        { day: "화", clicks: 890, cartAdds: 750 },
        { day: "수", clicks: 860, cartAdds: 730 },
        { day: "목", clicks: 910, cartAdds: 770 },
        { day: "금", clicks: 950, cartAdds: 800 },
        { day: "토", clicks: 980, cartAdds: 830 },
        { day: "일", clicks: 1020, cartAdds: 860 }
      ]
    },
    monthly: {
      buyers: Array.from({ length: 30 }, (_, i) => ({
        day: `${i + 1}일`,
        count: 800 + Math.floor(Math.random() * 150)
      })),
      clicks: Array.from({ length: 30 }, (_, i) => ({
        day: `${i + 1}일`,
        clicks: 850 + Math.floor(Math.random() * 200),
        cartAdds: 700 + Math.floor(Math.random() * 150)
      }))
    },
    daily: generateDailyData(
      [850, 820, 780, 810, 850, 870, 920],
      [920, 890, 860, 910, 950, 980, 1020],
      [780, 750, 730, 770, 800, 830, 860]
    ),
    trafficSources: [
      { source: "네이버", count: 920 },
      { source: "Insta", count: 850 },
      { source: "Daum", count: 830 },
      { source: "Google", count: 780 },
      { source: "Facebook", count: 810 },
      { source: "Kakao", count: 850 },
      { source: "모름", count: 870 }
    ]
  },
  "3": {
    productId: "3",
    weekly: {
      buyers: [
        { day: "월", count: 650 },
        { day: "화", count: 620 },
        { day: "수", count: 580 },
        { day: "목", count: 610 },
        { day: "금", count: 650 },
        { day: "토", count: 670 },
        { day: "일", count: 720 }
      ],
      clicks: [
        { day: "월", clicks: 720, cartAdds: 580 },
        { day: "화", clicks: 690, cartAdds: 550 },
        { day: "수", clicks: 660, cartAdds: 530 },
        { day: "목", clicks: 710, cartAdds: 570 },
        { day: "금", clicks: 750, cartAdds: 600 },
        { day: "토", clicks: 780, cartAdds: 630 },
        { day: "일", clicks: 820, cartAdds: 660 }
      ]
    },
    monthly: {
      buyers: Array.from({ length: 30 }, (_, i) => ({
        day: `${i + 1}일`,
        count: 600 + Math.floor(Math.random() * 150)
      })),
      clicks: Array.from({ length: 30 }, (_, i) => ({
        day: `${i + 1}일`,
        clicks: 650 + Math.floor(Math.random() * 200),
        cartAdds: 500 + Math.floor(Math.random() * 150)
      }))
    },
    daily: generateDailyData(
      [650, 620, 580, 610, 650, 670, 720],
      [720, 690, 660, 710, 750, 780, 820],
      [580, 550, 530, 570, 600, 630, 660]
    ),
    trafficSources: [
      { source: "네이버", count: 720 },
      { source: "Insta", count: 650 },
      { source: "Daum", count: 630 },
      { source: "Google", count: 580 },
      { source: "Facebook", count: 610 },
      { source: "Kakao", count: 650 },
      { source: "모름", count: 670 }
    ]
  },
  "4": {
    productId: "4",
    weekly: {
      buyers: [
        { day: "월", count: 950 },
        { day: "화", count: 920 },
        { day: "수", count: 880 },
        { day: "목", count: 910 },
        { day: "금", count: 950 },
        { day: "토", count: 970 },
        { day: "일", count: 1020 }
      ],
      clicks: [
        { day: "월", clicks: 1020, cartAdds: 880 },
        { day: "화", clicks: 990, cartAdds: 850 },
        { day: "수", clicks: 960, cartAdds: 830 },
        { day: "목", clicks: 1010, cartAdds: 870 },
        { day: "금", clicks: 1050, cartAdds: 900 },
        { day: "토", clicks: 1080, cartAdds: 930 },
        { day: "일", clicks: 1120, cartAdds: 960 }
      ]
    },
    monthly: {
      buyers: Array.from({ length: 30 }, (_, i) => ({
        day: `${i + 1}일`,
        count: 900 + Math.floor(Math.random() * 150)
      })),
      clicks: Array.from({ length: 30 }, (_, i) => ({
        day: `${i + 1}일`,
        clicks: 950 + Math.floor(Math.random() * 200),
        cartAdds: 800 + Math.floor(Math.random() * 150)
      }))
    },
    daily: generateDailyData(
      [950, 920, 880, 910, 950, 970, 1020],
      [1020, 990, 960, 1010, 1050, 1080, 1120],
      [880, 850, 830, 870, 900, 930, 960]
    ),
    trafficSources: [
      { source: "네이버", count: 1020 },
      { source: "Insta", count: 950 },
      { source: "Daum", count: 930 },
      { source: "Google", count: 880 },
      { source: "Facebook", count: 910 },
      { source: "Kakao", count: 950 },
      { source: "모름", count: 970 }
    ]
  },
  "5": {
    productId: "5",
    weekly: {
      buyers: [
        { day: "월", count: 550 },
        { day: "화", count: 520 },
        { day: "수", count: 480 },
        { day: "목", count: 510 },
        { day: "금", count: 550 },
        { day: "토", count: 570 },
        { day: "일", count: 620 }
      ],
      clicks: [
        { day: "월", clicks: 620, cartAdds: 480 },
        { day: "화", clicks: 590, cartAdds: 450 },
        { day: "수", clicks: 560, cartAdds: 430 },
        { day: "목", clicks: 610, cartAdds: 470 },
        { day: "금", clicks: 650, cartAdds: 500 },
        { day: "토", clicks: 680, cartAdds: 530 },
        { day: "일", clicks: 720, cartAdds: 560 }
      ]
    },
    monthly: {
      buyers: Array.from({ length: 30 }, (_, i) => ({
        day: `${i + 1}일`,
        count: 500 + Math.floor(Math.random() * 150)
      })),
      clicks: Array.from({ length: 30 }, (_, i) => ({
        day: `${i + 1}일`,
        clicks: 550 + Math.floor(Math.random() * 200),
        cartAdds: 400 + Math.floor(Math.random() * 150)
      }))
    },
    daily: generateDailyData(
      [550, 520, 480, 510, 550, 570, 620],
      [620, 590, 560, 610, 650, 680, 720],
      [480, 450, 430, 470, 500, 530, 560]
    ),
    trafficSources: [
      { source: "네이버", count: 620 },
      { source: "Insta", count: 550 },
      { source: "Daum", count: 530 },
      { source: "Google", count: 480 },
      { source: "Facebook", count: 510 },
      { source: "Kakao", count: 550 },
      { source: "모름", count: 570 }
    ]
  }
};

// Mock customer device data
export const mockDeviceData: DeviceData[] = [
  { name: "모바일", value: 1850, color: "#10b981" },
  { name: "데스크톱", value: 650, color: "#6366f1" },
  { name: "태블릿", value: 145, color: "#f59e0b" }
];

// Mock loyalty data
export const mockLoyaltyData: LoyaltyData = {
  tiers: [
    { tier: "VIP", count: 145, color: "#fbbf24" },
    { tier: "골드", count: 320, color: "#f59e0b" },
    { tier: "실버", count: 580, color: "#94a3b8" },
    { tier: "일반", count: 1200, color: "#cbd5e1" }
  ],
  repeatPurchases: [
    { month: "1월", count: 420 },
    { month: "2월", count: 480 },
    { month: "3월", count: 520 },
    { month: "4월", count: 550 },
    { month: "5월", count: 590 },
    { month: "6월", count: 630 }
  ],
  lifetimeValues: [
    { segment: "상위 10%", value: 1200000 },
    { segment: "상위 11-25%", value: 650000 },
    { segment: "상위 26-50%", value: 320000 },
    { segment: "하위 50%", value: 85000 }
  ],
  summary: {
    totalLoyalCustomers: 2245,
    avgRepeatPurchase: 532,
    vipCustomers: 145,
    repeatPurchaseRate: 68.5
  }
};

// Helper function to get performance data by product ID
export function getPerformanceDataByProduct(productId: string | null): PerformanceData | null {
  if (!productId || !mockPerformanceData[productId]) {
    return null;
  }
  return mockPerformanceData[productId];
}

// Helper function to search products
export function searchProducts(products: Product[], searchTerm: string): Product[] {
  if (!searchTerm) return products;
  
  const term = searchTerm.toLowerCase();
  return products.filter(product =>
    product.name.toLowerCase().includes(term) ||
    product.topCategory.toLowerCase().includes(term) ||
    product.midCategory.toLowerCase().includes(term) ||
    product.subCategory.toLowerCase().includes(term)
  );
}

// 유입 경로 Sankey 데이터 (매체별 고객 유입 경로)
export const mockTrafficSourceSankey: SankeyData = {
  nodes: [
    { name: "검색엔진" },
    { name: "SNS 광고" },
    { name: "직접 방문" },
    { name: "이메일" },
    { name: "홈페이지" },
    { name: "상품 페이지" },
    { name: "회원가입" },
    { name: "구매" },
  ],
  links: [
    { source: 0, target: 4, value: 3500 },  // 검색엔진 → 홈페이지
    { source: 0, target: 5, value: 2000 },  // 검색엔진 → 상품 페이지
    { source: 1, target: 4, value: 2800 },  // SNS → 홈페이지
    { source: 1, target: 5, value: 1200 },  // SNS → 상품 페이지
    { source: 2, target: 4, value: 1500 },  // 직접 → 홈페이지
    { source: 3, target: 4, value: 800 },   // 이메일 → 홈페이지
    { source: 4, target: 6, value: 2000 },  // 홈페이지 → 회원가입
    { source: 4, target: 7, value: 1500 },  // 홈페이지 → 구매
    { source: 5, target: 7, value: 2500 },  // 상품 페이지 → 구매
  ],
};
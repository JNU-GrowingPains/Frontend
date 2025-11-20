// Product related types
export interface Product {
  id: string;
  name: string;
  topCategory: string;
  midCategory: string;
  subCategory: string;
  price: string;
  productNumber: string;
}

// Performance metrics types
export interface DayData {
  day: string;
  count: number;
}

export interface ClickData {
  day: string;
  clicks: number;
  cartAdds: number;
}

export interface TrafficSource {
  source: string;
  count: number;
}

export interface PerformanceData {
  productId: string;
  weekly: {
    buyers: DayData[];
    clicks: ClickData[];
  };
  monthly: {
    buyers: DayData[];
    clicks: ClickData[];
  };
  daily: {
    buyers: DayData[];
    clicks: ClickData[];
  };
  trafficSources: TrafficSource[];
}

// Customer info types
export interface DeviceData {
  name: string;
  value: number;
  color: string;
}

// Loyalty analysis types
export interface LoyaltyTier {
  tier: string;
  count: number;
  color: string;
}

export interface RepeatPurchase {
  month: string;
  count: number;
}

export interface LifetimeValue {
  segment: string;
  value: number;
}

export interface LoyaltyData {
  tiers: LoyaltyTier[];
  repeatPurchases: RepeatPurchase[];
  lifetimeValues: LifetimeValue[];
  summary: {
    totalLoyalCustomers: number;
    avgRepeatPurchase: number;
    vipCustomers: number;
    repeatPurchaseRate: number;
  };
}


export interface SankeyNode {
  name: string;
  id?: string | number;
}

export interface SankeyLink {
  source: string | number;
  target: string | number;
  value: number;
}

export interface SankeyData {
  nodes: SankeyNode[];
  links: SankeyLink[];
}
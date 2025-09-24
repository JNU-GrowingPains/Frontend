import { useState, useEffect } from 'react';
import { DashboardAPI, TimeRange, ChartType } from '../services/api';

// 로딩 상태와 에러 처리를 포함한 데이터 훅들

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
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [timeRange]);

  return { data, loading, error, refetch: () => setLoading(true) };
}

export function useBuyersData(timeRange: TimeRange = 'month') {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const result = await DashboardAPI.getBuyersData(timeRange);
        setData(result);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [timeRange]);

  return { data, loading, error };
}

export function useClickCartData(timeRange: TimeRange = 'month') {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const result = await DashboardAPI.getClickCartData(timeRange);
        setData(result);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [timeRange]);

  return { data, loading, error };
}

export function useAvgStayTimeData(timeRange: TimeRange = 'month') {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const result = await DashboardAPI.getAvgStayTimeData(timeRange);
        setData(result);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [timeRange]);

  return { data, loading, error };
}

export function useCustomerAnalytics(timeRange: TimeRange = 'month') {
  const [data, setData] = useState<any>({ ageData: [], genderData: [], deviceData: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const result = await DashboardAPI.getCustomerAnalytics(timeRange);
        setData(result);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [timeRange]);

  return { data, loading, error };
}

// 성과 지표 대시보드용 훅들
export function useKPIData(timeRange: TimeRange = 'month') {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const result = await DashboardAPI.getKPIData(timeRange);
        setData(result);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [timeRange]);

  return { data, loading, error };
}

export function useSalesData(timeRange: TimeRange = 'month') {
  const [data, setData] = useState<any>({
    salesRevenue: [],
    totalPurchases: [],
    totalClicks: [],
    cartAdditions: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const result = await DashboardAPI.getSalesData(timeRange);
        setData(result);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [timeRange]);

  return { data, loading, error };
}

export function useConversionData(timeRange: TimeRange = 'month') {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const result = await DashboardAPI.getConversionData(timeRange);
        setData(result);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [timeRange]);

  return { data, loading, error };
}

// 주력 상품 분석용 훅들
export function useHotProductsData(timeRange: TimeRange = 'month') {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const result = await DashboardAPI.getHotProductsData(timeRange);
        setData(result);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [timeRange]);

  return { data, loading, error };
}

export function usePerformanceChartData(timeRange: TimeRange = 'month', chartType: ChartType = 'sales') {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const result = await DashboardAPI.getPerformanceChartData(timeRange, chartType);
        setData(result);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [timeRange, chartType]);

  return { data, loading, error };
}

// 고객 분석용 훅들
export function useLoyalCustomerKPI(timeRange: TimeRange = 'month') {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const result = await DashboardAPI.getLoyalCustomerKPI(timeRange);
        setData(result);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [timeRange]);

  return { data, loading, error };
}
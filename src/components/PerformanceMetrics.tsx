"use client";

import { useState, useMemo } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import { Calendar } from "./ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "./ui/popover";
import { CalendarIcon } from "lucide-react";
import { format, differenceInDays } from "date-fns";
import { ko } from "date-fns/locale";
import type { DateRange } from "react-day-picker";
import { toast } from "sonner";
import { 
  LineChart, 
  Line, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Legend
} from "recharts";
import { getPerformanceDataByProduct, mockTrafficSourceSankey } from "../data/mockData";
import { ResponsiveSankeyChart } from "./SankeyChart";

interface PerformanceMetricsProps {
  selectedProductId: string | null;
}

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white px-4 py-3 rounded-lg shadow-lg border border-gray-200">
        <p className="font-medium text-gray-900">{payload[0].payload.day || payload[0].payload.source}</p>
        {payload.map((entry: any, index: number) => (
          <p key={index} className="text-sm text-gray-600 mt-1">
            {entry.name}: <span className="font-semibold">{entry.value.toLocaleString()}</span>
          </p>
        ))}
      </div>
    );
  }
  return null;
};

export function PerformanceMetrics({ selectedProductId }: PerformanceMetricsProps) {
  // 기본값: 2025년 1월 1일 ~ 1월 7일 (mockData가 2025년 1월 데이터)
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: new Date(2025, 0, 1),
    to: new Date(2025, 0, 7),
  });
  const [isOpen, setIsOpen] = useState(false);

  // Get performance data for selected product
  const performanceData = getPerformanceDataByProduct(selectedProductId);

  // 날짜 범위에 맞는 데이터 필터링
  const filteredData = useMemo(() => {
    if (!performanceData || !dateRange?.from || !dateRange?.to) {
      return {
        buyers: performanceData?.weekly.buyers || [],
        clicks: performanceData?.weekly.clicks || [],
        trafficSources: performanceData?.trafficSources || [],
      };
    }

    const startDate = new Date(dateRange.from);
    startDate.setHours(0, 0, 0, 0);
    const endDate = new Date(dateRange.to);
    endDate.setHours(23, 59, 59, 999);

    // daily 데이터에서 날짜 범위에 맞는 데이터 필터링
    const dailyBuyers = performanceData.daily.buyers.filter((item) => {
      const itemDate = new Date(item.day);
      itemDate.setHours(0, 0, 0, 0);
      return itemDate >= startDate && itemDate <= endDate;
    });

    const dailyClicks = performanceData.daily.clicks.filter((item) => {
      const itemDate = new Date(item.day);
      itemDate.setHours(0, 0, 0, 0);
      return itemDate >= startDate && itemDate <= endDate;
    });

    // 날짜 형식을 "M월 d일"로 변환
    const buyers = dailyBuyers.map((item) => {
      const date = new Date(item.day);
      return {
        day: format(date, "M월 d일", { locale: ko }),
        count: item.count,
      };
    });

    const clicks = dailyClicks.map((item) => {
      const date = new Date(item.day);
      return {
        day: format(date, "M월 d일", { locale: ko }),
        clicks: item.clicks,
        cartAdds: item.cartAdds,
      };
    });

    return {
      buyers,
      clicks,
      trafficSources: performanceData.trafficSources,
    };
  }, [performanceData, dateRange]);

  if (!selectedProductId || !performanceData) {
    return (
      <Card className="bg-white border border-gray-200 shadow-sm p-12">
        <div className="text-center text-gray-500">
          <p className="text-lg">상품을 선택하면 성과 지표가 표시됩니다</p>
        </div>
      </Card>
    );
  }

  const buyersData = filteredData.buyers;
  const clicksData = filteredData.clicks;
  const trafficSourcesData = filteredData.trafficSources;

  return (
    <div className="space-y-8">
      {/* Date range selector */}
      <div className="flex flex-col items-center gap-6">
        <div>
          <h2 className="text-2xl font-semibold text-gray-900 text-center">성과 지표</h2>
          <p className="text-sm text-gray-500 text-center mt-1">날짜 범위를 선택하여 상품 성과를 확인하세요</p>
        </div>
        <Popover open={isOpen} onOpenChange={setIsOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className="w-[280px] justify-start text-left font-normal bg-white border-gray-200 hover:bg-gray-50"
              type="button"
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {dateRange?.from ? (
                dateRange.to ? (
                  <>
                    {format(dateRange.from, "yyyy년 M월 d일", { locale: ko })} -{" "}
                    {format(dateRange.to, "yyyy년 M월 d일", { locale: ko })}
                  </>
                ) : (
                  format(dateRange.from, "yyyy년 M월 d일", { locale: ko })
                )
              ) : (
                <span>날짜 범위 선택</span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent 
            className="w-auto p-4 z-[100] pointer-events-auto bg-white shadow-lg border border-gray-200 rounded-lg" 
            align="start"
            side="bottom"
            onOpenAutoFocus={(e) => e.preventDefault()}
            onPointerDownOutside={(e) => {
              const target = e.target as HTMLElement;
              // react-day-picker의 모든 요소는 클릭 허용
              if (target.closest('[class*="rdp"]') || 
                  target.closest('button') || 
                  target.closest('[role="gridcell"]') ||
                  target.closest('[role="grid"]')) {
                e.preventDefault();
              }
            }}
            onInteractOutside={(e) => {
              const target = e.target as HTMLElement;
              // react-day-picker의 모든 요소는 클릭 허용
              if (target.closest('[class*="rdp"]') || 
                  target.closest('button') || 
                  target.closest('[role="gridcell"]') ||
                  target.closest('[role="grid"]')) {
                e.preventDefault();
              }
            }}
          >
            <div className="flex flex-col gap-2">
              <Calendar
                mode="range"
                defaultMonth={dateRange?.from}
                selected={dateRange}
                onSelect={(range) => {
                  if (!range?.from) {
                    setDateRange(range);
                    return;
                  }

                  // 시작일만 선택된 경우
                  if (range.from && !range.to) {
                    setDateRange(range);
                    return;
                  }

                  // 시작일과 종료일이 모두 선택된 경우
                  if (range.from && range.to) {
                    const daysDiff = differenceInDays(range.to, range.from) + 1;
                    
                    if (daysDiff > 30) {
                      toast.error("최대 날짜 범위는 30일입니다.");
                      // 이전 선택 유지
                      return;
                    }
                    
                    setDateRange(range);
                    setIsOpen(false);
                  }
                }}
                numberOfMonths={2}
                className="rounded-lg"
              />
              <div className="text-xs text-gray-500 text-center mt-2">
                최대 30일까지 선택 가능합니다
              </div>
            </div>
          </PopoverContent>
        </Popover>
      </div>

      {/* Buyers count chart */}
      <Card className="bg-white border border-gray-200 shadow-sm p-8">
        <h3 className="text-xl font-semibold text-gray-900 mb-6">구매자 수</h3>
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={buyersData}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.06)" vertical={false} />
            <XAxis 
              dataKey="day"
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#6b7280', fontSize: 13 }}
            />
            <YAxis 
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#6b7280', fontSize: 13 }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Bar 
              dataKey="count" 
              fill="#10b981"
              radius={[6, 6, 0, 0]}
              name="구매자 수"
            />
          </BarChart>
        </ResponsiveContainer>
      </Card>

      {/* Clicks and cart additions chart */}
      <Card className="bg-white border border-gray-200 shadow-sm p-8">
        <h3 className="text-xl font-semibold text-gray-900 mb-6">클릭 수 & 장바구니 추가 수</h3>
        <ResponsiveContainer width="100%" height={400}>
          <LineChart data={clicksData}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.06)" vertical={false} />
            <XAxis 
              dataKey="day"
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#6b7280', fontSize: 13 }}
            />
            <YAxis 
              axisLine={false}
              tickLine={false}  
              tick={{ fill: '#6b7280', fontSize: 13 }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend 
              wrapperStyle={{ paddingTop: '20px' }}
              iconType="line"
            />
            <Line 
              type="monotone" 
              dataKey="clicks" 
              stroke="#10b981" 
              strokeWidth={3}
              dot={{ fill: "#10b981", strokeWidth: 2, r: 6 }}
              activeDot={{ r: 8 }}
              name="클릭 수"
            />
            <Line 
              type="monotone" 
              dataKey="cartAdds" 
              stroke="#6366f1" 
              strokeWidth={3}
              dot={{ fill: "#6366f1", strokeWidth: 2, r: 6 }}
              activeDot={{ r: 8 }}
              name="장바구니 추가"
            />
          </LineChart>
        </ResponsiveContainer>
      </Card>

      {/* Traffic sources */}
      <Card className="bg-white border border-gray-200 shadow-sm p-8">
        <h3 className="text-xl font-semibold text-gray-900 mb-6">유입 주요 매체</h3>
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={trafficSourcesData}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.06)" vertical={false} />
            <XAxis 
              type="category"
              dataKey="source"
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#6b7280', fontSize: 13 }}
            />
            <YAxis 
              type="number"
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#6b7280', fontSize: 13 }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Bar 
              dataKey="count" 
              fill="#10b981"
              radius={[6, 6, 0, 0]}
              name="유입 수"
            />
          </BarChart>
        </ResponsiveContainer>
      </Card>

      {/* Customer flow summary */}
      <Card className="bg-white border border-gray-200 shadow-sm">
        <CardHeader>
            <CardTitle>고객 흐름 요약도</CardTitle>
          <p className="text-sm text-gray-500 mt-1">상품 분석 대시보드 이용 고객의 매체별 유입 경로</p>
        </CardHeader>
        <CardContent className="p-6">
          <div className="w-full" style={{ minHeight: '500px' }}>
            <ResponsiveSankeyChart data={mockTrafficSourceSankey} />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
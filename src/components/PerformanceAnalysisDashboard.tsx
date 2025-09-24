import { useState } from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, TrendingUp, DollarSign, Users, ShoppingCart, MousePointer, Activity } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip, LineChart, Line, ComposedChart, Area, AreaChart } from 'recharts';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { useRouter } from './Router';
import { useKPIData, useSalesData, useConversionData } from '../hooks/useDashboardData';
import { LoadingSpinner, ErrorMessage } from './ui/loading-spinner';
import { TimeRange } from '../services/api';

export function PerformanceAnalysisDashboard() {
  const { navigate } = useRouter();
  const [selectedTab, setSelectedTab] = useState<TimeRange>('month');

  // API 훅들 사용
  const { data: kpiData, loading: kpiLoading, error: kpiError } = useKPIData(selectedTab);
  const { data: salesData, loading: salesLoading, error: salesError } = useSalesData(selectedTab);
  const { data: conversionData, loading: conversionLoading, error: conversionError } = useConversionData(selectedTab);

  const handleBackClick = () => {
    navigate('/');
  };

  // 탭 변경 핸들러
  const handleTabChange = (value: string) => {
    setSelectedTab(value as TimeRange);
  };

  // 로딩 상태 확인
  const isLoading = kpiLoading || salesLoading || conversionLoading;
  const hasError = kpiError || salesError || conversionError;

  if (hasError) {
    return <ErrorMessage message={hasError} />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <motion.header
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="bg-white border-b border-gray-200 px-8 py-6"
      >
        <div className="flex items-center justify-between">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleBackClick}
            className="flex items-center space-x-2"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>돌아가기</span>
          </Button>
          
          <motion.h1 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-2xl font-bold text-gray-900"
          >
            성과 지표 분석
          </motion.h1>
          
          <div></div>
        </div>
      </motion.header>

      <div className="p-8 space-y-8">
        {/* 상단 탭 */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex justify-center"
        >
          <Tabs value={selectedTab} onValueChange={handleTabChange}>
            <TabsList className="grid w-fit grid-cols-3">
              <TabsTrigger value="yesterday">어제</TabsTrigger>
              <TabsTrigger value="week">이번주</TabsTrigger>
              <TabsTrigger value="month">이번달</TabsTrigger>
            </TabsList>
          </Tabs>
        </motion.section>

        {isLoading ? (
          <LoadingSpinner />
        ) : (
          <>
            {/* 핵심 KPI */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <h2 className="text-xl font-semibold text-gray-900 mb-6 text-center">핵심 KPI</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {kpiData.map((kpi: any, index: number) => {
                  const IconComponent = kpi.icon === 'DollarSign' ? DollarSign : 
                                      kpi.icon === 'ShoppingCart' ? ShoppingCart :
                                      kpi.icon === 'Users' ? Users : Activity;
                  
                  return (
                    <motion.div
                      key={kpi.title}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: 0.4 + index * 0.1 }}
                    >
                      <Card className="p-6 hover:shadow-lg transition-shadow">
                        <div className="flex items-center justify-between mb-4">
                          <IconComponent className={`w-8 h-8 ${kpi.color}`} />
                          <span className={`text-sm font-medium ${
                            kpi.changeType === 'positive' ? 'text-green-600' : 'text-red-600'
                          }`}>
                            {kpi.change}
                          </span>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-600 mb-2">{kpi.title}</p>
                          <p className="text-2xl font-bold text-gray-900">{kpi.value}</p>
                        </div>
                      </Card>
                    </motion.div>
                  );
                })}
              </div>
            </motion.section>

            {/* 판매 정보 */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
            >
              <h2 className="text-xl font-semibold text-gray-900 mb-8 text-center">판매 정보</h2>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                {/* 총 매출액 */}
                <Card className="p-6">
                  <h3 className="text-sm font-medium text-gray-700 mb-4">총 매출액</h3>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={salesData.salesRevenue}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                        <XAxis dataKey="period" stroke="#6b7280" fontSize={12} />
                        <YAxis stroke="#6b7280" fontSize={12} />
                        <Tooltip 
                          contentStyle={{ 
                            backgroundColor: 'white', 
                            border: '1px solid #e5e7eb', 
                            borderRadius: '8px'
                          }}
                          formatter={(value) => [`₩${(value as number).toLocaleString()}`, '매출액']}
                        />
                        <Bar dataKey="value" fill="#9CA3AF" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </Card>

                {/* 총 구매 수 */}
                <Card className="p-6">
                  <h3 className="text-sm font-medium text-gray-700 mb-4">총 구매 수</h3>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={salesData.totalPurchases}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                        <XAxis dataKey="period" stroke="#6b7280" fontSize={12} />
                        <YAxis stroke="#6b7280" fontSize={12} />
                        <Tooltip 
                          contentStyle={{ 
                            backgroundColor: 'white', 
                            border: '1px solid #e5e7eb', 
                            borderRadius: '8px'
                          }}
                          formatter={(value) => [`${value}개`, '구매 수']}
                        />
                        <Bar dataKey="value" fill="#9CA3AF" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </Card>

                {/* 총 클릭 수 */}
                <Card className="p-6">
                  <h3 className="text-sm font-medium text-gray-700 mb-4">총 클릭 수</h3>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={salesData.totalClicks}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                        <XAxis dataKey="period" stroke="#6b7280" fontSize={12} />
                        <YAxis stroke="#6b7280" fontSize={12} />
                        <Tooltip 
                          contentStyle={{ 
                            backgroundColor: 'white', 
                            border: '1px solid #e5e7eb', 
                            borderRadius: '8px'
                          }}
                          formatter={(value) => [`${(value as number).toLocaleString()}회`, '클릭 수']}
                        />
                        <Bar dataKey="value" fill="#9CA3AF" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </Card>

                {/* 장바구니 추가 수 */}
                <Card className="p-6">
                  <h3 className="text-sm font-medium text-gray-700 mb-4">장바구니 추가 수</h3>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={salesData.cartAdditions}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                        <XAxis dataKey="period" stroke="#6b7280" fontSize={12} />
                        <YAxis stroke="#6b7280" fontSize={12} />
                        <Tooltip 
                          contentStyle={{ 
                            backgroundColor: 'white', 
                            border: '1px solid #e5e7eb', 
                            borderRadius: '8px'
                          }}
                          formatter={(value) => [`${(value as number).toLocaleString()}개`, '장바구니 추가']}
                        />
                        <Bar dataKey="value" fill="#9CA3AF" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </Card>
              </div>
            </motion.section>

            {/* 장바구니 전환율 분석 */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="space-y-8"
            >
              <h2 className="text-xl font-semibold text-gray-900 text-center">장바구니 전환율 분석</h2>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* 장바구니 전환율 트렌드 */}
                <Card className="p-6">
                  <h3 className="text-sm font-medium text-gray-700 mb-4">장바구니 전환율 트렌드</h3>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <ComposedChart data={conversionData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                        <XAxis dataKey="period" stroke="#6b7280" fontSize={12} />
                        <YAxis yAxisId="left" stroke="#6b7280" fontSize={12} />
                        <YAxis yAxisId="right" orientation="right" stroke="#6b7280" fontSize={12} />
                        <Tooltip 
                          contentStyle={{ 
                            backgroundColor: 'white', 
                            border: '1px solid #e5e7eb', 
                            borderRadius: '8px'
                          }}
                        />
                        <Bar yAxisId="left" dataKey="cartAdds" fill="#A78BFA" name="장바구니 추가" />
                        <Bar yAxisId="left" dataKey="purchases" fill="#7C3AED" name="구매" />
                        <Line 
                          yAxisId="right" 
                          type="monotone" 
                          dataKey="conversionRate" 
                          stroke="#F59E0B" 
                          strokeWidth={3}
                          name="전환율 (%)"
                          dot={{ r: 4 }}
                        />
                      </ComposedChart>
                    </ResponsiveContainer>
                  </div>
                </Card>

                {/* 상세 전환 분석 */}
                <Card className="p-6">
                  <h3 className="text-sm font-medium text-gray-700 mb-4">상세 전환 분석</h3>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={conversionData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                        <XAxis dataKey="period" stroke="#6b7280" fontSize={12} />
                        <YAxis stroke="#6b7280" fontSize={12} />
                        <Tooltip 
                          contentStyle={{ 
                            backgroundColor: 'white', 
                            border: '1px solid #e5e7eb', 
                            borderRadius: '8px'
                          }}
                        />
                        <Area 
                          type="monotone" 
                          dataKey="clicks" 
                          stackId="1" 
                          stroke="#E5E7EB" 
                          fill="#F3F4F6" 
                          name="클릭"
                        />
                        <Area 
                          type="monotone" 
                          dataKey="cartAdds" 
                          stackId="1" 
                          stroke="#A78BFA" 
                          fill="#C4B5FD" 
                          name="장바구니 추가"
                        />
                        <Area 
                          type="monotone" 
                          dataKey="purchases" 
                          stackId="1" 
                          stroke="#7C3AED" 
                          fill="#A78BFA" 
                          name="구매"
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </Card>
              </div>

              {/* 전환율 요약 테이블 */}
              <Card className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">전환율 요약</h3>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">기간</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">총 클릭</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">장바구니 추가</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">구매</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">장바구니→구매 전환율</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">전체 전환율</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {conversionData.map((item: any, index: number) => (
                        <tr key={index} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{item.period}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.clicks?.toLocaleString() || 'N/A'}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.cartAdds.toLocaleString()}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.purchases.toLocaleString()}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-green-600">
                            {((item.purchases / item.cartAdds) * 100).toFixed(1)}%
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-600">
                            {item.clicks ? ((item.purchases / item.clicks) * 100).toFixed(1) : 'N/A'}%
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Card>
            </motion.section>
          </>
        )}
      </div>
    </div>
  );
}
import { useState } from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, Users, DollarSign, Repeat, Crown, Clock, TrendingUp } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip, LineChart, Line, PieChart, Pie, Cell, AreaChart, Area } from 'recharts';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { useRouter } from './Router';
import { useLoyalCustomerKPI } from '../hooks/useDashboardData';
import { LoadingSpinner, ErrorMessage } from './ui/loading-spinner';
import { TimeRange } from '../services/api';

export function CustomerAnalysisDashboard() {
  const { navigate } = useRouter();
  const [selectedTab, setSelectedTab] = useState<TimeRange>('month');

  // API 훅들 사용
  const { data: loyalCustomerKPI, loading: kpiLoading, error: kpiError } = useLoyalCustomerKPI(selectedTab);

  const handleBackClick = () => {
    navigate('/');
  };

  const handleTabChange = (value: string) => {
    setSelectedTab(value as TimeRange);
  };

  // VIP 고객 주요 통계 (동적 계산)
  const vipStats = [
    {
      icon: '👤',
      title: '충성고객 수',
      mainValue: loyalCustomerKPI.find((kpi: any) => kpi.title.includes('VIP 고객수'))?.value || 'N/A',
      subValue: '총 매출액',
      bgColor: 'rgba(0,0,0,0.05)'
    },
    {
      icon: '💰',
      title: '총 매출액',
      mainValue: loyalCustomerKPI.find((kpi: any) => kpi.title.includes('평균 LTV'))?.value || 'N/A',
      subValue: '5회',
      bgColor: 'rgba(0,0,0,0.05)'
    },
    {
      icon: '⏳',
      title: '평균 재구매 기간',
      mainValue: loyalCustomerKPI.find((kpi: any) => kpi.title.includes('평균 구매 간격'))?.value || 'N/A',
      subValue: '10/10/2023',
      bgColor: 'rgba(0,0,0,0.05)'
    }
  ];

  // Mock 차트 데이터들 (시간 범위에 따라 동적으로 조정)
  const getRepurchaseTimeData = () => {
    const baseData = [
      { time: '1-7일', count: 45 },
      { time: '8-14일', count: 32 },
      { time: '15-21일', count: 28 },
      { time: '22-28일', count: 35 },
      { time: '29-35일', count: 42 },
      { time: '36-42일', count: 38 },
      { time: '43일+', count: 25 }
    ];

    const multiplier = selectedTab === 'yesterday' ? 0.05 : selectedTab === 'week' ? 0.3 : 1;
    return baseData.map(item => ({
      ...item,
      count: Math.round(item.count * multiplier)
    }));
  };

  const deviceData = [
    { name: 'Mobile', value: 45, color: 'rgba(0,0,0,0.5)' },
    { name: 'PC', value: 35, color: 'rgba(0,0,0,0.3)' },
    { name: 'Tablet', value: 20, color: 'rgba(0,0,0,0.1)' }
  ];

  const categoryData = [
    { category: '상의', value: 310, color: '#03045e' },
    { category: '하의', value: 280, color: '#023e8a' },
    { category: '아우터', value: 251, color: '#0077b6' },
    { category: '신발', value: 224, color: '#0096c7' },
    { category: '가방', value: 195, color: '#00b4d8' },
    { category: '액세서리', value: 187, color: '#48cae4' },
    { category: '언더웨어', value: 133, color: '#8aebff' },
    { category: '기타', value: 101, color: '#caf0f8' }
  ];

  const accessPageData = [
    { page: '메인 페이지', value: 310, color: '#03045e' },
    { page: '상품 상세', value: 280, color: '#023e8a' },
    { page: '카테고리', value: 251, color: '#0077b6' },
    { page: '장바구니', value: 224, color: '#0096c7' },
    { page: '마이페이지', value: 195, color: '#00b4d8' },
    { page: '이벤트', value: 187, color: '#48cae4' },
    { page: '리뷰', value: 133, color: '#8aebff' },
    { page: '기타', value: 101, color: '#caf0f8' }
  ];

  const getLoyaltyFlowData = () => {
    const baseData = [
      { period: '1월', repurchaseRate: 25.2, avgLTV: 750000, vipContribution: 60 },
      { period: '2월', repurchaseRate: 26.1, avgLTV: 765000, vipContribution: 62 },
      { period: '3월', repurchaseRate: 24.8, avgLTV: 720000, vipContribution: 58 },
      { period: '4월', repurchaseRate: 27.3, avgLTV: 780000, vipContribution: 63 },
      { period: '5월', repurchaseRate: 28.1, avgLTV: 810000, vipContribution: 64 },
      { period: '6월', repurchaseRate: 28.5, avgLTV: 820000, vipContribution: 65 },
      { period: '7월', repurchaseRate: 29.2, avgLTV: 840000, vipContribution: 67 }
    ];

    if (selectedTab === 'yesterday') {
      return [{ period: '어제', repurchaseRate: 29.5, avgLTV: 850000, vipContribution: 68 }];
    } else if (selectedTab === 'week') {
      return [
        { period: '월', repurchaseRate: 28.5, avgLTV: 820000, vipContribution: 65 },
        { period: '화', repurchaseRate: 29.1, avgLTV: 830000, vipContribution: 66 },
        { period: '수', repurchaseRate: 28.8, avgLTV: 825000, vipContribution: 65 },
        { period: '목', repurchaseRate: 29.4, avgLTV: 840000, vipContribution: 67 },
        { period: '금', repurchaseRate: 30.2, avgLTV: 860000, vipContribution: 69 },
        { period: '토', repurchaseRate: 27.9, avgLTV: 800000, vipContribution: 63 },
        { period: '일', repurchaseRate: 26.5, avgLTV: 780000, vipContribution: 61 }
      ];
    }

    return baseData;
  };

  // 로딩 상태 확인
  const isLoading = kpiLoading;
  const hasError = kpiError;

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
            주요 고객 집중 분석
          </motion.h1>
          
          <div></div>
        </div>
      </motion.header>

      <div className="p-8 space-y-12">
        {isLoading ? (
          <LoadingSpinner />
        ) : (
          <>
            {/* 충성 고객 분석 */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-center space-y-6"
            >
              <h2 className="text-4xl font-bold text-gray-900">충성 고객 분석</h2>
              
              <Tabs value={selectedTab} onValueChange={handleTabChange}>
                <TabsList className="grid w-fit grid-cols-3 mx-auto">
                  <TabsTrigger value="yesterday">어제</TabsTrigger>
                  <TabsTrigger value="week">이번주</TabsTrigger>
                  <TabsTrigger value="month">이번달</TabsTrigger>
                </TabsList>
              </Tabs>
            </motion.section>

            {/* 충성고객 KPI */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="space-y-8"
            >
              <h2 className="text-4xl font-bold text-gray-900 text-center">충성고객 KPI</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
                {loyalCustomerKPI.map((kpi: any, index: number) => (
                  <motion.div
                    key={kpi.title}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.4 + index * 0.1 }}
                  >
                    <Card className="p-4 hover:shadow-lg transition-shadow h-[124px]">
                      <div className="space-y-1">
                        <p className="text-sm text-gray-500">{kpi.title}</p>
                        <p className="text-2xl font-medium text-gray-900">{kpi.value}</p>
                        {kpi.change && (
                          <p className={`text-sm ${
                            kpi.changeType === 'positive' ? 'text-green-600' : 'text-red-600'
                          }`}>
                            {kpi.change}
                          </p>
                        )}
                      </div>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </motion.section>

            {/* VIP 고객 주요 통계 */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="space-y-8"
            >
              <h2 className="text-4xl font-bold text-gray-900 text-center">VIP 고객 주요 통계</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                {vipStats.map((stat, index) => (
                  <motion.div
                    key={stat.title}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.6 + index * 0.1 }}
                    className="text-center space-y-5"
                  >
                    <div 
                      className="w-[100px] h-[100px] rounded-full mx-auto flex items-center justify-center text-5xl"
                      style={{ backgroundColor: stat.bgColor }}
                    >
                      {stat.icon}
                    </div>
                    <div className="space-y-2">
                      <p className="text-xl text-gray-900">{stat.mainValue}</p>
                      <p className="text-base text-gray-500">{stat.subValue}</p>
                    </div>
                    <h3 className="text-2xl font-medium text-gray-900">{stat.title}</h3>
                  </motion.div>
                ))}
              </div>
            </motion.section>

            {/* 분석 차트 */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.7 }}
              className="space-y-8"
            >
              <h2 className="text-4xl font-bold text-gray-900 text-center">분석 차트</h2>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 mb-10">
                {/* 재��매 시간 분석 */}
                <Card className="p-6">
                  <div className="space-y-3 mb-6">
                    <h3 className="text-xl font-medium text-gray-900">재구매 시간 대</h3>
                    <p className="text-base text-gray-500">수</p>
                  </div>
                  <div className="h-[280px] mb-4">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={getRepurchaseTimeData()}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                        <XAxis dataKey="time" stroke="#6b7280" fontSize={12} />
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
                          dataKey="count" 
                          stroke="rgba(0,0,0,0.8)" 
                          fill="url(#gradient)" 
                          strokeWidth={2}
                        />
                        <defs>
                          <linearGradient id="gradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="rgba(0,0,0,0.2)" />
                            <stop offset="95%" stopColor="rgba(0,0,0,0)" />
                          </linearGradient>
                        </defs>
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                  <p className="text-base text-gray-500 text-right">시간???</p>
                </Card>

                {/* 주요 접속 디바이스 */}
                <Card className="p-6">
                  <div className="space-y-3 mb-6">
                    <h3 className="text-xl font-medium text-gray-900">주요 접속 디바이스</h3>
                    <p className="text-base text-gray-500">???</p>
                  </div>
                  <div className="h-[280px] mb-4">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={deviceData}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={120}
                          paddingAngle={2}
                          dataKey="value"
                        >
                          {deviceData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip formatter={(value) => [`${value}%`, '비율']} />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  <p className="text-base text-gray-500 text-right">비율???</p>
                </Card>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                {/* 충성고객 선호 카테고리 */}
                <Card className="p-6">
                  <div className="space-y-3 mb-6">
                    <div className="flex justify-between items-center">
                      <h3 className="text-base font-normal text-gray-900">충성고객 선호 카테고리</h3>
                      <p className="text-base text-gray-400">8개 카테고리</p>
                    </div>
                  </div>
                  <div className="space-y-0">
                    {categoryData.map((item, index) => (
                      <div
                        key={item.category}
                        className="flex items-center py-2.5 px-4 text-white text-base font-medium"
                        style={{
                          backgroundColor: item.color,
                          width: `${(item.value / 310) * 100}%`,
                          borderRadius: index === 0 ? '6px 6px 0 0' : index === categoryData.length - 1 ? '0 0 6px 6px' : '0 6px 6px 0'
                        }}
                      >
                        {item.category}
                      </div>
                    ))}
                  </div>
                </Card>

                {/* 충성고객 주요 접속 페이지 */}
                <Card className="p-6">
                  <div className="space-y-3 mb-6">
                    <h3 className="text-xl font-medium text-gray-900">충성고객 주요 접속 페이지</h3>
                    <p className="text-base text-gray-500">매출 비율(%)</p>
                  </div>
                  <div className="space-y-0">
                    {accessPageData.map((item, index) => (
                      <div
                        key={item.page}
                        className="flex items-center py-2.5 px-4 text-white text-base font-medium"
                        style={{
                          backgroundColor: item.color,
                          width: `${(item.value / 310) * 100}%`,
                          borderRadius: index === 0 ? '6px 6px 0 0' : index === accessPageData.length - 1 ? '0 0 6px 6px' : '0 6px 6px 0'
                        }}
                      >
                        {item.page}
                      </div>
                    ))}
                  </div>
                </Card>
              </div>
            </motion.section>

            {/* 충성도 흐름 */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.8 }}
              className="space-y-8"
            >
              <h2 className="text-4xl font-bold text-gray-900 text-center">충성도 흐름</h2>
              
              <Card className="p-6">
                <div className="space-y-3 mb-6">
                  <h3 className="text-xl font-medium text-gray-900">충성 고객 유지</h3>
                  <p className="text-base text-gray-500">재구매율, 평균 LTV, VIP 매출 기여도</p>
                </div>
                <div className="h-[280px] mb-4">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={getLoyaltyFlowData()}>
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
                        dataKey="repurchaseRate" 
                        stroke="rgba(0,0,0,0.8)" 
                        fill="url(#loyaltyGradient)" 
                        strokeWidth={2}
                      />
                      <defs>
                        <linearGradient id="loyaltyGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="rgba(0,0,0,0.2)" />
                          <stop offset="95%" stopColor="rgba(0,0,0,0)" />
                        </linearGradient>
                      </defs>
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
                <p className="text-base text-gray-500 text-right">???</p>
              </Card>
            </motion.section>
          </>
        )}
      </div>
    </div>
  );
}
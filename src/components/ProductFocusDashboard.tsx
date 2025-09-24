import { useState } from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, Package, TrendingUp, Users, Clock, DollarSign } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip, LineChart, Line, PieChart, Pie, Cell, ComposedChart } from 'recharts';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { useRouter } from './Router';
import { useHotProductsData, usePerformanceChartData } from '../hooks/useDashboardData';
import { LoadingSpinner, ErrorMessage } from './ui/loading-spinner';
import { TimeRange, ChartType } from '../services/api';

export function ProductFocusDashboard() {
  const { navigate } = useRouter();
  const [selectedTab, setSelectedTab] = useState<ChartType>('sales');
  const [timeRange, setTimeRange] = useState<TimeRange>('month');

  // API 훅들 사용
  const { data: hotProductsData, loading: hotProductsLoading, error: hotProductsError } = useHotProductsData(timeRange);
  const { data: performanceChartData, loading: chartLoading, error: chartError } = usePerformanceChartData(timeRange, selectedTab);

  const handleBackClick = () => {
    navigate('/');
  };

  // 핵심 KPI 계산 (HOT 상품 데이터 기반)
  const kpiData = [
    {
      title: '총 판매량',
      value: hotProductsData.reduce((sum: number, product: any) => sum + product.sales, 0).toLocaleString(),
      unit: '개',
      icon: Package,
      color: 'text-blue-600'
    },
    {
      title: '총 매출',
      value: `₩${(hotProductsData.reduce((sum: number, product: any) => sum + parseFloat(product.revenue.replace(/[₩,]/g, '')), 0)).toLocaleString()}`,
      unit: '원',
      icon: DollarSign,
      color: 'text-green-600'
    },
    {
      title: '평균 체류시간',
      value: '2분 45초',
      unit: '',
      icon: Clock,
      color: 'text-purple-600'
    },
    {
      title: '평균 전환율',
      value: (hotProductsData.reduce((sum: number, product: any) => sum + parseFloat(product.conversionRate.replace('%', '')), 0) / hotProductsData.length).toFixed(1),
      unit: '%',
      icon: TrendingUp,
      color: 'text-orange-600'
    }
  ];

  // 파이차트 데이터 (동적으로 생성)
  const categoryData = hotProductsData.slice(0, 4).map((product: any, index: number) => ({
    name: product.name,
    value: Math.round((product.sales / hotProductsData.reduce((sum: number, p: any) => sum + p.sales, 0)) * 100),
    color: ['#7C3AED', '#A78BFA', '#C4B5FD', '#E5E7EB'][index] || '#E5E7EB'
  }));

  const channelData = [
    { name: '온라인', value: 60, color: '#7C3AED' },
    { name: '오프라인', value: 25, color: '#A78BFA' },
    { name: '기타', value: 15, color: '#E5E7EB' }
  ];

  // 로딩 상태 확인
  const isLoading = hotProductsLoading || chartLoading;
  const hasError = hotProductsError || chartError;

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
            주력 상품 집중 분석
          </motion.h1>
          
          <div></div>
        </div>
      </motion.header>

      <div className="p-8 space-y-8">
        {isLoading ? (
          <LoadingSpinner />
        ) : (
          <>
            {/* 시간 범위 선택 */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="flex justify-center"
            >
              <div className="flex space-x-4">
                {[
                  { key: 'yesterday', label: '어제' },
                  { key: 'week', label: '이번주' },
                  { key: 'month', label: '이번달' }
                ].map(range => (
                  <button
                    key={range.key}
                    onClick={() => setTimeRange(range.key as TimeRange)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      timeRange === range.key
                        ? 'bg-blue-100 text-blue-700'
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    {range.label}
                  </button>
                ))}
              </div>
            </motion.section>

            {/* 핵심 KPI */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <h2 className="text-xl font-semibold text-gray-900 mb-6">핵심 KPI</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {kpiData.map((kpi, index) => (
                  <motion.div
                    key={kpi.title}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.3 + index * 0.1 }}
                  >
                    <Card className="p-6 hover:shadow-lg transition-shadow">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-gray-600 mb-2">{kpi.title}</p>
                          <div className="flex items-baseline space-x-2">
                            <span className="text-2xl font-bold text-gray-900">{kpi.value}</span>
                            {kpi.unit && <span className="text-sm text-gray-500">{kpi.unit}</span>}
                          </div>
                        </div>
                        <kpi.icon className={`w-8 h-8 ${kpi.color}`} />
                      </div>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </motion.section>

            {/* HOT 상품별 데이터 */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
            >
              <h2 className="text-xl font-semibold text-gray-900 mb-6">HOT 상품별 데이터</h2>
              
              <div className="space-y-4">
                {hotProductsData.map((product: any, index: number) => (
                  <motion.div
                    key={product.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4, delay: 0.5 + index * 0.1 }}
                    className="flex items-center justify-between p-4 rounded-lg border border-gray-100 hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center">
                        <span className="text-white font-semibold">{product.id || (index + 1)}</span>
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-900">{product.name}</h3>
                        <p className="text-sm text-gray-500">클릭수: {product.clicks?.toLocaleString() || 'N/A'}</p>
                      </div>
                    </div>
                    
                    <div className="text-right space-y-1">
                      <div className="text-sm font-medium text-gray-900">판매량: {product.sales?.toLocaleString() || 'N/A'}개</div>
                      <div className="text-sm text-gray-500">매출: {product.revenue || 'N/A'}</div>
                      <div className="text-sm text-green-600">전환율: {product.conversionRate || 'N/A'}</div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.section>

            {/* 상품별 성과 분석 차트 */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
            >
              <h2 className="text-xl font-semibold text-gray-900 mb-6">상품별 성과 분석 차트</h2>
              
              {/* 탭 버튼들 */}
              <div className="flex space-x-4 mb-6">
                {[
                  { key: 'sales', label: '판매량' },
                  { key: 'revenue', label: '매출액' },
                  { key: 'clicks', label: '클릭수' }
                ].map(tab => (
                  <button
                    key={tab.key}
                    onClick={() => setSelectedTab(tab.key as ChartType)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      selectedTab === tab.key
                        ? 'bg-blue-100 text-blue-700'
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={performanceChartData}>
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
                    <Bar 
                      dataKey="value" 
                      fill="#7C3AED" 
                      radius={[4, 4, 0, 0]} 
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </motion.section>

            {/* 파이차트들 */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* 카테고리별 분포 */}
              <motion.section
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.7 }}
                className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
              >
                <h3 className="text-lg font-semibold text-gray-900 mb-6">카테고리별 분포</h3>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={categoryData}
                        cx="50%"
                        cy="50%"
                        innerRadius={40}
                        outerRadius={80}
                        paddingAngle={2}
                        dataKey="value"
                      >
                        {categoryData.map((entry: any, index: number) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => [`${value}%`, '비율']} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                
                {/* 범례 */}
                <div className="mt-4 space-y-2">
                  {categoryData.map((item: any, index: number) => (
                    <div key={index} className="flex items-center justify-between text-sm">
                      <div className="flex items-center space-x-2">
                        <div 
                          className="w-3 h-3 rounded-full" 
                          style={{ backgroundColor: item.color }}
                        ></div>
                        <span className="text-gray-600">{item.name}</span>
                      </div>
                      <span className="font-medium text-gray-900">{item.value}%</span>
                    </div>
                  ))}
                </div>
              </motion.section>

              {/* 채널별 분포 */}
              <motion.section
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.8 }}
                className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
              >
                <h3 className="text-lg font-semibold text-gray-900 mb-6">채널별 분포</h3>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={channelData}
                        cx="50%"
                        cy="50%"
                        innerRadius={40}
                        outerRadius={80}
                        paddingAngle={2}
                        dataKey="value"
                      >
                        {channelData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => [`${value}%`, '비율']} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                
                {/* 범례 */}
                <div className="mt-4 space-y-2">
                  {channelData.map((item, index) => (
                    <div key={index} className="flex items-center justify-between text-sm">
                      <div className="flex items-center space-x-2">
                        <div 
                          className="w-3 h-3 rounded-full" 
                          style={{ backgroundColor: item.color }}
                        ></div>
                        <span className="text-gray-600">{item.name}</span>
                      </div>
                      <span className="font-medium text-gray-900">{item.value}%</span>
                    </div>
                  ))}
                </div>
              </motion.section>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
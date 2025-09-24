import React, { useState, useCallback, useEffect } from 'react';
import { Package, ArrowDown, MoreHorizontal } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { Button } from './ui/button';
import { Tabs, TabsList, TabsTrigger } from './ui/tabs';
import { Card } from './ui/card';
import { useProductList, useBuyersData, useClickCartData, useAvgStayTimeData, useCustomerAnalytics } from '../hooks/useDashboardData';
import { LoadingSpinner, ErrorMessage } from './ui/loading-spinner';
import { TimeRange } from '../services/api';

export function MainProductAnalysisDashboard() {
  const [selectedTab, setSelectedTab] = useState<TimeRange>('month');
  const [selectedProduct, setSelectedProduct] = useState<any>(null);

  // API 훅들 사용
  const { data: productData, loading: productLoading, error: productError } = useProductList(selectedTab);
  const { data: buyersData, loading: buyersLoading, error: buyersError } = useBuyersData(selectedTab);
  const { data: clicksCartData, loading: clicksLoading, error: clicksError } = useClickCartData(selectedTab);
  const { data: stayTimeData, loading: stayTimeLoading, error: stayTimeError } = useAvgStayTimeData(selectedTab);
  const { data: customerData, loading: customerLoading, error: customerError } = useCustomerAnalytics(selectedTab);

  // 상품 데이터
  const [products, setProducts] = useState<any[]>([]);

  // 제품 데이터가 변경될 때 로컬 상태 업데이트
  useEffect(() => {
    if (productData && productData.length > 0) {
      setProducts(productData);
    }
  }, [productData]);

  const handleTabChange = (value: string) => {
    setSelectedTab(value as TimeRange);
  };

  const handleProductClick = (product: any) => {
    setSelectedProduct(selectedProduct?.id === product.id ? null : product);
  };

  // 로딩 상태 확인
  const isLoading = productLoading || buyersLoading || clicksLoading || stayTimeLoading || customerLoading;
  const hasError = productError || buyersError || clicksError || stayTimeError || customerError;

  if (hasError) {
    return <ErrorMessage message={hasError} />;
  }

  // 성별, 디바이스 데이터 색상 추가
  const genderData = customerData.genderData?.map((item: any, index: number) => ({
    ...item,
    name: item.ageGroup,
    value: item.percentage || Math.round((item.count / customerData.genderData.reduce((sum: number, g: any) => sum + g.count, 0)) * 100),
    color: index === 0 ? '#7857FF' : index === 1 ? '#D7D7D7' : '#EDEDED'
  })) || [];

  const deviceData = customerData.deviceData?.map((item: any, index: number) => ({
    ...item,
    name: item.ageGroup,
    value: item.percentage || Math.round((item.count / customerData.deviceData.reduce((sum: number, d: any) => sum + d.count, 0)) * 100),
    color: index === 0 ? '#7857FF' : index === 1 ? '#D7D7D7' : '#EDEDED'
  })) || [];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-8 py-6">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-2xl font-bold text-gray-900 text-center">
            주요 상품 분석 대시보드
          </h1>
          
          {/* 시간 범위 탭을 헤더로 이동 */}
          <div className="flex justify-center mt-6">
            <Tabs value={selectedTab} onValueChange={handleTabChange}>
              <TabsList className="grid w-fit grid-cols-3">
                <TabsTrigger value="yesterday">어제</TabsTrigger>
                <TabsTrigger value="week">이번주</TabsTrigger>
                <TabsTrigger value="month">이번달</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto p-8 space-y-8">
        {isLoading ? (
          <LoadingSpinner />
        ) : (
          <>
            {/* 상품 리스트 */}
            <section className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-gray-900 flex items-center">
                    <Package className="w-5 h-5 mr-2 text-blue-600" />
                    상품 리스트
                  </h2>
                  <div className="text-sm text-gray-500">
                    Top 5 상품
                  </div>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-16">
                        순위
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        <div className="flex items-center space-x-1">
                          <span>상품명</span>
                          <ArrowDown className="w-4 h-4" />
                        </div>
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">카테고리</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">판매량</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">클릭수</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">매출액</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">전환율</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">작업</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {products.slice(0, 5).map((product: any, index: number) => (
                      <React.Fragment key={product.id}>
                        <tr
                          className={`hover:bg-gray-50 transition-colors cursor-pointer ${
                            selectedProduct?.id === product.id ? 'bg-blue-50' : ''
                          }`}
                          onClick={() => handleProductClick(product)}
                        >
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold text-white ${
                              index === 0 ? 'bg-yellow-500' : // 1등 - 금메달
                              index === 1 ? 'bg-gray-400' : // 2등 - 은메달
                              index === 2 ? 'bg-orange-600' : // 3등 - 동메달
                              'bg-blue-500' // 4-5등 - 파란색
                            }`}>
                              {index + 1}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">{product.name}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {product.category}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {product.sales?.toLocaleString() || 'N/A'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {product.clicks?.toLocaleString() || 'N/A'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {product.revenue || 'N/A'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {product.conversionRate || 'N/A'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            <Button variant="ghost" size="sm" onClick={(e) => e.stopPropagation()}>
                              <MoreHorizontal className="w-4 h-4" />
                            </Button>
                          </td>
                        </tr>
                        
                        {/* 선택된 상품의 상세 정보 */}
                        {selectedProduct?.id === product.id && (
                          <tr className="bg-blue-50">
                            <td colSpan={8} className="px-6 py-6">
                              <div className="bg-white rounded-lg p-6 shadow-sm">
                                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                                  {product.name} 상세 분석
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                                    <p className="text-sm text-gray-500">총 판매량</p>
                                    <p className="text-2xl font-bold text-gray-900">{product.sales?.toLocaleString()}</p>
                                  </div>
                                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                                    <p className="text-sm text-gray-500">총 클릭수</p>
                                    <p className="text-2xl font-bold text-gray-900">{product.clicks?.toLocaleString()}</p>
                                  </div>
                                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                                    <p className="text-sm text-gray-500">전환율</p>
                                    <p className="text-2xl font-bold text-blue-600">{product.conversionRate}</p>
                                  </div>
                                </div>
                                <div className="mt-4 text-sm text-gray-600">
                                  <p>• 카테고리: {product.category}</p>
                                  <p>• 총 매출: {product.revenue}</p>
                                  <p>• 클릭당 전환율: {((product.sales / product.clicks) * 100).toFixed(2)}%</p>
                                </div>
                              </div>
                            </td>
                          </tr>
                        )}
                      </React.Fragment>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>

            {/* 구매자 수 차트 - 전체 너비 */}
            <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">구매자 수</h3>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={buyersData}>
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
                    <Bar dataKey="value" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </section>

            {/* 클릭 수 & 장바구니 추가 수 - 전체 너비 */}
            <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">클릭 수 & 장바구니 추가 수</h3>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={clicksCartData}>
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
                    <Line type="monotone" dataKey="value" stroke="#C1C7CD" strokeWidth={2} name="클릭 & 장바구니" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </section>

            {/* 평균 체류시간 - 전체 너비 */}
            <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">평균 체류시간</h3>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={stayTimeData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="period" stroke="#6b7280" fontSize={12} />
                    <YAxis stroke="#6b7280" fontSize={12} />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'white', 
                        border: '1px solid #e5e7eb', 
                        borderRadius: '8px'
                      }}
                      formatter={(value) => [`${value}초`, '평균 체류시간']}
                    />
                    <Bar dataKey="value" fill="#C1C7CD" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </section>

            {/* 고객 정보 - 연령대는 크게, 성별/디바이스는 나누어서 */}
            <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-8 text-center">고객 정보</h2>
              
              {/* 연령대 분포 - 전체 너비로 크게 */}
              <div className="mb-8">
                <Card className="p-6">
                  <h3 className="text-sm font-medium text-gray-700 mb-4">연령대 분포</h3>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={customerData.ageData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                        <XAxis dataKey="ageGroup" stroke="#6b7280" fontSize={12} />
                        <YAxis stroke="#6b7280" fontSize={12} />
                        <Tooltip />
                        <Bar dataKey="count" fill="rgba(0,0,0,0.5)" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </Card>
              </div>

              {/* 성별/디바이스 분포 - 2개로 나누어서 */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* 성별 분포 */}
                <Card className="p-6">
                  <h3 className="text-sm font-medium text-gray-700 mb-4">성별 분포</h3>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={genderData}
                          cx="50%"
                          cy="50%"
                          innerRadius={40}
                          outerRadius={80}
                          paddingAngle={2}
                          dataKey="value"
                        >
                          {genderData.map((entry: any, index: number) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip formatter={(value) => [`${value}%`, '비율']} />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </Card>

                {/* 디바이스 분포 */}
                <Card className="p-6">
                  <h3 className="text-sm font-medium text-gray-700 mb-4">디바이스 분포</h3>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={deviceData}
                          cx="50%"
                          cy="50%"
                          innerRadius={40}
                          outerRadius={80}
                          paddingAngle={2}
                          dataKey="value"
                        >
                          {deviceData.map((entry: any, index: number) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip formatter={(value) => [`${value}%`, '비율']} />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </Card>
              </div>
            </section>
          </>
        )}
      </div>
    </div>
  );
}
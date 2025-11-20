import { Card } from "./ui/card";
import { Users, TrendingUp, Award, ShoppingBag } from "lucide-react";
import { 
  BarChart, 
  Bar, 
  LineChart,
  Line,
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Legend,
  Cell
} from "recharts";
import { mockLoyaltyData } from "../data/mockData";

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white px-4 py-3 rounded-lg shadow-lg border border-gray-200">
        <p className="font-medium text-gray-900">{payload[0].payload.tier || payload[0].payload.month || payload[0].payload.segment}</p>
        <p className="text-sm text-gray-600 mt-1">
          {payload[0].name}: <span className="font-semibold">{payload[0].value.toLocaleString()}</span>
        </p>
      </div>
    );
  }
  return null;
};

export function LoyaltyAnalysis() {
  const loyaltyTierData = mockLoyaltyData.tiers;
  const repeatPurchaseData = mockLoyaltyData.repeatPurchases;
  const lifetimeValueData = mockLoyaltyData.lifetimeValues;
  const { totalLoyalCustomers, avgRepeatPurchase, vipCustomers, repeatPurchaseRate } = mockLoyaltyData.summary;

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-semibold text-gray-900">충성 고객 분석</h2>
        <p className="text-sm text-gray-500 mt-1">고객 충성도 및 재구매 패턴 분석</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-br from-green-50 to-emerald-100 border border-green-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-2">전체 충성 고객</p>
              <p className="text-3xl font-bold text-gray-900">{totalLoyalCustomers.toLocaleString()}</p>
            </div>
            <div className="w-14 h-14 bg-green-400 rounded-xl flex items-center justify-center">
              <Users className="w-7 h-7 text-white" />
            </div>
          </div>
        </Card>

        <Card className="bg-gradient-to-br from-blue-50 to-indigo-100 border border-blue-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-2">월 평균 재구매</p>
              <p className="text-3xl font-bold text-gray-900">{avgRepeatPurchase}</p>
            </div>
            <div className="w-14 h-14 bg-blue-400 rounded-xl flex items-center justify-center">
              <TrendingUp className="w-7 h-7 text-white" />
            </div>
          </div>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-violet-100 border border-purple-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-2">VIP 고객</p>
              <p className="text-3xl font-bold text-gray-900">{vipCustomers}</p>
            </div>
            <div className="w-14 h-14 bg-purple-400 rounded-xl flex items-center justify-center">
              <Award className="w-7 h-7 text-white" />
            </div>
          </div>
        </Card>

        <Card className="bg-gradient-to-br from-orange-50 to-amber-100 border border-orange-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-2">재구매율</p>
              <p className="text-3xl font-bold text-gray-900">{repeatPurchaseRate}%</p>
            </div>
            <div className="w-14 h-14 bg-orange-400 rounded-xl flex items-center justify-center">
              <ShoppingBag className="w-7 h-7 text-white" />
            </div>
          </div>
        </Card>
      </div>

      {/* Loyalty Tier Distribution */}
      <Card className="bg-white border border-gray-200 shadow-sm p-8">
        <h3 className="text-xl font-semibold text-gray-900 mb-6">등급별 고객 분포</h3>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={loyaltyTierData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.06)" vertical={false} />
              <XAxis 
                dataKey="tier"
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
              <Bar dataKey="count" radius={[6, 6, 0, 0]} name="고객 수">
                {loyaltyTierData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>

          <div className="space-y-3">
            {loyaltyTierData.map((item, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-100">
                <div className="flex items-center gap-3">
                  <div 
                    className="w-4 h-4 rounded-full" 
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="font-medium text-gray-900">{item.tier}</span>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-gray-900">{item.count.toLocaleString()}명</p>
                  <p className="text-sm text-gray-500">
                    {((item.count / totalLoyalCustomers) * 100).toFixed(1)}%
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Card>

      {/* Repeat Purchase Trend */}
      <Card className="bg-white border border-gray-200 shadow-sm p-8">
        <h3 className="text-xl font-semibold text-gray-900 mb-6">월별 재구매 추이</h3>
        <ResponsiveContainer width="100%" height={350}>
          <LineChart data={repeatPurchaseData}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.06)" vertical={false} />
            <XAxis 
              dataKey="month"
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
            <Legend />
            <Line 
              type="monotone" 
              dataKey="count" 
              stroke="#10b981" 
              strokeWidth={3}
              dot={{ fill: "#10b981", strokeWidth: 2, r: 6 }}
              activeDot={{ r: 8 }}
              name="재구매 건수"
            />
          </LineChart>
        </ResponsiveContainer>
      </Card>

      {/* Lifetime Value */}
      <Card className="bg-white border border-gray-200 shadow-sm p-8">
        <h3 className="text-xl font-semibold text-gray-900 mb-6">고객 생애 가치 (LTV)</h3>
        <ResponsiveContainer width="100%" height={350}>
          <BarChart data={lifetimeValueData} layout="vertical">
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.06)" horizontal={false} />
            <XAxis 
              type="number"
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#6b7280', fontSize: 13 }}
              tickFormatter={(value) => `${(value / 1000).toFixed(0)}K`}
            />
            <YAxis 
              type="category"
              dataKey="segment"
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#6b7280', fontSize: 13 }}
              width={100}
            />
            <Tooltip 
              content={<CustomTooltip />}
              formatter={(value: any) => `${value.toLocaleString()}원`}
            />
            <Bar 
              dataKey="value" 
              fill="#10b981"
              radius={[0, 6, 6, 0]}
              name="평균 LTV"
            />
          </BarChart>
        </ResponsiveContainer>
      </Card>
    </div>
  );
}
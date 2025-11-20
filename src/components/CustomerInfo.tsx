import { Card } from "./ui/card";
import { 
  PieChart, 
  Pie, 
  Cell, 
  Tooltip, 
  ResponsiveContainer
} from "recharts";
import { mockDeviceData } from "../data/mockData";

const PieTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0];
    const total = 2645;
    return (
      <div className="bg-white px-4 py-3 rounded-lg shadow-lg border border-gray-200">
        <p className="font-medium text-gray-900">{data.name}</p>
        <p className="text-sm text-gray-600 mt-1">
          {data.value.toLocaleString()}명 ({((data.value / total) * 100).toFixed(1)}%)
        </p>
      </div>
    );
  }
  return null;
};

export function CustomerInfo() {
  const deviceData = mockDeviceData;
  const total = deviceData.reduce((sum, item) => sum + item.value, 0);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold text-gray-900">고객 정보</h2>
        <p className="text-sm text-gray-500 mt-1">고객의 디바이스 사용 현황</p>
      </div>
      
      <Card className="bg-white border border-gray-200 shadow-sm p-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          <div>
            <h3 className="text-xl font-semibold text-gray-900 mb-6">디바이스 분포</h3>
            <ResponsiveContainer width="100%" height={350}>
              <PieChart>
                <Pie
                  data={deviceData}
                  cx="50%"
                  cy="50%"
                  innerRadius={70}
                  outerRadius={120}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {deviceData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip content={<PieTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="space-y-4">
            <div className="text-center lg:text-left mb-6">
              <p className="text-sm text-gray-500 mb-2">전체 사용자</p>
              <p className="text-4xl font-bold text-gray-900">{total.toLocaleString()}<span className="text-xl text-gray-500 ml-2">명</span></p>
            </div>
            
            {deviceData.map((item, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-100">
                <div className="flex items-center gap-3">
                  <div 
                    className="w-4 h-4 rounded-full" 
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="font-medium text-gray-900">{item.name}</span>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-gray-900">{item.value.toLocaleString()}명</p>
                  <p className="text-sm text-gray-500">{((item.value / total) * 100).toFixed(1)}%</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Card>
    </div>
  );
}
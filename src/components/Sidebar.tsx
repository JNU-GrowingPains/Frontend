import { BarChart3, Package, Users, Home } from 'lucide-react';
import { useRouter } from './Router';

export function Sidebar() {
  const { navigate, currentPath } = useRouter();

  const menuItems = [
    {
      path: '/',
      icon: Home,
      label: '메인 대시보드',
    },
    {
      path: '/product-focus',
      icon: Package,
      label: '주요 상품 분석',
    },
    {
      path: '/performance-analysis',
      icon: BarChart3,
      label: '성과 지표 분석',
    },
    {
      path: '/customer-analysis',
      icon: Users,
      label: '고객정보 관리',
    }
  ];

  return (
    <div className="fixed left-0 top-0 h-full w-64 bg-white border-r border-gray-200 shadow-lg z-50">
      <div className="p-6">
        {/* Logo */}
        <div className="mb-12 pb-4 border-b border-gray-100">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gray-800 rounded-lg flex items-center justify-center shadow-md">
              <span className="text-white text-sm font-bold">성</span>
            </div>
            <h1 className="text-lg text-gray-800 font-semibold">성장통</h1>
          </div>
        </div>

        {/* Navigation */}
        <nav className="space-y-2">
          {menuItems.map((item) => (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 text-sm group relative overflow-hidden ${
                currentPath === item.path 
                  ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold shadow-lg shadow-blue-500/25'
                  : 'text-gray-600 hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 hover:text-gray-900 hover:shadow-md'
              }`}
            >
              {/* Active indicator */}
              {currentPath === item.path && (
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-white rounded-r-full" />
              )}
              
              <item.icon className={`w-5 h-5 transition-colors duration-200 ${
                currentPath === item.path 
                  ? 'text-white' 
                  : 'text-gray-500 group-hover:text-blue-600'
              }`} />
              <span className="transition-colors duration-200">{item.label}</span>
            </button>
          ))}
        </nav>
      </div>
    </div>
  );
}
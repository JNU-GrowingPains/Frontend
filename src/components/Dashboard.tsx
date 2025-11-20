import { useState } from "react";
import { ProductTable } from "./ProductTable";
import { PerformanceMetrics } from "./PerformanceMetrics";
import { CustomerInfo } from "./CustomerInfo";
import { LoyaltyAnalysis } from "./LoyaltyAnalysis";
import { AccountManagement } from "./AccountManagement";
import { useAuth } from "../contexts/AuthContext";
import { LogOut } from "lucide-react";

type MenuKey = "products" | "loyalty" | "account";

interface MenuItem {
  key: MenuKey;
  label: string;
  emoji: string;
  disabled?: boolean; // 비활성화 플래그
}

const menuItems: MenuItem[] = [
  { key: "products", label: "주요 상품별데이터", emoji: "📦" },
  { key: "loyalty", label: "충성 고객 분석", emoji: "💎", disabled: true }, // 비활성화
  { key: "account", label: "내 계정 관리", emoji: "⚙️" }
];

export function Dashboard() {
  const [activeMenu, setActiveMenu] = useState<MenuKey>("products");
  const [selectedProductId, setSelectedProductId] = useState<string | null>("2");
  const { logout, user } = useAuth();

  const handleProductSelect = (productId: string) => {
    setSelectedProductId(productId);
  };

  const renderMainContent = () => {
    switch (activeMenu) {
      case "products":
        return (
          <div className="space-y-8">
            <ProductTable 
              selectedProductId={selectedProductId}
              onProductSelect={handleProductSelect}
            />
            <PerformanceMetrics selectedProductId={selectedProductId} />
            <CustomerInfo />
          </div>
        );
      case "loyalty":
        return <LoyaltyAnalysis />;
      case "account":
        return <AccountManagement />;
      default:
        return (
          <div className="space-y-8">
            <ProductTable 
              selectedProductId={selectedProductId}
              onProductSelect={handleProductSelect}
            />
            <PerformanceMetrics selectedProductId={selectedProductId} />
            <CustomerInfo />
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Sidebar */}
      <aside className="fixed top-0 left-0 w-[240px] h-full bg-[rgba(0,0,0,0.04)] border-r border-gray-200">
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="px-6 py-8 border-b border-gray-200">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-emerald-500 rounded-xl flex items-center justify-center shadow-sm">
                <span className="text-white text-xl">🌱</span>
              </div>
              <h1 className="text-xl text-gray-900">성장통</h1>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex flex-col py-4 flex-1">
            {menuItems.map((item) => {
              const isActive = activeMenu === item.key;
              const isDisabled = item.disabled;
              
              return (
                <button
                  key={item.key}
                  onClick={() => !isDisabled && setActiveMenu(item.key)}
                  disabled={isDisabled}
                  className={`
                    w-full flex items-center gap-3 px-6 py-4 text-left transition-all duration-200
                    ${isActive && !isDisabled ? "bg-[#0dc926]" : ""}
                    ${isDisabled ? "opacity-50 cursor-not-allowed" : "hover:bg-[rgba(0,0,0,0.02)]"}
                  `}
                >
                  <div className={`bg-white/60 rounded-lg w-7 h-7 flex items-center justify-center shrink-0 shadow-sm ${isDisabled ? "opacity-50" : ""}`}>
                    <span className="text-base">{item.emoji}</span>
                  </div>
                  <span className={`text-[15px] ${isDisabled ? "text-gray-400" : "text-gray-900"}`}>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Logout Button */}
          <div className="px-6 py-4 border-t border-gray-200">
            <button
              onClick={logout}
              className="w-full flex items-center gap-3 px-4 py-3 text-left transition-all duration-200 hover:bg-[rgba(0,0,0,0.02)] rounded-lg"
            >
              <LogOut className="w-5 h-5 text-gray-600" />
              <span className="text-sm text-gray-700">로그아웃</span>
            </button>
            {user && (
              <div className="mt-2 px-4">
                <p className="text-xs text-gray-500">{user.email}</p>
              </div>
            )}
          </div>
        </div>
      </aside>

      {/* Main content */}
      <main className="ml-[240px] min-h-screen">
        {/* Header */}
        <header className="bg-white/90 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-30 shadow-sm">
          <div className="flex items-center justify-between px-8 py-5">
            <div>
              <h2 className="text-2xl text-gray-900">
                {menuItems.find(item => item.key === activeMenu)?.label}
              </h2>
              <p className="text-sm text-gray-500 mt-1">
                실시간 데이터 분석 대시보드
              </p>
            </div>
          </div>
        </header>

        {/* Content */}
        <div className="p-8">
          {renderMainContent()}
        </div>
      </main>
    </div>
  );
}

import { Sidebar } from './components/Sidebar';
import { MainProductAnalysisDashboard } from './components/MainProductAnalysisDashboard';
import { ProductFocusDashboard } from './components/ProductFocusDashboard';
import { PerformanceAnalysisDashboard } from './components/PerformanceAnalysisDashboard';
import { CustomerAnalysisDashboard } from './components/CustomerAnalysisDashboard';
import { Router, Route } from './components/Router';

const routes: Route[] = [
  {
    path: '/',
    component: () => <MainProductAnalysisDashboard />
  },
  {
    path: '/product-focus',
    component: () => <ProductFocusDashboard />
  },
  {
    path: '/performance-analysis',
    component: () => <PerformanceAnalysisDashboard />
  },
  {
    path: '/customer-analysis',
    component: () => <CustomerAnalysisDashboard />
  }
];

export default function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 relative">
      <Router routes={routes} defaultPath="/">
        <Sidebar />
      </Router>
    </div>
  );
}
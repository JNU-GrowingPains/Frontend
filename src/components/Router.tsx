import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface Route {
  path: string;
  component: () => JSX.Element;
}

interface RouterContextType {
  currentPath: string;
  navigate: (path: string) => void;
}

const RouterContext = createContext<RouterContextType | undefined>(undefined);

export function useRouter() {
  const context = useContext(RouterContext);
  if (!context) {
    throw new Error('useRouter must be used within a Router');
  }
  return context;
}

interface RouterProps {
  routes: Route[];
  defaultPath: string;
  children: ReactNode;
}

export function Router({ routes, defaultPath, children }: RouterProps) {
  const [currentPath, setCurrentPath] = useState(defaultPath);

  const navigate = (path: string) => {
    setCurrentPath(path);
    // Scroll to top when navigating
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  useEffect(() => {
    // Initialize with default path
    if (!currentPath) {
      setCurrentPath(defaultPath);
    }
  }, [defaultPath, currentPath]);

  const currentRoute = routes.find(route => route.path === currentPath);
  const ComponentToRender = currentRoute?.component || (() => <div>Page not found</div>);

  return (
    <RouterContext.Provider value={{ currentPath, navigate }}>
      <div className="flex">
        {children}
        <div className="ml-64 min-h-screen flex-1">
          <ComponentToRender />
        </div>
      </div>
    </RouterContext.Provider>
  );
}
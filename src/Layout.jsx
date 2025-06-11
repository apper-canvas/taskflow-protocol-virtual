import React, { useState } from 'react';
import { Outlet, NavLink, useLocation } from 'react-router-dom';
import { routeArray } from './config/routes';
import ApperIcon from './components/ApperIcon';

const Layout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  const isActive = (path) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };

  return (
    <div className="h-screen flex flex-col overflow-hidden bg-white">
      {/* Header */}
      <header className="flex-shrink-0 h-16 bg-white border-b border-surface-200 z-40">
        <div className="h-full px-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              className="lg:hidden p-2 rounded-button hover:bg-surface-100 transition-colors"
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              <ApperIcon name="Menu" size={20} />
            </button>
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-primary rounded-button flex items-center justify-center">
                <ApperIcon name="CheckSquare" size={16} className="text-white" />
              </div>
              <h1 className="text-xl font-heading font-semibold text-surface-900">
                TaskFlow Pro
              </h1>
            </div>
          </div>
          
          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-1">
            {routeArray.map((route) => (
              <NavLink
                key={route.id}
                to={route.path}
                className={`px-4 py-2 rounded-button font-medium transition-all duration-200 flex items-center space-x-2 ${
                  isActive(route.path)
                    ? 'bg-primary text-white shadow-sm'
                    : 'text-surface-600 hover:text-surface-900 hover:bg-surface-100'
                }`}
              >
                <ApperIcon name={route.icon} size={16} />
                <span>{route.label}</span>
              </NavLink>
            ))}
          </nav>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      {sidebarOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Mobile Sidebar */}
        <aside
          className={`lg:hidden fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-surface-200 transform transition-transform duration-300 ${
            sidebarOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
          <div className="pt-16 pb-4">
            <nav className="px-4 space-y-1">
              {routeArray.map((route) => (
                <NavLink
                  key={route.id}
                  to={route.path}
                  onClick={() => setSidebarOpen(false)}
                  className={`w-full px-3 py-2 rounded-button font-medium transition-all duration-200 flex items-center space-x-3 ${
                    isActive(route.path)
                      ? 'bg-primary text-white'
                      : 'text-surface-600 hover:text-surface-900 hover:bg-surface-100'
                  }`}
                >
                  <ApperIcon name={route.icon} size={16} />
                  <span>{route.label}</span>
                </NavLink>
              ))}
            </nav>
          </div>
        </aside>

        {/* Content */}
        <main className="flex-1 overflow-y-auto bg-surface-50">
          <div className="max-w-full overflow-hidden">
            <Outlet />
          </div>
        </main>
      </div>

      {/* Mobile Bottom Navigation */}
      <div className="lg:hidden flex-shrink-0 bg-white border-t border-surface-200">
        <nav className="flex">
          {routeArray.map((route) => (
            <NavLink
              key={route.id}
              to={route.path}
              className={`flex-1 px-2 py-3 text-center transition-colors ${
                isActive(route.path)
                  ? 'text-primary bg-primary/5'
                  : 'text-surface-500 hover:text-surface-700'
              }`}
            >
              <div className="flex flex-col items-center space-y-1">
                <ApperIcon name={route.icon} size={20} />
                <span className="text-xs font-medium">{route.label}</span>
              </div>
            </NavLink>
          ))}
        </nav>
      </div>
    </div>
  );
};

export default Layout;
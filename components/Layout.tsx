
import React, { useState } from 'react';
import { useFinance } from '../context/FinanceContext';
import Logo from './Logo';

interface LayoutProps {
  children: React.ReactNode;
  activeView: 'dashboard' | 'transactions' | 'add';
  setActiveView: (view: 'dashboard' | 'transactions' | 'add') => void;
}

const Layout: React.FC<LayoutProps> = ({ children, activeView, setActiveView }) => {
  const { user, logout } = useFinance();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const NavItem = ({ view, icon, label }: { view: 'dashboard' | 'transactions' | 'add', icon: string, label: string }) => (
    <button
      onClick={() => {
        setActiveView(view);
        setIsSidebarOpen(false);
      }}
      className={`w-full flex items-center space-x-3 px-6 py-4 transition-colors duration-200 ${
        activeView === view 
          ? 'bg-emerald-50 text-emerald-600 border-r-4 border-emerald-600' 
          : 'text-slate-500 hover:bg-slate-50 hover:text-slate-700'
      }`}
    >
      <i className={`fas ${icon} w-5`}></i>
      <span className="font-medium">{label}</span>
    </button>
  );

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      {/* Sidebar for Desktop */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-slate-200 transition-transform duration-300 transform lg:translate-x-0 lg:static lg:inset-0 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-center h-20 border-b border-slate-100">
            <div className="flex items-center space-x-2">
              <Logo size={32} />
              <span className="text-xl font-bold text-slate-800">GastadorPeso</span>
            </div>
          </div>

          <nav className="flex-grow py-6">
            <NavItem view="dashboard" icon="fa-chart-pie" label="Dashboard" />
            <NavItem view="transactions" icon="fa-list" label="Transactions" />
            <NavItem view="add" icon="fa-plus-circle" label="Add Transaction" />
          </nav>

          <div className="p-6 border-t border-slate-100">
            <div className="flex items-center space-x-3 mb-6">
              <div className="h-10 w-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 font-bold">
                {user?.name.charAt(0).toUpperCase()}
              </div>
              <div className="flex-grow overflow-hidden">
                <p className="text-sm font-semibold text-slate-800 truncate">{user?.name}</p>
                <p className="text-xs text-slate-500 truncate">{user?.email}</p>
              </div>
            </div>
            <button
              onClick={logout}
              className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors duration-200"
            >
              <i className="fas fa-sign-out-alt"></i>
              <span className="font-medium">Logout</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-grow flex flex-col overflow-hidden">
        {/* Mobile Header */}
        <header className="lg:hidden flex items-center justify-between h-16 bg-white border-b border-slate-200 px-4">
          <button onClick={() => setIsSidebarOpen(true)} className="p-2 text-slate-600">
            <i className="fas fa-bars text-xl"></i>
          </button>
          <div className="flex items-center space-x-2">
            <Logo size={24} />
            <span className="text-lg font-bold text-slate-800">GastadorPeso</span>
          </div>
          <div className="w-10"></div> {/* Spacer */}
        </header>

        {/* Scrollable Content */}
        <main className="flex-grow overflow-y-auto p-4 md:p-8 lg:p-10">
          <div className="max-w-6xl mx-auto">
            {children}
          </div>
        </main>
      </div>

      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        ></div>
      )}
    </div>
  );
};

export default Layout;

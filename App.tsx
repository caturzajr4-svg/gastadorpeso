
import React, { useState } from 'react';
import { FinanceProvider, useFinance } from './context/FinanceContext';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import TransactionList from './components/TransactionList';
import TransactionForm from './components/TransactionForm';
import Auth from './components/Auth';

const Main: React.FC = () => {
  const { user } = useFinance();
  const [activeView, setActiveView] = useState<'dashboard' | 'transactions' | 'add'>('dashboard');

  if (!user) {
    return <Auth />;
  }

  const renderView = () => {
    switch (activeView) {
      case 'dashboard':
        return <Dashboard />;
      case 'transactions':
        return <TransactionList />;
      case 'add':
        return <TransactionForm onSuccess={() => setActiveView('transactions')} />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <Layout activeView={activeView} setActiveView={setActiveView}>
      {renderView()}
    </Layout>
  );
};

const App: React.FC = () => {
  return (
    <FinanceProvider>
      <Main />
    </FinanceProvider>
  );
};

export default App;


import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { Transaction, User, TransactionType, SummaryData, DateRange, DATE_PRESETS } from '../types';
import { api } from '../services/api';

interface FinanceContextType {
  user: User | null;
  transactions: Transaction[];
  filteredTransactions: Transaction[];
  summary: SummaryData;
  loading: boolean;
  error: string | null;
  dateRange: DateRange;
  setDateRange: (range: DateRange) => void;
  login: (email: string, pass: string) => Promise<void>;
  register: (name: string, email: string, pass: string) => Promise<void>;
  forgotPassword: (email: string) => Promise<void>;
  resetPassword: (email: string, pass: string) => Promise<void>;
  logout: () => void;
  fetchTransactions: () => Promise<void>;
  addTransaction: (t: Omit<Transaction, 'id' | 'userId' | 'createdAt'>) => Promise<void>;
  editTransaction: (id: string, t: Partial<Transaction>) => Promise<void>;
  removeTransaction: (id: string) => Promise<void>;
}

const getDefaultDateRange = (): DateRange => {
  const now = new Date();
  const firstDay = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split('T')[0];
  const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0).toISOString().split('T')[0];
  return {
    startDate: firstDay,
    endDate: lastDay,
    label: DATE_PRESETS.THIS_MONTH
  };
};

const FinanceContext = createContext<FinanceContextType | undefined>(undefined);

export const FinanceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(api.getCurrentUser());
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [dateRange, setDateRange] = useState<DateRange>(getDefaultDateRange());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchTransactions = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    try {
      const data = await api.getTransactions(user.id);
      setTransactions(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      fetchTransactions();
    }
  }, [user, fetchTransactions]);

  const login = async (email: string, pass: string) => {
    setLoading(true);
    try {
      const u = await api.login(email, pass);
      setUser(u);
      setError(null);
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const register = async (name: string, email: string, pass: string) => {
    setLoading(true);
    try {
      const u = await api.register(name, email, pass);
      setUser(u);
      setError(null);
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const forgotPassword = async (email: string) => {
    setLoading(true);
    try {
      await api.forgotPassword(email);
      setError(null);
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const resetPassword = async (email: string, pass: string) => {
    setLoading(true);
    try {
      await api.resetPassword(email, pass);
      setError(null);
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    api.logout();
    setUser(null);
    setTransactions([]);
  };

  const addTransaction = async (t: Omit<Transaction, 'id' | 'userId' | 'createdAt'>) => {
    if (!user) return;
    try {
      const newT = await api.addTransaction({ ...t, userId: user.id });
      setTransactions(prev => [newT, ...prev]);
    } catch (err: any) {
      setError(err.message);
    }
  };

  const editTransaction = async (id: string, t: Partial<Transaction>) => {
    try {
      const updated = await api.updateTransaction(id, t);
      setTransactions(prev => prev.map(item => item.id === id ? updated : item));
    } catch (err: any) {
      setError(err.message);
    }
  };

  const removeTransaction = async (id: string) => {
    try {
      await api.deleteTransaction(id);
      setTransactions(prev => prev.filter(item => item.id !== id));
    } catch (err: any) {
      setError(err.message);
    }
  };

  const filteredTransactions = useMemo(() => {
    const start = new Date(dateRange.startDate);
    const end = new Date(dateRange.endDate);
    end.setHours(23, 59, 59, 999);

    return transactions.filter(t => {
      const tDate = new Date(t.date);
      return tDate >= start && tDate <= end;
    });
  }, [transactions, dateRange]);

  const summary: SummaryData = useMemo(() => {
    return filteredTransactions.reduce((acc, curr) => {
      if (curr.type === TransactionType.INCOME) {
        acc.totalIncome += curr.amount;
        acc.totalBalance += curr.amount;
      } else {
        acc.totalExpenses += curr.amount;
        acc.totalBalance -= curr.amount;
      }
      return acc;
    }, { totalBalance: 0, totalIncome: 0, totalExpenses: 0 });
  }, [filteredTransactions]);

  return (
    <FinanceContext.Provider value={{
      user, transactions, filteredTransactions, summary, loading, error, dateRange, setDateRange,
      login, register, forgotPassword, resetPassword, logout, fetchTransactions,
      addTransaction, editTransaction, removeTransaction
    }}>
      {children}
    </FinanceContext.Provider>
  );
};

export const useFinance = () => {
  const context = useContext(FinanceContext);
  if (!context) throw new Error('useFinance must be used within a FinanceProvider');
  return context;
};

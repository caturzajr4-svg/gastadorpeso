
export enum TransactionType {
  INCOME = 'INCOME',
  EXPENSE = 'EXPENSE'
}

export interface Transaction {
  id: string;
  userId: string;
  amount: number;
  type: TransactionType;
  category: string;
  description: string;
  date: string;
  createdAt: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
  token?: string;
}

export interface DateRange {
  startDate: string;
  endDate: string;
  label: string;
}

export interface SummaryData {
  totalBalance: number;
  totalIncome: number;
  totalExpenses: number;
}

export const CATEGORIES = [
  'Housing',
  'Transportation',
  'Food',
  'Utilities',
  'Insurance',
  'Medical',
  'Savings',
  'Personal',
  'Entertainment',
  'Salary',
  'Freelance',
  'Investments',
  'Gift',
  'Other'
];

export const DATE_PRESETS = {
  THIS_MONTH: 'This Month',
  LAST_MONTH: 'Last Month',
  THIS_YEAR: 'This Year',
  LAST_30_DAYS: 'Last 30 Days',
  CUSTOM: 'Custom Range'
};

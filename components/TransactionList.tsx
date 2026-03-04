
import React, { useState } from 'react';
import { useFinance } from '../context/FinanceContext';
import { TransactionType, CATEGORIES, Transaction } from '../types';
import TransactionForm from './TransactionForm';
import DateRangePicker from './DateRangePicker';

const TransactionList: React.FC = () => {
  const { filteredTransactions, removeTransaction } = useFinance();
  const [editingId, setEditingId] = useState<string | null>(null);
  
  // Filters
  const [filterType, setFilterType] = useState<string>('ALL');
  const [filterCategory, setFilterCategory] = useState<string>('ALL');
  const [searchTerm, setSearchTerm] = useState('');

  const displayTransactions = filteredTransactions.filter(t => {
    const matchesType = filterType === 'ALL' || t.type === filterType;
    const matchesCategory = filterCategory === 'ALL' || t.category === filterCategory;
    const matchesSearch = t.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesType && matchesCategory && matchesSearch;
  });

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this transaction?')) {
      removeTransaction(id);
    }
  };

  const editItem = filteredTransactions.find(t => t.id === editingId);

  if (editingId && editItem) {
    return (
      <div>
        <button 
          onClick={() => setEditingId(null)}
          className="mb-6 flex items-center text-emerald-600 font-medium hover:text-emerald-700"
        >
          <i className="fas fa-arrow-left mr-2"></i>
          Back to List
        </button>
        <TransactionForm initialData={editItem} onSuccess={() => setEditingId(null)} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h1 className="text-2xl font-bold text-slate-900">Transaction History</h1>
        <DateRangePicker />
      </div>

      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
        <div className="flex-grow max-w-md">
          <div className="relative">
            <i className="fas fa-search absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"></i>
            <input
              type="text"
              placeholder="Search descriptions..."
              className="w-full pl-11 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-100 focus:border-emerald-400 outline-none transition-all"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="flex flex-wrap gap-4">
          <select 
            className="px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none cursor-pointer font-medium text-slate-700"
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
          >
            <option value="ALL">All Types</option>
            <option value={TransactionType.INCOME}>Income</option>
            <option value={TransactionType.EXPENSE}>Expenses</option>
          </select>

          <select 
            className="px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none cursor-pointer font-medium text-slate-700"
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
          >
            <option value="ALL">All Categories</option>
            {CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
          </select>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100">
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Date</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Description</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Category</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider text-right">Amount</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {displayTransactions.length > 0 ? (
                displayTransactions.map((t) => (
                  <tr key={t.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4">
                      <p className="text-sm font-medium text-slate-800">
                        {new Date(t.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm text-slate-900 font-semibold">{t.description}</p>
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-3 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-600">
                        {t.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <p className={`text-sm font-bold ${t.type === TransactionType.INCOME ? 'text-emerald-600' : 'text-rose-600'}`}>
                        {t.type === TransactionType.INCOME ? '+' : '-'}₱{t.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                      </p>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end space-x-2">
                        <button 
                          onClick={() => setEditingId(t.id)}
                          className="p-2 text-emerald-400 hover:text-emerald-600 transition-colors"
                        >
                          <i className="far fa-edit"></i>
                        </button>
                        <button 
                          onClick={() => handleDelete(t.id)}
                          className="p-2 text-rose-400 hover:text-rose-600 transition-colors"
                        >
                          <i className="far fa-trash-alt"></i>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-slate-400">
                    <div className="flex flex-col items-center">
                      <i className="fas fa-receipt text-4xl mb-4 opacity-20"></i>
                      <p>No transactions found for this period</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default TransactionList;

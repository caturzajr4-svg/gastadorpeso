
import React, { useState, useEffect } from 'react';
import { useFinance } from '../context/FinanceContext';
import { TransactionType, CATEGORIES, Transaction } from '../types';

interface TransactionFormProps {
  initialData?: Transaction | null;
  onSuccess?: () => void;
}

const TransactionForm: React.FC<TransactionFormProps> = ({ initialData, onSuccess }) => {
  const { addTransaction, editTransaction } = useFinance();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    amount: '',
    type: TransactionType.EXPENSE,
    category: CATEGORIES[0],
    description: '',
    date: new Date().toISOString().split('T')[0]
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        amount: initialData.amount.toString(),
        type: initialData.type,
        category: initialData.category,
        description: initialData.description,
        date: new Date(initialData.date).toISOString().split('T')[0]
      });
    }
  }, [initialData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.amount || !formData.description) return;
    
    setLoading(true);
    try {
      const payload = {
        amount: parseFloat(formData.amount),
        type: formData.type,
        category: formData.category,
        description: formData.description,
        date: new Date(formData.date).toISOString()
      };

      if (initialData) {
        await editTransaction(initialData.id, payload);
      } else {
        await addTransaction(payload);
        // Reset form after success only for NEW entries
        setFormData({
          amount: '',
          type: TransactionType.EXPENSE,
          category: CATEGORIES[0],
          description: '',
          date: new Date().toISOString().split('T')[0]
        });
      }
      
      if (onSuccess) onSuccess();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8 max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold text-slate-800 mb-6">
        {initialData ? 'Edit Transaction' : 'Record New Transaction'}
      </h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Type Toggle */}
        <div className="flex p-1 bg-slate-100 rounded-xl">
          <button
            type="button"
            onClick={() => setFormData({...formData, type: TransactionType.EXPENSE})}
            className={`flex-1 py-2 rounded-lg font-medium transition-all ${
              formData.type === TransactionType.EXPENSE 
                ? 'bg-white text-rose-600 shadow-sm' 
                : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            Expense
          </button>
          <button
            type="button"
            onClick={() => setFormData({...formData, type: TransactionType.INCOME})}
            className={`flex-1 py-2 rounded-lg font-medium transition-all ${
              formData.type === TransactionType.INCOME 
                ? 'bg-white text-emerald-600 shadow-sm' 
                : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            Income
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-600">Amount (₱)</label>
            <input
              type="number"
              step="0.01"
              required
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition-all outline-none"
              placeholder="0.00"
              value={formData.amount}
              onChange={(e) => setFormData({...formData, amount: e.target.value})}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-600">Category</label>
            <select
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition-all outline-none"
              value={formData.category}
              onChange={(e) => setFormData({...formData, category: e.target.value})}
            >
              {CATEGORIES.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-semibold text-slate-600">Description</label>
          <input
            type="text"
            required
            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition-all outline-none"
            placeholder="What was this for?"
            value={formData.description}
            onChange={(e) => setFormData({...formData, description: e.target.value})}
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-semibold text-slate-600">Date</label>
          <input
            type="date"
            required
            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition-all outline-none"
            value={formData.date}
            onChange={(e) => setFormData({...formData, date: e.target.value})}
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-4 rounded-xl shadow-lg shadow-emerald-200 transition-all active:scale-95 disabled:opacity-70"
        >
          {loading ? (
            <i className="fas fa-circle-notch fa-spin"></i>
          ) : (
            initialData ? 'Update Transaction' : 'Add Transaction'
          )}
        </button>
      </form>
    </div>
  );
};

export default TransactionForm;

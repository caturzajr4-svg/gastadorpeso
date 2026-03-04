
import React from 'react';
import { useFinance } from '../context/FinanceContext';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell, Legend, AreaChart, Area 
} from 'recharts';
import { TransactionType } from '../types';
import DateRangePicker from './DateRangePicker';

const Dashboard: React.FC = () => {
  const { summary, filteredTransactions } = useFinance();

  // Prepare data for Spending by Category Pie Chart
  const categoryData = filteredTransactions
    .filter(t => t.type === TransactionType.EXPENSE)
    .reduce((acc: any[], curr) => {
      const existing = acc.find(a => a.name === curr.category);
      if (existing) {
        existing.value += curr.amount;
      } else {
        acc.push({ name: curr.category, value: curr.amount });
      }
      return acc;
    }, []);

  // Prepare data for Monthly Trend Area Chart
  const trendData = [...filteredTransactions]
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .reduce((acc: any[], curr) => {
      const date = new Date(curr.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      const existing = acc.find(a => a.date === date);
      if (existing) {
        if (curr.type === TransactionType.INCOME) existing.income += curr.amount;
        else existing.expense += curr.amount;
      } else {
        acc.push({ 
          date, 
          income: curr.type === TransactionType.INCOME ? curr.amount : 0, 
          expense: curr.type === TransactionType.EXPENSE ? curr.amount : 0 
        });
      }
      return acc;
    }, []);

  const COLORS = ['#059669', '#10b981', '#34d399', '#fbbf24', '#d97706', '#475569', '#0f172a'];

  const SummaryCard = ({ title, amount, icon, color, bgColor }: any) => (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 flex items-center space-x-4">
      <div className={`${bgColor} ${color} p-4 rounded-xl text-2xl`}>
        <i className={`fas ${icon}`}></i>
      </div>
      <div>
        <p className="text-xs text-slate-500 font-bold mb-1 uppercase tracking-widest">{title}</p>
        <p className={`text-2xl font-bold ${amount < 0 ? 'text-rose-600' : 'text-slate-900'}`}>
          ₱{Math.abs(amount).toLocaleString(undefined, { minimumFractionDigits: 2 })}
        </p>
      </div>
    </div>
  );

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-slate-900">Financial Overview</h1>
          <p className="text-slate-500">Analytics for your selected period.</p>
        </div>
        <DateRangePicker />
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <SummaryCard 
          title="Period Balance" 
          amount={summary.totalBalance} 
          icon="fa-peso-sign" 
          color="text-emerald-600" 
          bgColor="bg-emerald-50"
        />
        <SummaryCard 
          title="Period Income" 
          amount={summary.totalIncome} 
          icon="fa-arrow-trend-up" 
          color="text-emerald-600" 
          bgColor="bg-emerald-50"
        />
        <SummaryCard 
          title="Period Expenses" 
          amount={summary.totalExpenses} 
          icon="fa-arrow-trend-down" 
          color="text-rose-600" 
          bgColor="bg-rose-50"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Trend Chart */}
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-slate-800">Activity Trend</h3>
            <div className="flex items-center space-x-4 text-xs font-medium">
              <span className="flex items-center"><span className="w-3 h-3 bg-emerald-500 rounded-full mr-1"></span> Income</span>
              <span className="flex items-center"><span className="w-3 h-3 bg-rose-500 rounded-full mr-1"></span> Expense</span>
            </div>
          </div>
          <div className="h-72">
            {trendData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={trendData}>
                  <defs>
                    <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.1}/>
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorExpense" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.1}/>
                      <stop offset="95%" stopColor="#f43f5e" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 11}} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 11}} />
                  <Tooltip 
                    contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}} 
                  />
                  <Area type="monotone" dataKey="income" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorIncome)" />
                  <Area type="monotone" dataKey="expense" stroke="#f43f5e" strokeWidth={3} fillOpacity={1} fill="url(#colorExpense)" />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-slate-400">
                <i className="fas fa-chart-area text-4xl mb-3 opacity-20"></i>
                <p>No activity in this period</p>
              </div>
            )}
          </div>
        </div>

        {/* Categories Chart */}
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
          <h3 className="text-lg font-bold text-slate-800 mb-6">Spending Distribution</h3>
          <div className="h-72">
            {categoryData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={90}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend verticalAlign="bottom" height={36} iconType="circle"/>
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-slate-400">
                <i className="fas fa-chart-pie text-4xl mb-3 opacity-20"></i>
                <p>No expenses in this period</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

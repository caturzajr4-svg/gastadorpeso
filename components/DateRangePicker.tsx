
import React, { useState } from 'react';
import { useFinance } from '../context/FinanceContext';
import { DATE_PRESETS, DateRange } from '../types';

const DateRangePicker: React.FC = () => {
  const { dateRange, setDateRange } = useFinance();
  const [isOpen, setIsOpen] = useState(false);

  const applyPreset = (preset: string) => {
    const now = new Date();
    let start = new Date();
    let end = new Date();
    let label = preset;

    switch (preset) {
      case DATE_PRESETS.THIS_MONTH:
        start = new Date(now.getFullYear(), now.getMonth(), 1);
        end = new Date(now.getFullYear(), now.getMonth() + 1, 0);
        break;
      case DATE_PRESETS.LAST_MONTH:
        start = new Date(now.getFullYear(), now.getMonth() - 1, 1);
        end = new Date(now.getFullYear(), now.getMonth(), 0);
        break;
      case DATE_PRESETS.THIS_YEAR:
        start = new Date(now.getFullYear(), 0, 1);
        end = new Date(now.getFullYear(), 11, 31);
        break;
      case DATE_PRESETS.LAST_30_DAYS:
        start = new Date();
        start.setDate(now.getDate() - 30);
        end = new Date();
        break;
      default:
        return;
    }

    setDateRange({
      startDate: start.toISOString().split('T')[0],
      endDate: end.toISOString().split('T')[0],
      label
    });
    setIsOpen(false);
  };

  const handleCustomDateChange = (type: 'start' | 'end', value: string) => {
    const newRange = { ...dateRange, label: DATE_PRESETS.CUSTOM };
    if (type === 'start') newRange.startDate = value;
    else newRange.endDate = value;
    setDateRange(newRange);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 bg-white px-4 py-2 rounded-xl border border-slate-200 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors shadow-sm"
      >
        <i className="far fa-calendar-alt text-emerald-600"></i>
        <span>{dateRange.label}:</span>
        <span className="text-slate-500 font-normal">
          {new Date(dateRange.startDate).toLocaleDateString()} - {new Date(dateRange.endDate).toLocaleDateString()}
        </span>
        <i className={`fas fa-chevron-down text-xs transition-transform ${isOpen ? 'rotate-180' : ''}`}></i>
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setIsOpen(false)}></div>
          <div className="absolute right-0 mt-2 w-72 bg-white rounded-2xl shadow-xl border border-slate-100 z-20 p-4">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Presets</p>
            <div className="space-y-1 mb-4">
              {[DATE_PRESETS.THIS_MONTH, DATE_PRESETS.LAST_MONTH, DATE_PRESETS.LAST_30_DAYS, DATE_PRESETS.THIS_YEAR].map(preset => (
                <button
                  key={preset}
                  onClick={() => applyPreset(preset)}
                  className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                    dateRange.label === preset ? 'bg-emerald-50 text-emerald-600 font-bold' : 'text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  {preset}
                </button>
              ))}
            </div>

            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Custom Range</p>
            <div className="space-y-3">
              <div>
                <label className="text-[10px] text-slate-400 uppercase font-bold">Start Date</label>
                <input
                  type="date"
                  className="w-full mt-1 px-3 py-2 border border-slate-100 rounded-lg text-sm focus:ring-2 focus:ring-emerald-100 outline-none"
                  value={dateRange.startDate}
                  onChange={(e) => handleCustomDateChange('start', e.target.value)}
                />
              </div>
              <div>
                <label className="text-[10px] text-slate-400 uppercase font-bold">End Date</label>
                <input
                  type="date"
                  className="w-full mt-1 px-3 py-2 border border-slate-100 rounded-lg text-sm focus:ring-2 focus:ring-emerald-100 outline-none"
                  value={dateRange.endDate}
                  onChange={(e) => handleCustomDateChange('end', e.target.value)}
                />
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default DateRangePicker;

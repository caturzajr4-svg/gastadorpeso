
import React, { useState } from 'react';
import { useFinance } from '../context/FinanceContext';
import Logo from './Logo';

const Auth: React.FC = () => {
  const { login, register, forgotPassword, resetPassword, loading, error } = useFinance();
  const [view, setView] = useState<'login' | 'register' | 'forgot' | 'reset'>('login');
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccessMessage(null);
    try {
      if (view === 'login') {
        await login(formData.email, formData.password);
      } else if (view === 'register') {
        await register(formData.name, formData.email, formData.password);
      } else if (view === 'forgot') {
        await forgotPassword(formData.email);
        setSuccessMessage('Password reset link has been sent to your email.');
        // For demo purposes, we'll allow moving to reset view
        setTimeout(() => setView('reset'), 2000);
      } else if (view === 'reset') {
        if (formData.password !== formData.confirmPassword) {
          throw new Error('Passwords do not match');
        }
        await resetPassword(formData.email, formData.password);
        setSuccessMessage('Password has been reset successfully. You can now log in.');
        setTimeout(() => setView('login'), 2000);
      }
    } catch (err) {
      // Error is handled in context
    }
  };

  const renderForm = () => {
    switch (view) {
      case 'forgot':
        return (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-600">Email Address</label>
              <div className="relative">
                <i className="far fa-envelope absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"></i>
                <input
                  type="email"
                  required
                  className="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 outline-none transition-all"
                  placeholder="name@company.com"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                />
              </div>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-4 rounded-xl shadow-lg shadow-emerald-200 transition-all active:scale-95 disabled:opacity-70 mt-4"
            >
              {loading ? <i className="fas fa-circle-notch fa-spin"></i> : 'Send Reset Link'}
            </button>
            <button
              type="button"
              onClick={() => setView('login')}
              className="w-full text-gray-500 font-semibold py-2 hover:text-emerald-600 transition-colors"
            >
              Back to Login
            </button>
          </form>
        );
      case 'reset':
        return (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-600">New Password</label>
              <div className="relative">
                <i className="fas fa-lock absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"></i>
                <input
                  type="password"
                  required
                  className="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 outline-none transition-all"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-600">Confirm New Password</label>
              <div className="relative">
                <i className="fas fa-lock absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"></i>
                <input
                  type="password"
                  required
                  className="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 outline-none transition-all"
                  placeholder="••••••••"
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                />
              </div>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-4 rounded-xl shadow-lg shadow-emerald-200 transition-all active:scale-95 disabled:opacity-70 mt-4"
            >
              {loading ? <i className="fas fa-circle-notch fa-spin"></i> : 'Reset Password'}
            </button>
          </form>
        );
      default:
        return (
          <form onSubmit={handleSubmit} className="space-y-4">
            {view === 'register' && (
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-600">Full Name</label>
                <div className="relative">
                  <i className="far fa-user absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"></i>
                  <input
                    type="text"
                    required
                    className="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 outline-none transition-all"
                    placeholder="John Doe"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                  />
                </div>
              </div>
            )}

            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-600">Email Address</label>
              <div className="relative">
                <i className="far fa-envelope absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"></i>
                <input
                  type="email"
                  required
                  className="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 outline-none transition-all"
                  placeholder="name@company.com"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="text-sm font-semibold text-gray-600">Password</label>
                {view === 'login' && (
                  <button
                    type="button"
                    onClick={() => setView('forgot')}
                    className="text-xs text-emerald-600 hover:underline font-semibold"
                  >
                    Forgot Password?
                  </button>
                )}
              </div>
              <div className="relative">
                <i className="fas fa-lock absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"></i>
                <input
                  type="password"
                  required
                  className="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 outline-none transition-all"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-4 rounded-xl shadow-lg shadow-emerald-200 transition-all active:scale-95 disabled:opacity-70 mt-4"
            >
              {loading ? (
                <i className="fas fa-circle-notch fa-spin"></i>
              ) : (
                view === 'login' ? 'Sign In' : 'Create Account'
              )}
            </button>
          </form>
        );
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-3xl shadow-xl shadow-slate-200 border border-slate-100 overflow-hidden">
          <div className="p-8 text-center bg-emerald-600 text-white">
            <div className="inline-block p-3 bg-white bg-opacity-20 rounded-2xl mb-4">
              <Logo size={48} className="drop-shadow-sm" />
            </div>
            <h2 className="text-3xl font-bold mb-1">GastadorPeso</h2>
            <p className="opacity-80">Your financial freedom starts here</p>
          </div>

          <div className="p-8">
            <h3 className="text-xl font-bold text-slate-800 mb-6 text-center">
              {view === 'login' && 'Welcome Back'}
              {view === 'register' && 'Create Account'}
              {view === 'forgot' && 'Reset Password'}
              {view === 'reset' && 'Set New Password'}
            </h3>

            {error && (
              <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-xl text-sm flex items-center border border-red-100">
                <i className="fas fa-exclamation-circle mr-3"></i>
                {error}
              </div>
            )}

            {successMessage && (
              <div className="mb-6 p-4 bg-emerald-50 text-emerald-600 rounded-xl text-sm flex items-center border border-emerald-100">
                <i className="fas fa-check-circle mr-3"></i>
                {successMessage}
              </div>
            )}

            {renderForm()}

            {(view === 'login' || view === 'register') && (
              <div className="mt-8 pt-8 border-t border-slate-100 text-center">
                <p className="text-slate-500 text-sm">
                  {view === 'login' ? "Don't have an account?" : "Already have an account?"}
                  <button
                    onClick={() => setView(view === 'login' ? 'register' : 'login')}
                    className="ml-2 text-emerald-600 font-bold hover:underline"
                  >
                    {view === 'login' ? 'Register Now' : 'Log In'}
                  </button>
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;

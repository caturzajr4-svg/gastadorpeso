
import { Transaction, User, TransactionType } from '../types';

const STORAGE_KEYS = {
  TRANSACTIONS: 'fintrack_transactions',
  USERS: 'fintrack_users',
  CURRENT_USER: 'fintrack_auth_user'
};

// Helper to delay responses for "realism"
const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

export const api = {
  // AUTH
  async login(email: string, password: string): Promise<User> {
    await delay(600);
    const users: User[] = JSON.parse(localStorage.getItem(STORAGE_KEYS.USERS) || '[]');
    const user = users.find(u => u.email === email);
    if (!user) throw new Error('Invalid email or password');
    
    const userWithToken = { ...user, token: 'mock-jwt-token-' + Date.now() };
    localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(userWithToken));
    return userWithToken;
  },

  async register(name: string, email: string, password: string): Promise<User> {
    await delay(800);
    const users: any[] = JSON.parse(localStorage.getItem(STORAGE_KEYS.USERS) || '[]');
    if (users.find(u => u.email === email)) throw new Error('Email already registered');
    
    const newUser = { id: Date.now().toString(), name, email };
    users.push({ ...newUser, password });
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
    
    return this.login(email, password);
  },

  logout() {
    localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
  },

  async forgotPassword(email: string): Promise<void> {
    await delay(1000);
    const users: any[] = JSON.parse(localStorage.getItem(STORAGE_KEYS.USERS) || '[]');
    const user = users.find(u => u.email === email);
    if (!user) throw new Error('Email not found');
    
    // In a real app, we would send an email with a token.
    // Here we'll just simulate it.
    console.log(`Password reset link sent to ${email}`);
  },

  async resetPassword(email: string, newPassword: string): Promise<void> {
    await delay(1000);
    const users: any[] = JSON.parse(localStorage.getItem(STORAGE_KEYS.USERS) || '[]');
    const index = users.findIndex(u => u.email === email);
    if (index === -1) throw new Error('User not found');
    
    users[index].password = newPassword;
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
  },

  getCurrentUser(): User | null {
    const user = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
    return user ? JSON.parse(user) : null;
  },

  // TRANSACTIONS
  async getTransactions(userId: string): Promise<Transaction[]> {
    await delay(400);
    const transactions: Transaction[] = JSON.parse(localStorage.getItem(STORAGE_KEYS.TRANSACTIONS) || '[]');
    return transactions
      .filter(t => t.userId === userId)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  },

  async addTransaction(data: Omit<Transaction, 'id' | 'createdAt'>): Promise<Transaction> {
    await delay(300);
    const transactions: Transaction[] = JSON.parse(localStorage.getItem(STORAGE_KEYS.TRANSACTIONS) || '[]');
    const newTransaction: Transaction = {
      ...data,
      id: Date.now().toString(),
      createdAt: new Date().toISOString()
    };
    transactions.push(newTransaction);
    localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(transactions));
    return newTransaction;
  },

  async updateTransaction(id: string, data: Partial<Transaction>): Promise<Transaction> {
    await delay(300);
    const transactions: Transaction[] = JSON.parse(localStorage.getItem(STORAGE_KEYS.TRANSACTIONS) || '[]');
    const index = transactions.findIndex(t => t.id === id);
    if (index === -1) throw new Error('Transaction not found');
    
    transactions[index] = { ...transactions[index], ...data };
    localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(transactions));
    return transactions[index];
  },

  async deleteTransaction(id: string): Promise<void> {
    await delay(300);
    const transactions: Transaction[] = JSON.parse(localStorage.getItem(STORAGE_KEYS.TRANSACTIONS) || '[]');
    const filtered = transactions.filter(t => t.id !== id);
    localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(filtered));
  }
};

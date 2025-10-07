'use client';

import React, { useState } from 'react';
import { 
  CreditCard, 
  DollarSign, 
  TrendingUp, 
  TrendingDown,
  CheckCircle,
  XCircle,
  Clock,
  Settings,
  Plus,
  Edit,
  Eye,
  BarChart3,
  Shield,
  Zap,
  Trash2
} from 'lucide-react';

interface PaymentMethod {
  id: string;
  name: string;
  type: 'credit_card' | 'paypal' | 'stripe' | 'apple_pay' | 'google_pay' | 'bank_transfer';
  status: 'active' | 'inactive' | 'pending';
  processingFee: number;
  setupFee: number;
  description: string;
  supportedCurrencies: string[];
  isDefault: boolean;
}

interface Transaction {
  id: string;
  orderId: string;
  amount: number;
  currency: string;
  method: string;
  status: 'completed' | 'pending' | 'failed' | 'refunded';
  date: string;
  customerEmail: string;
  fee: number;
}

export default function AdminPayments() {
  const [activeTab, setActiveTab] = useState('methods');
  const [showCreateModal, setShowCreateModal] = useState(false);
  
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([
    {
      id: '1',
      name: 'Credit Card (Stripe)',
      type: 'stripe',
      status: 'active',
      processingFee: 2.9,
      setupFee: 0,
      description: 'Accept all major credit cards',
      supportedCurrencies: ['USD', 'EUR', 'GBP'],
      isDefault: true
    },
    {
      id: '2',
      name: 'PayPal',
      type: 'paypal',
      status: 'active',
      processingFee: 3.4,
      setupFee: 0,
      description: 'PayPal Express Checkout',
      supportedCurrencies: ['USD', 'EUR', 'GBP', 'CAD'],
      isDefault: false
    },
    {
      id: '3',
      name: 'Apple Pay',
      type: 'apple_pay',
      status: 'active',
      processingFee: 2.9,
      setupFee: 0,
      description: 'Apple Pay integration',
      supportedCurrencies: ['USD', 'EUR', 'GBP'],
      isDefault: false
    },
    {
      id: '4',
      name: 'Google Pay',
      type: 'google_pay',
      status: 'inactive',
      processingFee: 2.9,
      setupFee: 0,
      description: 'Google Pay integration',
      supportedCurrencies: ['USD', 'EUR', 'GBP'],
      isDefault: false
    }
  ]);

  const [transactions, setTransactions] = useState<Transaction[]>([
    {
      id: '1',
      orderId: 'ORD-001',
      amount: 129.99,
      currency: 'USD',
      method: 'Credit Card',
      status: 'completed',
      date: '2025-01-15',
      customerEmail: 'customer@example.com',
      fee: 3.77
    },
    {
      id: '2',
      orderId: 'ORD-002',
      amount: 89.50,
      currency: 'USD',
      method: 'PayPal',
      status: 'completed',
      date: '2025-01-15',
      customerEmail: 'buyer@example.com',
      fee: 3.04
    },
    {
      id: '3',
      orderId: 'ORD-003',
      amount: 45.00,
      currency: 'USD',
      method: 'Apple Pay',
      status: 'pending',
      date: '2025-01-15',
      customerEmail: 'user@example.com',
      fee: 1.31
    },
    {
      id: '4',
      orderId: 'ORD-004',
      amount: 200.00,
      currency: 'USD',
      method: 'Credit Card',
      status: 'failed',
      date: '2025-01-14',
      customerEmail: 'client@example.com',
      fee: 0
    }
  ]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300';
      case 'inactive': return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
      case 'pending': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300';
      case 'completed': return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300';
      case 'failed': return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300';
      case 'refunded': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
      case 'completed': return <CheckCircle className="w-4 h-4" />;
      case 'inactive':
      case 'failed': return <XCircle className="w-4 h-4" />;
      case 'pending': return <Clock className="w-4 h-4" />;
      case 'refunded': return <TrendingDown className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  const getMethodIcon = (type: string) => {
    switch (type) {
      case 'stripe':
      case 'credit_card': return <CreditCard className="w-4 h-4" />;
      case 'paypal': return <div className="w-4 h-4 bg-blue-500 rounded"></div>;
      case 'apple_pay': return <div className="w-4 h-4 bg-black rounded"></div>;
      case 'google_pay': return <div className="w-4 h-4 bg-green-500 rounded"></div>;
      default: return <CreditCard className="w-4 h-4" />;
    }
  };

  const totalRevenue = transactions
    .filter(t => t.status === 'completed')
    .reduce((sum, t) => sum + t.amount, 0);
  
  const totalFees = transactions
    .filter(t => t.status === 'completed')
    .reduce((sum, t) => sum + t.fee, 0);
  
  const pendingAmount = transactions
    .filter(t => t.status === 'pending')
    .reduce((sum, t) => sum + t.amount, 0);

  const tabs = [
    { id: 'methods', label: 'Payment Methods', icon: CreditCard },
    { id: 'transactions', label: 'Transactions', icon: BarChart3 },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <div className="p-4 sm:p-6">
      {/* Header */}
      <div className="mb-4 sm:mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">Payment Management</h1>
            <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">Manage payment methods and transactions</p>
          </div>
          <button 
            onClick={() => setShowCreateModal(true)}
            className="flex items-center justify-center space-x-2 px-3 sm:px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm sm:text-base"
          >
            <Plus className="w-4 h-4" />
            <span>Add Method</span>
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
        <div className="bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 transition-colors duration-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-400">Total Revenue</p>
              <p className="text-lg sm:text-2xl font-bold text-gray-900 dark:text-white">${totalRevenue.toLocaleString()}</p>
            </div>
            <DollarSign className="w-6 h-6 sm:w-8 sm:h-8 text-green-500" />
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 transition-colors duration-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-400">Processing Fees</p>
              <p className="text-lg sm:text-2xl font-bold text-gray-900 dark:text-white">${totalFees.toFixed(2)}</p>
            </div>
            <TrendingUp className="w-6 h-6 sm:w-8 sm:h-8 text-blue-500" />
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 transition-colors duration-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-400">Pending</p>
              <p className="text-lg sm:text-2xl font-bold text-gray-900 dark:text-white">${pendingAmount.toFixed(2)}</p>
            </div>
            <Clock className="w-6 h-6 sm:w-8 sm:h-8 text-yellow-500" />
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 transition-colors duration-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-400">Active Methods</p>
              <p className="text-lg sm:text-2xl font-bold text-gray-900 dark:text-white">
                {paymentMethods.filter(m => m.status === 'active').length}
              </p>
            </div>
            <Shield className="w-6 h-6 sm:w-8 sm:h-8 text-purple-500" />
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="mb-4 sm:mb-6">
        <div className="border-b border-gray-200 dark:border-gray-700">
          <nav className="-mb-px flex flex-wrap space-x-2 sm:space-x-8">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center py-2 px-1 sm:px-1 border-b-2 font-medium text-xs sm:text-sm ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                      : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300'
                  }`}
                >
                  <Icon className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                  <span className="hidden sm:inline">{tab.label}</span>
                  <span className="sm:hidden">{tab.label.split(' ')[0]}</span>
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Payment Methods Tab */}
      {activeTab === 'methods' && (
        <div className="space-y-6">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 transition-colors duration-200">
            {/* Mobile Card Layout */}
            <div className="block sm:hidden">
              {paymentMethods.map((method) => (
                <div key={method.id} className="p-3 border-b border-gray-200 dark:border-gray-700 last:border-b-0">
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center mb-1">
                        <CreditCard className="w-3 h-3 text-gray-400 dark:text-gray-500 mr-2 flex-shrink-0" />
                        <span className="text-sm font-medium text-gray-900 dark:text-white truncate">{method.name}</span>
                        {method.isDefault && (
                          <span className="ml-2 px-1.5 py-0.5 bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300 text-xs rounded-full">
                            Default
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">{method.description}</p>
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-gray-600 dark:text-gray-300">{method.processingFee}%</span>
                        <span className={`px-2 py-0.5 rounded-full text-xs ${
                          method.status === 'active'
                            ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300'
                            : 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300'
                        }`}>
                          {method.status === 'active' ? 'Active' : 'Inactive'}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-1 ml-2">
                      <button className="p-1 text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300">
                        <Edit className="w-3 h-3" />
                      </button>
                      <button className="p-1 text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300">
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Desktop Table Layout */}
            <div className="hidden sm:block overflow-x-auto">
              <table className="w-full min-w-[500px]">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th className="px-0.5 sm:px-6 py-0.5 sm:py-3 text-left text-[7px] sm:text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Method
                    </th>
                    <th className="px-0.5 sm:px-6 py-0.5 sm:py-3 text-left text-[7px] sm:text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Processing Fee
                    </th>
                    <th className="px-0.5 sm:px-6 py-0.5 sm:py-3 text-left text-[7px] sm:text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Currencies
                    </th>
                    <th className="px-0.5 sm:px-6 py-0.5 sm:py-3 text-left text-[7px] sm:text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-0.5 sm:px-6 py-0.5 sm:py-3 text-left text-[7px] sm:text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {paymentMethods.map((method) => (
                    <tr key={method.id} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-150">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0">
                            {getMethodIcon(method.type)}
                          </div>
                          <div className="ml-4">
                            <div className="flex items-center">
                              <div className="text-sm font-medium text-gray-900 dark:text-white">{method.name}</div>
                              {method.isDefault && (
                                <span className="ml-2 inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300">
                                  Default
                                </span>
                              )}
                            </div>
                            <div className="text-sm text-gray-500 dark:text-gray-400">{method.description}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900 dark:text-white">{method.processingFee}%</div>
                        {method.setupFee > 0 && (
                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            Setup: ${method.setupFee}
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex flex-wrap gap-1">
                          {method.supportedCurrencies.map((currency) => (
                            <span key={currency} className="inline-flex px-2 py-1 text-[7px] sm:text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300 rounded">
                              {currency}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(method.status)}`}>
                          {getStatusIcon(method.status)}
                          <span className="ml-1">
                            {method.status.charAt(0).toUpperCase() + method.status.slice(1)}
                          </span>
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex items-center space-x-2">
                          <button className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 p-1">
                            <Eye className="w-4 h-4" />
                          </button>
                          <button className="text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300 p-1">
                            <Edit className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Transactions Tab */}
      {activeTab === 'transactions' && (
        <div className="space-y-6">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 transition-colors duration-200">
            {/* Mobile Card Layout */}
            <div className="block sm:hidden">
              {paymentMethods.map((method) => (
                <div key={method.id} className="p-3 border-b border-gray-200 dark:border-gray-700 last:border-b-0">
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center mb-1">
                        <CreditCard className="w-3 h-3 text-gray-400 dark:text-gray-500 mr-2 flex-shrink-0" />
                        <span className="text-sm font-medium text-gray-900 dark:text-white truncate">{method.name}</span>
                        {method.isDefault && (
                          <span className="ml-2 px-1.5 py-0.5 bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300 text-xs rounded-full">
                            Default
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">{method.description}</p>
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-gray-600 dark:text-gray-300">{method.processingFee}%</span>
                        <span className={`px-2 py-0.5 rounded-full text-xs ${
                          method.status === 'active'
                            ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300'
                            : 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300'
                        }`}>
                          {method.status === 'active' ? 'Active' : 'Inactive'}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-1 ml-2">
                      <button className="p-1 text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300">
                        <Edit className="w-3 h-3" />
                      </button>
                      <button className="p-1 text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300">
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Desktop Table Layout */}
            <div className="hidden sm:block overflow-x-auto">
              <table className="w-full min-w-[500px]">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th className="px-0.5 sm:px-6 py-0.5 sm:py-3 text-left text-[7px] sm:text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Transaction
                    </th>
                    <th className="px-0.5 sm:px-6 py-0.5 sm:py-3 text-left text-[7px] sm:text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Amount
                    </th>
                    <th className="px-0.5 sm:px-6 py-0.5 sm:py-3 text-left text-[7px] sm:text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Method
                    </th>
                    <th className="px-0.5 sm:px-6 py-0.5 sm:py-3 text-left text-[7px] sm:text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Customer
                    </th>
                    <th className="px-0.5 sm:px-6 py-0.5 sm:py-3 text-left text-[7px] sm:text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-0.5 sm:px-6 py-0.5 sm:py-3 text-left text-[7px] sm:text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-0.5 sm:px-6 py-0.5 sm:py-3 text-left text-[7px] sm:text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {transactions.map((transaction) => (
                    <tr key={transaction.id} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-150">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900 dark:text-white">{transaction.id}</div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">Order: {transaction.orderId}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                          ${transaction.amount.toFixed(2)} {transaction.currency}
                        </div>
                        {transaction.fee > 0 && (
                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            Fee: ${transaction.fee.toFixed(2)}
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900 dark:text-white">{transaction.method}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900 dark:text-white">{transaction.customerEmail}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(transaction.status)}`}>
                          {getStatusIcon(transaction.status)}
                          <span className="ml-1">
                            {transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1)}
                          </span>
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900 dark:text-white">{transaction.date}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex items-center space-x-2">
                          <button className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 p-1">
                            <Eye className="w-4 h-4" />
                          </button>
                          {transaction.status === 'completed' && (
                            <button className="text-orange-600 hover:text-orange-700 dark:text-orange-400 dark:hover:text-orange-300 p-1">
                              <TrendingDown className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Settings Tab */}
      {activeTab === 'settings' && (
        <div className="space-y-6">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 transition-colors duration-200">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Payment Settings</h3>
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Default Currency
                </label>
                <select className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                  <option value="USD">USD - US Dollar</option>
                  <option value="EUR">EUR - Euro</option>
                  <option value="GBP">GBP - British Pound</option>
                  <option value="CAD">CAD - Canadian Dollar</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Auto-capture Payments
                </label>
                <select className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                  <option value="immediate">Immediate</option>
                  <option value="manual">Manual</option>
                  <option value="on_fulfillment">On Fulfillment</option>
                </select>
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-medium text-gray-900 dark:text-white">Enable Fraud Protection</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Automatically screen transactions for fraud</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" defaultChecked />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                </label>
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-medium text-gray-900 dark:text-white">Enable 3D Secure</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Additional security for card payments</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" defaultChecked />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                </label>
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-medium text-gray-900 dark:text-white">Enable Recurring Payments</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Allow subscription and recurring billing</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                </label>
              </div>
            </div>
            
            <div className="mt-6">
              <button className="px-0.5 sm:px-6 py-0.5 sm:py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                Save Settings
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

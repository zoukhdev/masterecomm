'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useLanguage } from '../../contexts/LanguageContext';
import { apiService, Analytics } from '../../lib/api';
import { DollarSign, ShoppingCart, Users, Package, TrendingUp, AlertCircle, Tag, Truck, CreditCard, Megaphone, MessageSquare } from 'lucide-react';

interface Metric {
  title: string;
  value: string;
  change: string;
  changeType: 'positive' | 'negative';
  icon: React.ComponentType<{ className?: string }>;
  iconColor: string;
}

export default function AdminDashboard() {
  const router = useRouter();
  const [analytics, setAnalytics] = useState<Analytics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const response = await apiService.getAnalytics();
      if (response.data) {
        setAnalytics(response.data.analytics);
      }
    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  const metrics: Metric[] = [
    {
      title: 'Total Sales',
      value: `$${analytics?.totalSales?.toLocaleString() || '0'}`,
      change: '12.5%',
      changeType: 'positive',
      icon: DollarSign,
      iconColor: 'bg-green-500',
    },
    {
      title: 'Total Orders',
      value: analytics?.totalOrders?.toString() || '0',
      change: '8.2%',
      changeType: 'positive',
      icon: ShoppingCart,
      iconColor: 'bg-blue-500',
    },
    {
      title: 'Total Customers',
      value: analytics?.totalCustomers?.toString() || '0',
      change: '5.1%',
      changeType: 'positive',
      icon: Users,
      iconColor: 'bg-purple-500',
    },
    {
      title: 'Total Products',
      value: analytics?.totalProducts?.toString() || '0',
      change: '2.3%',
      changeType: 'negative',
      icon: Package,
      iconColor: 'bg-orange-500',
    },
    {
      title: 'Conversion Rate',
      value: `${analytics?.conversionRate?.toFixed(2) || '0'}%`,
      change: '0.8%',
      changeType: 'positive',
      icon: TrendingUp,
      iconColor: 'bg-teal-500',
    },
    {
      title: 'Cart Abandonment',
      value: `${analytics?.cartAbandonment || '0'}%`,
      change: '4.1%',
      changeType: 'negative',
      icon: AlertCircle,
      iconColor: 'bg-red-500',
    },
  ];

  return (
    <div className="p-4 sm:p-6">
      {/* Welcome Message */}
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 dark:from-blue-600 dark:to-purple-700 rounded-xl p-4 sm:p-6 mb-6 sm:mb-8 text-white shadow-lg">
        <h2 className="text-xl sm:text-2xl font-bold mb-2">Admin Dashboard</h2>
        <p className="text-blue-100 dark:text-blue-200 text-sm sm:text-base">Welcome to your e-commerce management center</p>
      </div>
      
      {/* Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 sm:gap-6 mb-6 sm:mb-8">
        {metrics.map((metric, index) => {
          const getNavigationPath = (title: string) => {
            switch (title) {
              case 'Total Sales': return '/admin/analytics';
              case 'Total Orders': return '/admin/orders';
              case 'Total Customers': return '/admin/customers';
              case 'Total Products': return '/admin/products';
              case 'Conversion Rate': return '/admin/analytics';
              case 'Cart Abandonment': return '/admin/analytics';
              default: return '/admin';
            }
          };

          return (
            <button
              key={index}
              onClick={() => router.push(getNavigationPath(metric.title))}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-4 sm:p-6 transition-all duration-200 hover:shadow-md hover:scale-105 cursor-pointer text-left w-full"
            >
              <div className="flex items-center justify-between">
                <div className="flex-1 min-w-0">
                  <p className="text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-400 truncate">{metric.title}</p>
                  <p className="text-lg sm:text-2xl font-bold text-gray-900 dark:text-white">{metric.value}</p>
                  <p className={`text-xs sm:text-sm ${metric.changeType === 'positive' ? 'text-green-600' : 'text-red-600'}`}>
                    {metric.change} from last month
                  </p>
                </div>
                <div className={`p-2 sm:p-3 rounded-lg ${metric.iconColor} flex-shrink-0 ml-2`}>
                  <metric.icon className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Quick Actions - Full Width */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-4 sm:p-6 mb-6 sm:mb-8">
        <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white mb-4">Quick Actions</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-10 gap-2 sm:gap-3">
          <button 
            onClick={() => router.push('/admin/products')}
            className="p-2 sm:p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-all duration-200 hover:scale-105 hover:shadow-md flex flex-col items-center space-y-1 sm:space-y-2"
          >
            <Package className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600 dark:text-blue-400" />
            <span className="text-xs font-medium text-blue-900 dark:text-blue-100 text-center">Products</span>
          </button>
          <button 
            onClick={() => router.push('/admin/orders')}
            className="p-2 sm:p-3 bg-green-50 dark:bg-green-900/20 rounded-lg hover:bg-green-100 dark:hover:bg-green-900/30 transition-all duration-200 hover:scale-105 hover:shadow-md flex flex-col items-center space-y-1 sm:space-y-2"
          >
            <ShoppingCart className="w-4 h-4 sm:w-5 sm:h-5 text-green-600 dark:text-green-400" />
            <span className="text-xs font-medium text-green-900 dark:text-green-100 text-center">Orders</span>
          </button>
          <button 
            onClick={() => router.push('/admin/customers')}
            className="p-2 sm:p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg hover:bg-purple-100 dark:hover:bg-purple-900/30 transition-all duration-200 hover:scale-105 hover:shadow-md flex flex-col items-center space-y-1 sm:space-y-2"
          >
            <Users className="w-4 h-4 sm:w-5 sm:h-5 text-purple-600 dark:text-purple-400" />
            <span className="text-xs font-medium text-purple-900 dark:text-purple-100 text-center">Customers</span>
          </button>
          <button 
            onClick={() => router.push('/admin/analytics')}
            className="p-2 sm:p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg hover:bg-orange-100 dark:hover:bg-orange-900/30 transition-all duration-200 hover:scale-105 hover:shadow-md flex flex-col items-center space-y-1 sm:space-y-2"
          >
            <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 text-orange-600 dark:text-orange-400" />
            <span className="text-xs font-medium text-orange-900 dark:text-orange-100 text-center">Analytics</span>
          </button>
          <button 
            onClick={() => router.push('/admin/inventory')}
            className="p-2 sm:p-3 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg hover:bg-indigo-100 dark:hover:bg-indigo-900/30 transition-all duration-200 hover:scale-105 hover:shadow-md flex flex-col items-center space-y-1 sm:space-y-2"
          >
            <Package className="w-4 h-4 sm:w-5 sm:h-5 text-indigo-600 dark:text-indigo-400" />
            <span className="text-xs font-medium text-indigo-900 dark:text-indigo-100 text-center">Inventory</span>
          </button>
          <button 
            onClick={() => router.push('/admin/discount-codes')}
            className="p-2 sm:p-3 bg-pink-50 dark:bg-pink-900/20 rounded-lg hover:bg-pink-100 dark:hover:bg-pink-900/30 transition-all duration-200 hover:scale-105 hover:shadow-md flex flex-col items-center space-y-1 sm:space-y-2"
          >
            <Tag className="w-4 h-4 sm:w-5 sm:h-5 text-pink-600 dark:text-pink-400" />
            <span className="text-xs font-medium text-pink-900 dark:text-pink-100 text-center">Discounts</span>
          </button>
          <button 
            onClick={() => router.push('/admin/shipping')}
            className="p-2 sm:p-3 bg-teal-50 dark:bg-teal-900/20 rounded-lg hover:bg-teal-100 dark:hover:bg-teal-900/30 transition-all duration-200 hover:scale-105 hover:shadow-md flex flex-col items-center space-y-1 sm:space-y-2"
          >
            <Truck className="w-4 h-4 sm:w-5 sm:h-5 text-teal-600 dark:text-teal-400" />
            <span className="text-xs font-medium text-teal-900 dark:text-teal-100 text-center">Shipping</span>
          </button>
          <button 
            onClick={() => router.push('/admin/payments')}
            className="p-2 sm:p-3 bg-cyan-50 dark:bg-cyan-900/20 rounded-lg hover:bg-cyan-100 dark:hover:bg-cyan-900/30 transition-all duration-200 hover:scale-105 hover:shadow-md flex flex-col items-center space-y-1 sm:space-y-2"
          >
            <CreditCard className="w-4 h-4 sm:w-5 sm:h-5 text-cyan-600 dark:text-cyan-400" />
            <span className="text-xs font-medium text-cyan-900 dark:text-cyan-100 text-center">Payments</span>
          </button>
          <button 
            onClick={() => router.push('/admin/marketing')}
            className="p-2 sm:p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg hover:bg-yellow-100 dark:hover:bg-yellow-900/30 transition-all duration-200 hover:scale-105 hover:shadow-md flex flex-col items-center space-y-1 sm:space-y-2"
          >
            <Megaphone className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-600 dark:text-yellow-400" />
            <span className="text-xs font-medium text-yellow-900 dark:text-yellow-100 text-center">Marketing</span>
          </button>
          <button 
            onClick={() => router.push('/admin/customer-service')}
            className="p-2 sm:p-3 bg-red-50 dark:bg-red-900/20 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30 transition-all duration-200 hover:scale-105 hover:shadow-md flex flex-col items-center space-y-1 sm:space-y-2"
          >
            <MessageSquare className="w-4 h-4 sm:w-5 sm:h-5 text-red-600 dark:text-red-400" />
            <span className="text-xs font-medium text-red-900 dark:text-red-100 text-center">Support</span>
          </button>
        </div>
      </div>

      {/* Analytics and Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 mb-6 sm:mb-8">
        {/* Sales Chart */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-4 sm:p-6">
          <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white mb-4">Sales Overview</h3>
          <div className="h-48 sm:h-64 flex items-end justify-between space-x-1 sm:space-x-2">
            {[65, 45, 80, 55, 70, 90, 75, 60, 85, 95, 70, 88].map((height, index) => (
              <div key={index} className="flex flex-col items-center flex-1">
                <div 
                  className="w-full bg-gradient-to-t from-blue-500 to-blue-400 rounded-t-lg transition-all duration-300 hover:from-blue-600 hover:to-blue-500"
                  style={{ height: `${height}%` }}
                ></div>
                <span className="text-xs text-gray-500 dark:text-gray-400 mt-1 sm:mt-2">
                  {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][index]}
                </span>
              </div>
            ))}
          </div>
          <div className="mt-4 flex flex-col sm:flex-row sm:justify-between text-xs sm:text-sm gap-1 sm:gap-0">
            <span className="text-gray-600 dark:text-gray-400">Total Sales: $2.4M</span>
            <span className="text-green-600 dark:text-green-400">+12.5% from last year</span>
          </div>
        </div>

        {/* Revenue Chart and Recent Activity */}
        <div className="space-y-4 sm:space-y-6">
          {/* Revenue Chart */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-4 sm:p-6">
            <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white mb-4">Revenue Trends</h3>
            <div className="h-48 sm:h-64 relative">
              {/* Line Chart */}
              <svg className="w-full h-full" viewBox="0 0 400 200">
                <defs>
                  <linearGradient id="revenueGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#10B981" stopOpacity="0.3"/>
                    <stop offset="100%" stopColor="#10B981" stopOpacity="0"/>
                  </linearGradient>
                </defs>
                <path
                  d="M 20 150 Q 60 120 100 100 T 180 80 T 260 60 T 340 40 T 380 20"
                  stroke="#10B981"
                  strokeWidth="3"
                  fill="none"
                  className="drop-shadow-sm"
                />
                <path
                  d="M 20 150 Q 60 120 100 100 T 180 80 T 260 60 T 340 40 T 380 20 L 380 200 L 20 200 Z"
                  fill="url(#revenueGradient)"
                />
                {/* Data points */}
                {[
                  { x: 20, y: 150 },
                  { x: 60, y: 120 },
                  { x: 100, y: 100 },
                  { x: 140, y: 90 },
                  { x: 180, y: 80 },
                  { x: 220, y: 70 },
                  { x: 260, y: 60 },
                  { x: 300, y: 50 },
                  { x: 340, y: 40 },
                  { x: 380, y: 20 }
                ].map((point, index) => (
                  <circle
                    key={index}
                    cx={point.x}
                    cy={point.y}
                    r="4"
                    fill="#10B981"
                    className="hover:r-6 transition-all duration-200"
                  />
                ))}
              </svg>
            </div>
            <div className="mt-4 flex flex-col sm:flex-row sm:justify-between text-xs sm:text-sm gap-1 sm:gap-0">
              <span className="text-gray-600 dark:text-gray-400">Monthly Revenue: $180K</span>
              <span className="text-green-600 dark:text-green-400">+8.2% growth</span>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-4 sm:p-6">
            <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white mb-4">Recent Activity</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-sm text-gray-600 dark:text-gray-400">New order #ORD-001 received</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span className="text-sm text-gray-600 dark:text-gray-400">Product &quot;Sony Headphones&quot; updated</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                <span className="text-sm text-gray-600 dark:text-gray-400">New customer registered</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                <span className="text-sm text-gray-600 dark:text-gray-400">Inventory low for &quot;Apple Watch&quot;</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Additional Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
        {/* Top Products */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-4 sm:p-6">
          <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white mb-4">Top Products</h3>
          <div className="space-y-4">
            {[
              { name: 'Sony Headphones', sales: 245, revenue: '$12,250' },
              { name: 'Apple Watch', sales: 189, revenue: '$9,450' },
              { name: 'Samsung Phone', sales: 156, revenue: '$7,800' },
              { name: 'Nike Shoes', sales: 134, revenue: '$2,680' },
              { name: 'MacBook Pro', sales: 98, revenue: '$19,600' }
            ].map((product, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className={`w-3 h-3 rounded-full ${
                    index === 0 ? 'bg-yellow-500' : 
                    index === 1 ? 'bg-gray-400' : 
                    index === 2 ? 'bg-orange-600' : 'bg-gray-300'
                  }`}></div>
                  <span className="text-sm font-medium text-gray-900 dark:text-white">{product.name}</span>
                </div>
                <div className="text-right">
                  <div className="text-sm font-semibold text-gray-900 dark:text-white">{product.sales} sales</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">{product.revenue}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Customer Demographics */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-4 sm:p-6">
          <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white mb-4">Customer Demographics</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600 dark:text-gray-400">Age 18-25</span>
              <div className="flex items-center space-x-2">
                <div className="w-24 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div className="bg-blue-500 h-2 rounded-full" style={{ width: '35%' }}></div>
                </div>
                <span className="text-sm font-medium text-gray-900 dark:text-white">35%</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600 dark:text-gray-400">Age 26-35</span>
              <div className="flex items-center space-x-2">
                <div className="w-24 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div className="bg-green-500 h-2 rounded-full" style={{ width: '45%' }}></div>
                </div>
                <span className="text-sm font-medium text-gray-900 dark:text-white">45%</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600 dark:text-gray-400">Age 36-45</span>
              <div className="flex items-center space-x-2">
                <div className="w-24 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div className="bg-purple-500 h-2 rounded-full" style={{ width: '15%' }}></div>
                </div>
                <span className="text-sm font-medium text-gray-900 dark:text-white">15%</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600 dark:text-gray-400">Age 46+</span>
              <div className="flex items-center space-x-2">
                <div className="w-24 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div className="bg-orange-500 h-2 rounded-full" style={{ width: '5%' }}></div>
                </div>
                <span className="text-sm font-medium text-gray-900 dark:text-white">5%</span>
              </div>
            </div>
          </div>
        </div>

        {/* Order Status */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-4 sm:p-6">
          <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white mb-4">Order Status</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                <span className="text-sm text-gray-600 dark:text-gray-400">Pending</span>
              </div>
              <span className="text-sm font-semibold text-gray-900 dark:text-white">24</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                <span className="text-sm text-gray-600 dark:text-gray-400">Processing</span>
              </div>
              <span className="text-sm font-semibold text-gray-900 dark:text-white">18</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
                <span className="text-sm text-gray-600 dark:text-gray-400">Shipped</span>
              </div>
              <span className="text-sm font-semibold text-gray-900 dark:text-white">156</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 rounded-full bg-purple-500"></div>
                <span className="text-sm text-gray-600 dark:text-gray-400">Delivered</span>
              </div>
              <span className="text-sm font-semibold text-gray-900 dark:text-white">1,234</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                <span className="text-sm text-gray-600 dark:text-gray-400">Cancelled</span>
              </div>
              <span className="text-sm font-semibold text-gray-900 dark:text-white">12</span>
            </div>
          </div>
        </div>
      </div>

      {/* System Management */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-4 sm:p-6 mb-6 sm:mb-8">
        <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white mb-4">System Management</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
          <button 
            onClick={() => router.push('/admin/management-center')}
            className="p-3 sm:p-4 bg-slate-50 dark:bg-slate-900/20 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-900/30 transition-colors"
          >
            <Users className="w-5 h-5 sm:w-6 sm:h-6 text-slate-600 dark:text-slate-400 mx-auto mb-2" />
            <span className="text-xs sm:text-sm font-medium text-slate-900 dark:text-slate-100">User Management</span>
          </button>
          <button 
            onClick={() => router.push('/admin/settings')}
            className="p-3 sm:p-4 bg-gray-50 dark:bg-gray-900/20 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-900/30 transition-colors"
          >
            <AlertCircle className="w-5 h-5 sm:w-6 sm:h-6 text-gray-600 dark:text-gray-400 mx-auto mb-2" />
            <span className="text-xs sm:text-sm font-medium text-gray-900 dark:text-gray-100">System Settings</span>
          </button>
          <button 
            onClick={() => router.push('/admin/analytics')}
            className="p-3 sm:p-4 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg hover:bg-emerald-100 dark:hover:bg-emerald-900/30 transition-colors"
          >
            <TrendingUp className="w-5 h-5 sm:w-6 sm:h-6 text-emerald-600 dark:text-emerald-400 mx-auto mb-2" />
            <span className="text-xs sm:text-sm font-medium text-emerald-900 dark:text-emerald-100">Reports</span>
          </button>
          <button 
            onClick={() => router.push('/admin/customer-service')}
            className="p-3 sm:p-4 bg-rose-50 dark:bg-rose-900/20 rounded-lg hover:bg-rose-100 dark:hover:bg-rose-900/30 transition-colors"
          >
            <MessageSquare className="w-5 h-5 sm:w-6 sm:h-6 text-rose-600 dark:text-rose-400 mx-auto mb-2" />
            <span className="text-xs sm:text-sm font-medium text-rose-900 dark:text-rose-100">Support Center</span>
          </button>
        </div>
      </div>
    </div>
  );
}

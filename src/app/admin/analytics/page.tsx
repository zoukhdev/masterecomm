'use client';

import React, { useState, useEffect } from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  TrendingDown,
  DollarSign,
  ShoppingCart,
  Users,
  Package,
  Calendar,
  Download
} from 'lucide-react';
import { apiService } from '../../../lib/api';

interface Analytics {
  totalSales: number;
  totalOrders: number;
  totalCustomers: number;
  totalProducts: number;
  conversionRate: number;
  cartAbandonment: number;
}

export default function AdminAnalytics() {
  const [analytics, setAnalytics] = useState<Analytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('30d');

  useEffect(() => {
    fetchAnalytics();
  }, [timeRange]);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
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

  // Mock data for charts (in a real app, this would come from the API)
  const salesData = [
    { month: 'Jan', sales: 45000, orders: 120 },
    { month: 'Feb', sales: 52000, orders: 135 },
    { month: 'Mar', sales: 48000, orders: 128 },
    { month: 'Apr', sales: 61000, orders: 155 },
    { month: 'May', sales: 55000, orders: 142 },
    { month: 'Jun', sales: 67000, orders: 168 },
  ];

  const categoryData = [
    { name: 'Electronics', value: 45, color: '#3B82F6' },
    { name: 'Fashion', value: 30, color: '#10B981' },
    { name: 'Home & Garden', value: 15, color: '#F59E0B' },
    { name: 'Sports', value: 10, color: '#EF4444' },
  ];

  if (loading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6">
      {/* Header */}
      <div className="mb-4 sm:mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">Analytics Dashboard</h1>
            <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">Comprehensive business insights and metrics</p>
          </div>
          <div className="flex items-center space-x-2 sm:space-x-4">
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
            >
              <option value="7d">Last 7 days</option>
              <option value="30d">Last 30 days</option>
              <option value="90d">Last 90 days</option>
              <option value="1y">Last year</option>
            </select>
            <button className="flex items-center space-x-2 px-3 sm:px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm sm:text-base">
              <Download className="w-4 h-4" />
              <span>Export</span>
            </button>
          </div>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
        <div className="bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 transition-colors duration-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-400">Total Revenue</p>
              <p className="text-lg sm:text-2xl font-bold text-gray-900 dark:text-white">
                ${analytics?.totalSales?.toLocaleString() || '0'}
              </p>
              <div className="flex items-center mt-1">
                <TrendingUp className="w-3 h-3 sm:w-4 sm:h-4 text-green-500 mr-1" />
                <span className="text-xs sm:text-sm text-green-600">+12.5%</span>
              </div>
            </div>
            <div className="p-2 sm:p-3 bg-green-100 dark:bg-green-900/20 rounded-lg">
              <DollarSign className="w-5 h-5 sm:w-6 sm:h-6 text-green-600 dark:text-green-400" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 transition-colors duration-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-400">Total Orders</p>
              <p className="text-lg sm:text-2xl font-bold text-gray-900 dark:text-white">
                {analytics?.totalOrders || '0'}
              </p>
              <div className="flex items-center mt-1">
                <TrendingUp className="w-3 h-3 sm:w-4 sm:h-4 text-green-500 mr-1" />
                <span className="text-xs sm:text-sm text-green-600">+8.2%</span>
              </div>
            </div>
            <div className="p-2 sm:p-3 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
              <ShoppingCart className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 transition-colors duration-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-400">Total Customers</p>
              <p className="text-lg sm:text-2xl font-bold text-gray-900 dark:text-white">
                {analytics?.totalCustomers || '0'}
              </p>
              <div className="flex items-center mt-1">
                <TrendingUp className="w-3 h-3 sm:w-4 sm:h-4 text-green-500 mr-1" />
                <span className="text-xs sm:text-sm text-green-600">+5.1%</span>
              </div>
            </div>
            <div className="p-2 sm:p-3 bg-purple-100 dark:bg-purple-900/20 rounded-lg">
              <Users className="w-5 h-5 sm:w-6 sm:h-6 text-purple-600 dark:text-purple-400" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 transition-colors duration-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-400">Conversion Rate</p>
              <p className="text-lg sm:text-2xl font-bold text-gray-900 dark:text-white">
                {analytics?.conversionRate?.toFixed(2) || '0'}%
              </p>
              <div className="flex items-center mt-1">
                <TrendingDown className="w-3 h-3 sm:w-4 sm:h-4 text-red-500 mr-1" />
                <span className="text-xs sm:text-sm text-red-600">-2.3%</span>
              </div>
            </div>
            <div className="p-2 sm:p-3 bg-orange-100 dark:bg-orange-900/20 rounded-lg">
              <BarChart3 className="w-5 h-5 sm:w-6 sm:h-6 text-orange-600 dark:text-orange-400" />
            </div>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 mb-6 sm:mb-8">
        {/* Sales Chart */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-4 sm:p-6 transition-colors duration-200">
          <div className="flex items-center justify-between mb-4 sm:mb-6">
            <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white">Sales Trend</h3>
            <Calendar className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
          </div>
          <div className="space-y-3 sm:space-y-4">
            {salesData.map((item, index) => (
              <div key={index} className="flex items-center justify-between">
                <span className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">{item.month}</span>
                <div className="flex items-center space-x-2 sm:space-x-4">
                  <div className="w-24 sm:w-32 bg-gray-200 dark:bg-gray-700 rounded-full h-1.5 sm:h-2">
                    <div 
                      className="bg-blue-600 h-1.5 sm:h-2 rounded-full" 
                      style={{ width: `${(item.sales / 70000) * 100}%` }}
                    ></div>
                  </div>
                  <span className="text-xs sm:text-sm font-medium text-gray-900 dark:text-white w-12 sm:w-16 text-right">
                    ${item.sales.toLocaleString()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Category Distribution */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-4 sm:p-6 transition-colors duration-200">
          <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white mb-4 sm:mb-6">Sales by Category</h3>
          <div className="space-y-3 sm:space-y-4">
            {categoryData.map((category, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center space-x-2 sm:space-x-3">
                  <div 
                    className="w-3 h-3 sm:w-4 sm:h-4 rounded-full" 
                    style={{ backgroundColor: category.color }}
                  ></div>
                  <span className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">{category.name}</span>
                </div>
                <div className="flex items-center space-x-2 sm:space-x-4">
                  <div className="w-24 sm:w-32 bg-gray-200 dark:bg-gray-700 rounded-full h-1.5 sm:h-2">
                    <div 
                      className="h-1.5 sm:h-2 rounded-full" 
                      style={{ 
                        width: `${category.value}%`,
                        backgroundColor: category.color 
                      }}
                    ></div>
                  </div>
                  <span className="text-xs sm:text-sm font-medium text-gray-900 dark:text-white w-8 sm:w-12 text-right">
                    {category.value}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Additional Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-4 sm:p-6 transition-colors duration-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-400">Average Order Value</p>
              <p className="text-lg sm:text-2xl font-bold text-gray-900 dark:text-white">
                ${analytics?.totalSales && analytics?.totalOrders ? (analytics.totalSales / analytics.totalOrders).toFixed(2) : '0'}
              </p>
            </div>
            <Package className="w-6 h-6 sm:w-8 sm:h-8 text-blue-500" />
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-4 sm:p-6 transition-colors duration-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-400">Cart Abandonment</p>
              <p className="text-lg sm:text-2xl font-bold text-gray-900 dark:text-white">
                {analytics?.cartAbandonment || '0'}%
              </p>
            </div>
            <TrendingDown className="w-6 h-6 sm:w-8 sm:h-8 text-red-500" />
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-4 sm:p-6 transition-colors duration-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-400">Total Products</p>
              <p className="text-lg sm:text-2xl font-bold text-gray-900 dark:text-white">
                {analytics?.totalProducts || '0'}
              </p>
            </div>
            <Package className="w-6 h-6 sm:w-8 sm:h-8 text-green-500" />
          </div>
        </div>
      </div>
    </div>
  );
}

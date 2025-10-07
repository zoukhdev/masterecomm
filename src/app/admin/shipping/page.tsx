'use client';

import React, { useState } from 'react';
import { 
  Truck, 
  Plus, 
  Edit, 
  Trash2, 
  MapPin,
  Clock,
  DollarSign,
  Package,
  Globe,
  Settings
} from 'lucide-react';

interface ShippingMethod {
  id: string;
  name: string;
  type: 'standard' | 'express' | 'overnight' | 'free';
  cost: number;
  estimatedDays: string;
  description: string;
  isActive: boolean;
  regions: string[];
}

interface ShippingZone {
  id: string;
  name: string;
  countries: string[];
  methods: string[];
}

export default function AdminShipping() {
  const [activeTab, setActiveTab] = useState('methods');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newMethod, setNewMethod] = useState({
    name: '',
    type: 'standard',
    cost: '',
    estimatedDays: '',
    description: '',
    isActive: true,
    regions: ['US']
  });
  
  const [shippingMethods, setShippingMethods] = useState<ShippingMethod[]>([
    {
      id: '1',
      name: 'Standard Shipping',
      type: 'standard',
      cost: 9.99,
      estimatedDays: '5-7 business days',
      description: 'Regular shipping for most items',
      isActive: true,
      regions: ['US', 'CA']
    },
    {
      id: '2',
      name: 'Express Shipping',
      type: 'express',
      cost: 19.99,
      estimatedDays: '2-3 business days',
      description: 'Faster delivery for urgent orders',
      isActive: true,
      regions: ['US', 'CA']
    },
    {
      id: '3',
      name: 'Free Shipping',
      type: 'free',
      cost: 0,
      estimatedDays: '5-7 business days',
      description: 'Free shipping on orders over $50',
      isActive: true,
      regions: ['US']
    },
    {
      id: '4',
      name: 'Overnight Delivery',
      type: 'overnight',
      cost: 39.99,
      estimatedDays: '1 business day',
      description: 'Next day delivery',
      isActive: false,
      regions: ['US']
    }
  ]);

  const [shippingZones, setShippingZones] = useState<ShippingZone[]>([
    {
      id: '1',
      name: 'United States',
      countries: ['US'],
      methods: ['1', '2', '3', '4']
    },
    {
      id: '2',
      name: 'Canada',
      countries: ['CA'],
      methods: ['1', '2']
    },
    {
      id: '3',
      name: 'International',
      countries: ['GB', 'DE', 'FR', 'AU'],
      methods: ['1']
    }
  ]);

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'standard': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300';
      case 'express': return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300';
      case 'overnight': return 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-300';
      case 'free': return 'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
    }
  };

  const handleAddMethod = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const methodData = {
        ...newMethod,
        cost: parseFloat(newMethod.cost),
        id: Date.now().toString(),
        type: newMethod.type as 'standard' | 'express' | 'overnight' | 'free'
      };
      
      setShippingMethods([...shippingMethods, methodData]);
      setShowCreateModal(false);
      setNewMethod({
        name: '',
        type: 'standard',
        cost: '',
        estimatedDays: '',
        description: '',
        isActive: true,
        regions: ['US']
      });
    } catch (error) {
      console.error('Error adding shipping method:', error);
    }
  };

  const tabs = [
    { id: 'methods', label: 'Shipping Methods', icon: Truck },
    { id: 'zones', label: 'Shipping Zones', icon: Globe },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <div className="p-4 sm:p-6">
      {/* Header */}
      <div className="mb-4 sm:mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">Shipping Management</h1>
            <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">Configure shipping methods and zones</p>
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

      {/* Shipping Methods Tab */}
      {activeTab === 'methods' && (
        <div className="space-y-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            <div className="bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 transition-colors duration-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-400">Total Methods</p>
                  <p className="text-lg sm:text-2xl font-bold text-gray-900 dark:text-white">{shippingMethods.length}</p>
                </div>
                <Truck className="w-6 h-6 sm:w-8 sm:h-8 text-blue-500" />
              </div>
            </div>
            
            <div className="bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 transition-colors duration-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-400">Active Methods</p>
                  <p className="text-lg sm:text-2xl font-bold text-gray-900 dark:text-white">
                    {shippingMethods.filter(m => m.isActive).length}
                  </p>
                </div>
                <Package className="w-6 h-6 sm:w-8 sm:h-8 text-green-500" />
              </div>
            </div>
            
            <div className="bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 transition-colors duration-200 sm:col-span-2 lg:col-span-1">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-400">Avg. Cost</p>
                  <p className="text-lg sm:text-2xl font-bold text-gray-900 dark:text-white">
                    ${(shippingMethods.reduce((sum, m) => sum + m.cost, 0) / shippingMethods.length).toFixed(2)}
                  </p>
                </div>
                <DollarSign className="w-6 h-6 sm:w-8 sm:h-8 text-purple-500" />
              </div>
            </div>
          </div>

          {/* Methods - Mobile Cards / Desktop Table */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 transition-colors duration-200">
            {/* Mobile Card Layout */}
            <div className="block sm:hidden">
              {shippingMethods.map((method) => (
                <div key={method.id} className="p-3 border-b border-gray-200 dark:border-gray-700 last:border-b-0">
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center mb-1">
                        <Truck className="w-3 h-3 text-gray-400 dark:text-gray-500 mr-2 flex-shrink-0" />
                        <span className="text-sm font-medium text-gray-900 dark:text-white truncate">{method.name}</span>
                      </div>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">{method.description}</p>
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-gray-600 dark:text-gray-300">${method.cost}</span>
                        <span className={`px-2 py-0.5 rounded-full text-xs ${
                          method.isActive 
                            ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300'
                            : 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300'
                        }`}>
                          {method.isActive ? 'Active' : 'Inactive'}
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
                    <th className="hidden sm:table-cell px-0.5 sm:px-6 py-0.5 sm:py-3 text-left text-[7px] sm:text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Type
                    </th>
                    <th className="px-0.5 sm:px-6 py-0.5 sm:py-3 text-left text-[7px] sm:text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Cost
                    </th>
                    <th className="hidden md:table-cell px-0.5 sm:px-6 py-0.5 sm:py-3 text-left text-[7px] sm:text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Delivery Time
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
                  {shippingMethods.map((method) => (
                    <tr key={method.id} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-150">
                      <td className="px-3 sm:px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <Truck className="w-3 h-3 sm:w-4 sm:h-4 text-gray-400 dark:text-gray-500 mr-2 sm:mr-3" />
                          <div>
                            <div className="text-xs sm:text-sm font-medium text-gray-900 dark:text-white">{method.name}</div>
                            <div className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">{method.description}</div>
                            <div className="sm:hidden text-xs text-gray-500 dark:text-gray-400">
                              {method.type.charAt(0).toUpperCase() + method.type.slice(1)}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="hidden sm:table-cell px-3 sm:px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getTypeColor(method.type)}`}>
                          {method.type.charAt(0).toUpperCase() + method.type.slice(1)}
                        </span>
                      </td>
                      <td className="px-3 sm:px-6 py-4 whitespace-nowrap">
                        <div className="text-xs sm:text-sm font-medium text-gray-900 dark:text-white">
                          {method.cost === 0 ? 'Free' : `$${method.cost}`}
                        </div>
                      </td>
                      <td className="hidden md:table-cell px-3 sm:px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <Clock className="w-3 h-3 sm:w-4 sm:h-4 text-gray-400 mr-1 sm:mr-2" />
                          <span className="text-xs sm:text-sm text-gray-900 dark:text-white">{method.estimatedDays}</span>
                        </div>
                      </td>
                      <td className="px-3 sm:px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          method.isActive 
                            ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300'
                            : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
                        }`}>
                          {method.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex items-center space-x-1 sm:space-x-2">
                          <button className="text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300 p-1">
                            <Edit className="w-3 h-3 sm:w-4 sm:h-4" />
                          </button>
                          <button className="text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 p-1">
                            <Trash2 className="w-3 h-3 sm:w-4 sm:h-4" />
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

      {/* Shipping Zones Tab */}
      {activeTab === 'zones' && (
        <div className="space-y-6">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 transition-colors duration-200">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Shipping Zones</h3>
              <button className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                <Plus className="w-4 h-4" />
                <span>Add Zone</span>
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {shippingZones.map((zone) => (
                <div key={zone.id} className="border border-gray-200 dark:border-gray-600 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-medium text-gray-900 dark:text-white">{zone.name}</h4>
                    <div className="flex space-x-2">
                      <button className="text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300">
                        <Edit className="w-4 h-4" />
                      </button>
                      <button className="text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center">
                      <Globe className="w-4 h-4 text-gray-400 mr-2" />
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        {zone.countries.length} countries
                      </span>
                    </div>
                    <div className="flex items-center">
                      <Truck className="w-4 h-4 text-gray-400 mr-2" />
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        {zone.methods.length} shipping methods
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Settings Tab */}
      {activeTab === 'settings' && (
        <div className="space-y-6">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 transition-colors duration-200">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Shipping Settings</h3>
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Default Shipping Method
                </label>
                <select className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                  <option value="1">Standard Shipping</option>
                  <option value="2">Express Shipping</option>
                  <option value="3">Free Shipping</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Free Shipping Threshold
                </label>
                <input
                  type="number"
                  placeholder="50"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-medium text-gray-900 dark:text-white">Enable Real-time Shipping Rates</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Calculate shipping costs based on carrier APIs</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                </label>
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-medium text-gray-900 dark:text-white">Allow Backorders</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Allow customers to order out-of-stock items</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                </label>
              </div>
            </div>
            
            <div className="mt-6">
              <button className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                Save Settings
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Method Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Add New Shipping Method</h3>
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 text-2xl"
                >
                  ×
                </button>
              </div>
              
              <form onSubmit={handleAddMethod} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Method Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={newMethod.name}
                      onChange={(e) => setNewMethod({...newMethod, name: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter method name"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Type *
                    </label>
                    <select
                      required
                      value={newMethod.type}
                      onChange={(e) => setNewMethod({...newMethod, type: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="standard">Standard</option>
                      <option value="express">Express</option>
                      <option value="overnight">Overnight</option>
                      <option value="free">Free</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Cost *
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      required
                      value={newMethod.cost}
                      onChange={(e) => setNewMethod({...newMethod, cost: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="0.00"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Estimated Days *
                    </label>
                    <input
                      type="text"
                      required
                      value={newMethod.estimatedDays}
                      onChange={(e) => setNewMethod({...newMethod, estimatedDays: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="e.g., 5-7 business days"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Description *
                  </label>
                  <textarea
                    required
                    rows={3}
                    value={newMethod.description}
                    onChange={(e) => setNewMethod({...newMethod, description: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter method description"
                  />
                </div>
                
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="isActive"
                    checked={newMethod.isActive}
                    onChange={(e) => setNewMethod({...newMethod, isActive: e.target.checked})}
                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                  />
                  <label htmlFor="isActive" className="ml-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                    Active
                  </label>
                </div>
                
                <div className="flex space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowCreateModal(false)}
                    className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Add Method
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

'use client';

import React, { useState } from 'react';
import { 
  Users, 
  Settings, 
  Shield, 
  Activity,
  UserPlus,
  UserCheck,
  UserX,
  Crown,
  Key,
  Bell,
  Mail,
  Calendar,
  BarChart3,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Clock,
  Edit,
  Trash2,
  Eye,
  Plus
} from 'lucide-react';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'owner' | 'developer' | 'inventory_manager' | 'marketing_manager' | 'staff';
  status: 'active' | 'inactive' | 'pending';
  lastLogin: string;
  permissions: string[];
  department: string;
  joinDate: string;
}

interface ActivityLog {
  id: string;
  user: string;
  action: string;
  resource: string;
  timestamp: string;
  ip: string;
  status: 'success' | 'failed' | 'warning';
}

interface SystemAlert {
  id: string;
  type: 'security' | 'performance' | 'maintenance' | 'error';
  title: string;
  message: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  timestamp: string;
  status: 'active' | 'resolved' | 'dismissed';
}

export default function AdminManagementCenter() {
  const [activeTab, setActiveTab] = useState('users');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showRoleManagementModal, setShowRoleManagementModal] = useState(false);
  const [newUser, setNewUser] = useState({
    name: '',
    email: '',
    role: 'staff',
    department: '',
    permissions: [] as string[]
  });

  const [rolePermissions, setRolePermissions] = useState({
    owner: {
      name: 'Owner',
      description: 'Full system access and control',
      permissions: {
        all: true,
        users: true,
        products: true,
        orders: true,
        customers: true,
        inventory: true,
        marketing: true,
        analytics: true,
        shipping: true,
        payments: true,
        settings: true,
        reports: true
      }
    },
    developer: {
      name: 'Developer',
      description: 'Technical and system management access',
      permissions: {
        all: false,
        users: true,
        products: true,
        orders: true,
        customers: true,
        inventory: true,
        marketing: true,
        analytics: true,
        shipping: false,
        payments: false,
        settings: true,
        reports: true
      }
    },
    inventory_manager: {
      name: 'Inventory Manager',
      description: 'Product and inventory management',
      permissions: {
        all: false,
        users: false,
        products: true,
        orders: true,
        customers: false,
        inventory: true,
        marketing: false,
        analytics: false,
        shipping: false,
        payments: false,
        settings: false,
        reports: false
      }
    },
    marketing_manager: {
      name: 'Marketing Manager',
      description: 'Marketing and customer analytics access',
      permissions: {
        all: false,
        users: false,
        products: false,
        orders: false,
        customers: true,
        inventory: false,
        marketing: true,
        analytics: true,
        shipping: false,
        payments: false,
        settings: false,
        reports: true
      }
    },
    staff: {
      name: 'Staff',
      description: 'Basic customer service access',
      permissions: {
        all: false,
        users: false,
        products: false,
        orders: true,
        customers: true,
        inventory: false,
        marketing: false,
        analytics: false,
        shipping: false,
        payments: false,
        settings: false,
        reports: false
      }
    }
  });
  
  const [users, setUsers] = useState<User[]>([
    {
      id: '1',
      name: 'Sarah Johnson',
      email: 'sarah@eshop.com',
      role: 'owner',
      status: 'active',
      lastLogin: '2025-01-15 14:30',
      permissions: ['all'],
      department: 'Administration',
      joinDate: '2024-01-15'
    },
    {
      id: '2',
      name: 'Mike Wilson',
      email: 'mike@eshop.com',
      role: 'developer',
      status: 'active',
      lastLogin: '2025-01-15 13:45',
      permissions: ['orders', 'products', 'customers', 'analytics'],
      department: 'Development',
      joinDate: '2024-03-20'
    },
    {
      id: '3',
      name: 'Lisa Chen',
      email: 'lisa@eshop.com',
      role: 'inventory_manager',
      status: 'active',
      lastLogin: '2025-01-15 12:20',
      permissions: ['products', 'inventory', 'orders'],
      department: 'Inventory',
      joinDate: '2024-06-10'
    },
    {
      id: '4',
      name: 'David Lee',
      email: 'david@eshop.com',
      role: 'marketing_manager',
      status: 'active',
      lastLogin: '2025-01-15 11:15',
      permissions: ['marketing', 'analytics', 'customers'],
      department: 'Marketing',
      joinDate: '2024-08-05'
    },
    {
      id: '5',
      name: 'Emma Davis',
      email: 'emma@eshop.com',
      role: 'staff',
      status: 'active',
      lastLogin: '2025-01-15 10:30',
      permissions: ['orders', 'customers'],
      department: 'Customer Service',
      joinDate: '2024-09-15'
    }
  ]);

  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>([
    {
      id: '1',
      user: 'Sarah Johnson',
      action: 'Login',
      resource: 'Admin Dashboard',
      timestamp: '2025-01-15 14:30:25',
      ip: '192.168.1.100',
      status: 'success'
    },
    {
      id: '2',
      user: 'Mike Wilson',
      action: 'Update Order',
      resource: 'Order #12345',
      timestamp: '2025-01-15 14:25:10',
      ip: '192.168.1.101',
      status: 'success'
    },
    {
      id: '3',
      user: 'Unknown',
      action: 'Failed Login',
      resource: 'Admin Dashboard',
      timestamp: '2025-01-15 14:20:45',
      ip: '203.0.113.1',
      status: 'failed'
    },
    {
      id: '4',
      user: 'Lisa Chen',
      action: 'Delete Product',
      resource: 'Product #67890',
      timestamp: '2025-01-15 14:15:30',
      ip: '192.168.1.102',
      status: 'warning'
    }
  ]);

  const [systemAlerts, setSystemAlerts] = useState<SystemAlert[]>([
    {
      id: '1',
      type: 'security',
      title: 'Multiple Failed Login Attempts',
      message: 'Detected 5 failed login attempts from IP 203.0.113.1',
      severity: 'high',
      timestamp: '2025-01-15 14:20:00',
      status: 'active'
    },
    {
      id: '2',
      type: 'performance',
      title: 'High Server Load',
      message: 'Server CPU usage is above 80% for the last 10 minutes',
      severity: 'medium',
      timestamp: '2025-01-15 14:10:00',
      status: 'active'
    },
    {
      id: '3',
      type: 'maintenance',
      title: 'Scheduled Maintenance',
      message: 'Database maintenance scheduled for tonight at 2 AM',
      severity: 'low',
      timestamp: '2025-01-15 10:00:00',
      status: 'active'
    }
  ]);

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'owner': return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300';
      case 'developer': return 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-300';
      case 'inventory_manager': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300';
      case 'marketing_manager': return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300';
      case 'staff': return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
    }
  };

  const getRolePermissions = (role: string) => {
    switch (role) {
      case 'owner': return ['all'];
      case 'developer': return ['orders', 'products', 'customers', 'analytics', 'inventory', 'marketing'];
      case 'inventory_manager': return ['products', 'inventory', 'orders'];
      case 'marketing_manager': return ['marketing', 'analytics', 'customers'];
      case 'staff': return ['orders', 'customers'];
      default: return [];
    }
  };

  const handleAddUser = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const userData = {
        ...newUser,
        id: Date.now().toString(),
        status: 'active' as const,
        lastLogin: 'Never',
        permissions: getRolePermissions(newUser.role),
        joinDate: new Date().toISOString().split('T')[0],
        role: newUser.role as 'owner' | 'developer' | 'inventory_manager' | 'marketing_manager' | 'staff'
      };
      
      setUsers([...users, userData]);
      setShowCreateModal(false);
      setNewUser({
        name: '',
        email: '',
        role: 'staff',
        department: '',
        permissions: []
      });
    } catch (error) {
      console.error('Error adding user:', error);
    }
  };

  const handlePermissionToggle = (role: string, permission: string) => {
    setRolePermissions(prev => {
      const rolePermissions = prev[role as keyof typeof prev];
      if (!rolePermissions) return prev;
      
      const permissions = rolePermissions.permissions as Record<string, boolean>;
      
      return {
        ...prev,
        [role]: {
          ...rolePermissions,
          permissions: {
            ...rolePermissions.permissions,
            [permission]: !permissions[permission]
          }
        }
      };
    });
  };

  const handleSaveRolePermissions = () => {
    // In a real app, this would save to the backend
    console.log('Role permissions saved:', rolePermissions);
    setShowRoleManagementModal(false);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300';
      case 'inactive': return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
      case 'pending': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300';
      case 'success': return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300';
      case 'failed': return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300';
      case 'warning': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300';
      case 'high': return 'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-300';
      case 'medium': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300';
      case 'low': return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
      case 'success': return <CheckCircle className="w-4 h-4" />;
      case 'inactive':
      case 'failed': return <UserX className="w-4 h-4" />;
      case 'pending': return <Clock className="w-4 h-4" />;
      case 'warning': return <AlertTriangle className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  const activeUsers = users.filter(u => u.status === 'active').length;
  const totalUsers = users.length;
  const activeAlerts = systemAlerts.filter(a => a.status === 'active').length;
  const recentActivities = activityLogs.filter(a => {
    const logTime = new Date(a.timestamp);
    const now = new Date();
    const diffHours = (now.getTime() - logTime.getTime()) / (1000 * 60 * 60);
    return diffHours <= 24;
  }).length;

  const tabs = [
    { id: 'users', label: 'User Management', icon: Users },
    { id: 'activity', label: 'Activity Logs', icon: Activity },
    { id: 'alerts', label: 'System Alerts', icon: AlertTriangle },
    { id: 'settings', label: 'System Settings', icon: Settings },
  ];

  return (
    <div className="p-4 sm:p-6">
      {/* Header */}
      <div className="mb-4 sm:mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">Management Center</h1>
            <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">System administration and user management</p>
          </div>
          <button 
            onClick={() => setShowCreateModal(true)}
            className="flex items-center justify-center space-x-2 px-3 sm:px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm sm:text-base"
          >
            <Plus className="w-4 h-4" />
            <span>Add User</span>
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
        <button 
          onClick={() => setShowRoleManagementModal(true)}
          className="bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 transition-all duration-200 hover:shadow-md hover:scale-105 cursor-pointer text-left w-full"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-400">Total Staff</p>
              <p className="text-lg sm:text-2xl font-bold text-gray-900 dark:text-white">{totalUsers}</p>
              <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">Click to manage roles</p>
            </div>
            <Users className="w-6 h-6 sm:w-8 sm:h-8 text-blue-500" />
          </div>
        </button>
        
        <div className="bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 transition-colors duration-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-400">Active Users</p>
              <p className="text-lg sm:text-2xl font-bold text-gray-900 dark:text-white">{activeUsers}</p>
            </div>
            <UserCheck className="w-6 h-6 sm:w-8 sm:h-8 text-green-500" />
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 transition-colors duration-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-400">Active Alerts</p>
              <p className="text-lg sm:text-2xl font-bold text-gray-900 dark:text-white">{activeAlerts}</p>
            </div>
            <AlertTriangle className="w-6 h-6 sm:w-8 sm:h-8 text-orange-500" />
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 transition-colors duration-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-400">Recent Activities</p>
              <p className="text-lg sm:text-2xl font-bold text-gray-900 dark:text-white">{recentActivities}</p>
            </div>
            <Activity className="w-6 h-6 sm:w-8 sm:h-8 text-purple-500" />
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

      {/* User Management Tab */}
      {activeTab === 'users' && (
        <div className="space-y-6">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 transition-colors duration-200">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[240px] sm:min-w-[320px] lg:min-w-[500px]">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th className="px-0.5 sm:px-6 py-0.5 sm:py-3 text-left text-[7px] sm:text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      User
                    </th>
                    <th className="px-0.5 sm:px-6 py-0.5 sm:py-3 text-left text-[7px] sm:text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Role
                    </th>
                    <th className="px-0.5 sm:px-6 py-0.5 sm:py-3 text-left text-[7px] sm:text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Department
                    </th>
                    <th className="px-0.5 sm:px-6 py-0.5 sm:py-3 text-left text-[7px] sm:text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-0.5 sm:px-6 py-0.5 sm:py-3 text-left text-[7px] sm:text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Last Login
                    </th>
                    <th className="px-0.5 sm:px-6 py-0.5 sm:py-3 text-left text-[7px] sm:text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {users.map((user) => (
                    <tr key={user.id} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-150">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="w-10 h-10 bg-gray-200 dark:bg-gray-600 rounded-full flex-shrink-0 flex items-center justify-center">
                            <Users className="w-5 h-5 text-gray-500" />
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900 dark:text-white">{user.name}</div>
                            <div className="text-sm text-gray-500 dark:text-gray-400">{user.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          {user.role === 'owner' && <Crown className="w-4 h-4 text-red-500 mr-2" />}
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getRoleColor(user.role)}`}>
                            {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900 dark:text-white">{user.department}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(user.status)}`}>
                          {getStatusIcon(user.status)}
                          <span className="ml-1">
                            {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
                          </span>
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900 dark:text-white">{user.lastLogin}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex items-center space-x-2">
                          <button className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 p-1">
                            <Eye className="w-4 h-4" />
                          </button>
                          <button className="text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300 p-1">
                            <Edit className="w-4 h-4" />
                          </button>
                          <button className="text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 p-1">
                            <Trash2 className="w-4 h-4" />
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

      {/* Activity Logs Tab */}
      {activeTab === 'activity' && (
        <div className="space-y-6">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 transition-colors duration-200">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[240px] sm:min-w-[320px] lg:min-w-[500px]">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th className="px-0.5 sm:px-6 py-0.5 sm:py-3 text-left text-[7px] sm:text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      User
                    </th>
                    <th className="px-0.5 sm:px-6 py-0.5 sm:py-3 text-left text-[7px] sm:text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Action
                    </th>
                    <th className="px-0.5 sm:px-6 py-0.5 sm:py-3 text-left text-[7px] sm:text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Resource
                    </th>
                    <th className="px-0.5 sm:px-6 py-0.5 sm:py-3 text-left text-[7px] sm:text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-0.5 sm:px-6 py-0.5 sm:py-3 text-left text-[7px] sm:text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      IP Address
                    </th>
                    <th className="px-0.5 sm:px-6 py-0.5 sm:py-3 text-left text-[7px] sm:text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Timestamp
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {activityLogs.map((log) => (
                    <tr key={log.id} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-150">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900 dark:text-white">{log.user}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900 dark:text-white">{log.action}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900 dark:text-white">{log.resource}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(log.status)}`}>
                          {getStatusIcon(log.status)}
                          <span className="ml-1">
                            {log.status.charAt(0).toUpperCase() + log.status.slice(1)}
                          </span>
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900 dark:text-white">{log.ip}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900 dark:text-white">{log.timestamp}</div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* System Alerts Tab */}
      {activeTab === 'alerts' && (
        <div className="space-y-6">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 transition-colors duration-200">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[240px] sm:min-w-[320px] lg:min-w-[500px]">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th className="px-0.5 sm:px-6 py-0.5 sm:py-3 text-left text-[7px] sm:text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Alert
                    </th>
                    <th className="px-0.5 sm:px-6 py-0.5 sm:py-3 text-left text-[7px] sm:text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Type
                    </th>
                    <th className="px-0.5 sm:px-6 py-0.5 sm:py-3 text-left text-[7px] sm:text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Severity
                    </th>
                    <th className="px-0.5 sm:px-6 py-0.5 sm:py-3 text-left text-[7px] sm:text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-0.5 sm:px-6 py-0.5 sm:py-3 text-left text-[7px] sm:text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Timestamp
                    </th>
                    <th className="px-0.5 sm:px-6 py-0.5 sm:py-3 text-left text-[7px] sm:text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {systemAlerts.map((alert) => (
                    <tr key={alert.id} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-150">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900 dark:text-white">{alert.title}</div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">{alert.message}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getTypeColor(alert.type)}`}>
                          {alert.type.charAt(0).toUpperCase() + alert.type.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getSeverityColor(alert.severity)}`}>
                          {alert.severity.charAt(0).toUpperCase() + alert.severity.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(alert.status)}`}>
                          {alert.status.charAt(0).toUpperCase() + alert.status.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900 dark:text-white">{alert.timestamp}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex items-center space-x-2">
                          <button className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 p-1">
                            <Eye className="w-4 h-4" />
                          </button>
                          {alert.status === 'active' && (
                            <button className="text-green-600 hover:text-green-700 dark:text-green-400 dark:hover:text-green-300 p-1">
                              <CheckCircle className="w-4 h-4" />
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

      {/* System Settings Tab */}
      {activeTab === 'settings' && (
        <div className="space-y-6">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 transition-colors duration-200">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">System Settings</h3>
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  System Name
                </label>
                <input
                  type="text"
                  defaultValue="E-Shop Management System"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Session Timeout (minutes)
                </label>
                <input
                  type="number"
                  defaultValue="30"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-medium text-gray-900 dark:text-white">Enable Two-Factor Authentication</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Require 2FA for all admin users</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                </label>
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-medium text-gray-900 dark:text-white">Enable Activity Logging</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Log all user activities for audit purposes</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" defaultChecked />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                </label>
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-medium text-gray-900 dark:text-white">Enable Email Notifications</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Send email alerts for system events</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" defaultChecked />
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

      {/* Add User Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Add New User</h3>
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 text-2xl"
                >
                  ×
                </button>
              </div>
              
              <form onSubmit={handleAddUser} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={newUser.name}
                      onChange={(e) => setNewUser({...newUser, name: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter full name"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Email *
                    </label>
                    <input
                      type="email"
                      required
                      value={newUser.email}
                      onChange={(e) => setNewUser({...newUser, email: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter email address"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Role *
                    </label>
                    <select
                      required
                      value={newUser.role}
                      onChange={(e) => setNewUser({...newUser, role: e.target.value as 'staff' | 'inventory_manager' | 'marketing_manager' | 'admin' | 'owner'})}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="staff">Staff</option>
                      <option value="inventory_manager">Inventory Manager</option>
                      <option value="marketing_manager">Marketing Manager</option>
                      <option value="developer">Developer</option>
                      <option value="owner">Owner</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Department *
                    </label>
                    <input
                      type="text"
                      required
                      value={newUser.department}
                      onChange={(e) => setNewUser({...newUser, department: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter department"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Permissions (Auto-assigned based on role)
                  </label>
                  <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      {getRolePermissions(newUser.role).map(permission => (
                        <span key={permission} className="inline-block bg-blue-100 dark:bg-blue-900/20 text-blue-800 dark:text-blue-300 px-2 py-1 rounded text-xs mr-2 mb-1">
                          {permission}
                        </span>
                      ))}
                    </div>
                  </div>
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
                    Add User
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Role Management Modal */}
      {showRoleManagementModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-6xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Role & Permission Management</h3>
                <button
                  onClick={() => setShowRoleManagementModal(false)}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 text-2xl"
                >
                  ×
                </button>
              </div>
              
              <div className="space-y-6">
                {Object.entries(rolePermissions).map(([roleKey, roleData]) => (
                  <div key={roleKey} className="border border-gray-200 dark:border-gray-700 rounded-lg p-6">
                    <div className="mb-4">
                      <h4 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
                        <span className={`w-3 h-3 rounded-full mr-3 ${getRoleColor(roleKey).split(' ')[0]}`}></span>
                        {roleData.name}
                      </h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{roleData.description}</p>
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                      {Object.entries(roleData.permissions).map(([permission, enabled]) => (
                        <div key={permission} className="flex items-center space-x-3">
                          <input
                            type="checkbox"
                            id={`${roleKey}-${permission}`}
                            checked={enabled}
                            onChange={() => handlePermissionToggle(roleKey, permission)}
                            className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                          />
                          <label 
                            htmlFor={`${roleKey}-${permission}`}
                            className="text-sm font-medium text-gray-700 dark:text-gray-300 capitalize"
                          >
                            {permission.replace('_', ' ')}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
                
                <div className="flex space-x-3 pt-4 border-t border-gray-200 dark:border-gray-700">
                  <button
                    onClick={() => setShowRoleManagementModal(false)}
                    className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSaveRolePermissions}
                    className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Save Role Permissions
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function getTypeColor(type: string) {
  switch (type) {
    case 'security': return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300';
    case 'performance': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300';
    case 'maintenance': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300';
    case 'error': return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300';
    default: return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
  }
}

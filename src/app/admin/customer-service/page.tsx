'use client';

import React, { useState } from 'react';
import { 
  MessageSquare, 
  Phone, 
  Mail, 
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  User,
  Search,
  Filter,
  Plus,
  Eye,
  Reply,
  Archive,
  Star,
  Tag,
  Calendar,
  TrendingUp
} from 'lucide-react';

interface Ticket {
  id: string;
  subject: string;
  customer: {
    name: string;
    email: string;
  };
  status: 'open' | 'in_progress' | 'resolved' | 'closed';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  category: 'technical' | 'billing' | 'shipping' | 'product' | 'general';
  assignedTo: string;
  createdAt: string;
  updatedAt: string;
  messages: number;
  tags: string[];
}

interface ChatSession {
  id: string;
  customer: {
    name: string;
    email: string;
  };
  status: 'active' | 'waiting' | 'ended';
  startedAt: string;
  lastMessage: string;
  agent: string;
  messages: number;
}

export default function AdminCustomerService() {
  const [activeTab, setActiveTab] = useState('tickets');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [showNewTicketModal, setShowNewTicketModal] = useState(false);
  const [showTicketModal, setShowTicketModal] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [newTicket, setNewTicket] = useState({
    subject: '',
    customerName: '',
    customerEmail: '',
    priority: 'medium',
    category: 'general',
    description: '',
    assignedTo: 'Unassigned'
  });
  
  const [tickets, setTickets] = useState<Ticket[]>([
    {
      id: 'TKT-001',
      subject: 'Order not delivered',
      customer: {
        name: 'John Smith',
        email: 'john@example.com'
      },
      status: 'open',
      priority: 'high',
      category: 'shipping',
      assignedTo: 'Sarah Johnson',
      createdAt: '2025-01-15',
      updatedAt: '2025-01-15',
      messages: 3,
      tags: ['urgent', 'shipping']
    },
    {
      id: 'TKT-002',
      subject: 'Payment issue with credit card',
      customer: {
        name: 'Emily Davis',
        email: 'emily@example.com'
      },
      status: 'in_progress',
      priority: 'medium',
      category: 'billing',
      assignedTo: 'Mike Wilson',
      createdAt: '2025-01-14',
      updatedAt: '2025-01-15',
      messages: 5,
      tags: ['billing', 'payment']
    },
    {
      id: 'TKT-003',
      subject: 'Product defect - iPhone case',
      customer: {
        name: 'Robert Brown',
        email: 'robert@example.com'
      },
      status: 'resolved',
      priority: 'medium',
      category: 'product',
      assignedTo: 'Lisa Chen',
      createdAt: '2025-01-13',
      updatedAt: '2025-01-14',
      messages: 4,
      tags: ['defect', 'refund']
    },
    {
      id: 'TKT-004',
      subject: 'Website login problems',
      customer: {
        name: 'Maria Garcia',
        email: 'maria@example.com'
      },
      status: 'closed',
      priority: 'low',
      category: 'technical',
      assignedTo: 'David Lee',
      createdAt: '2025-01-12',
      updatedAt: '2025-01-13',
      messages: 2,
      tags: ['technical', 'login']
    }
  ]);

  const [chatSessions, setChatSessions] = useState<ChatSession[]>([
    {
      id: 'CHAT-001',
      customer: {
        name: 'Alice Johnson',
        email: 'alice@example.com'
      },
      status: 'active',
      startedAt: '2025-01-15 14:30',
      lastMessage: 'Thank you for your help!',
      agent: 'Sarah Johnson',
      messages: 8
    },
    {
      id: 'CHAT-002',
      customer: {
        name: 'Tom Wilson',
        email: 'tom@example.com'
      },
      status: 'waiting',
      startedAt: '2025-01-15 15:45',
      lastMessage: 'I need help with my order',
      agent: 'Unassigned',
      messages: 2
    },
    {
      id: 'CHAT-003',
      customer: {
        name: 'Sarah Davis',
        email: 'sarah@example.com'
      },
      status: 'ended',
      startedAt: '2025-01-15 13:20',
      lastMessage: 'Issue resolved, thank you!',
      agent: 'Mike Wilson',
      messages: 12
    }
  ]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open': return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300';
      case 'in_progress': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300';
      case 'resolved': return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300';
      case 'closed': return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
      case 'active': return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300';
      case 'waiting': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300';
      case 'ended': return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300';
      case 'high': return 'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-300';
      case 'medium': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300';
      case 'low': return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'open': return <AlertCircle className="w-4 h-4" />;
      case 'in_progress': return <Clock className="w-4 h-4" />;
      case 'resolved': return <CheckCircle className="w-4 h-4" />;
      case 'closed': return <XCircle className="w-4 h-4" />;
      default: return <AlertCircle className="w-4 h-4" />;
    }
  };

  const filteredTickets = tickets.filter(ticket => {
    const matchesSearch = ticket.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         ticket.customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         ticket.customer.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || ticket.status === statusFilter;
    const matchesPriority = priorityFilter === 'all' || ticket.priority === priorityFilter;
    
    return matchesSearch && matchesStatus && matchesPriority;
  });

  const openTickets = tickets.filter(t => t.status === 'open').length;
  const inProgressTickets = tickets.filter(t => t.status === 'in_progress').length;
  const resolvedTickets = tickets.filter(t => t.status === 'resolved').length;
  const activeChats = chatSessions.filter(c => c.status === 'active').length;

  const handleCreateTicket = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const ticketData = {
        ...newTicket,
        id: `TKT-${Date.now().toString().slice(-6)}`,
        status: 'open' as const,
        priority: newTicket.priority as 'low' | 'medium' | 'high' | 'urgent',
        category: newTicket.category as 'technical' | 'billing' | 'shipping' | 'product' | 'general',
        assignedTo: newTicket.assignedTo,
        createdAt: new Date().toISOString().split('T')[0],
        updatedAt: new Date().toISOString().split('T')[0],
        messages: 1,
        tags: [newTicket.category],
        customer: {
          name: newTicket.customerName,
          email: newTicket.customerEmail
        }
      };
      
      setTickets([ticketData, ...tickets]);
      setShowNewTicketModal(false);
      setNewTicket({
        subject: '',
        customerName: '',
        customerEmail: '',
        priority: 'medium',
        category: 'general',
        description: '',
        assignedTo: 'Unassigned'
      });
    } catch (error) {
      console.error('Error creating ticket:', error);
    }
  };

  const handleTicketAction = (ticketId: string, action: string) => {
    setTickets(tickets.map(ticket => {
      if (ticket.id === ticketId) {
        switch (action) {
          case 'view':
            setSelectedTicket(ticket);
            setShowTicketModal(true);
            return ticket;
          case 'assign':
            return { ...ticket, assignedTo: 'Sarah Johnson' };
          case 'resolve':
            return { ...ticket, status: 'resolved' as const, updatedAt: new Date().toISOString().split('T')[0] };
          case 'close':
            return { ...ticket, status: 'closed' as const, updatedAt: new Date().toISOString().split('T')[0] };
          default:
            return ticket;
        }
      }
      return ticket;
    }));
  };

  const tabs = [
    { id: 'tickets', label: 'Support Tickets', icon: MessageSquare },
    { id: 'chats', label: 'Live Chat', icon: Phone },
    { id: 'analytics', label: 'Analytics', icon: TrendingUp },
  ];

  return (
    <div className="p-4 sm:p-6">
      {/* Header */}
      <div className="mb-4 sm:mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">Customer Service</h1>
            <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">Manage customer support and live chat</p>
          </div>
          <button 
            onClick={() => setShowNewTicketModal(true)}
            className="flex items-center justify-center space-x-2 px-3 sm:px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm sm:text-base"
          >
            <Plus className="w-4 h-4" />
            <span>New Ticket</span>
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
        <div className="bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 transition-colors duration-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-400">Open Tickets</p>
              <p className="text-lg sm:text-2xl font-bold text-gray-900 dark:text-white">{openTickets}</p>
            </div>
            <AlertCircle className="w-6 h-6 sm:w-8 sm:h-8 text-red-500" />
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 transition-colors duration-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-400">In Progress</p>
              <p className="text-lg sm:text-2xl font-bold text-gray-900 dark:text-white">{inProgressTickets}</p>
            </div>
            <Clock className="w-6 h-6 sm:w-8 sm:h-8 text-yellow-500" />
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 transition-colors duration-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-400">Resolved</p>
              <p className="text-lg sm:text-2xl font-bold text-gray-900 dark:text-white">{resolvedTickets}</p>
            </div>
            <CheckCircle className="w-6 h-6 sm:w-8 sm:h-8 text-green-500" />
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 transition-colors duration-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-400">Active Chats</p>
              <p className="text-lg sm:text-2xl font-bold text-gray-900 dark:text-white">{activeChats}</p>
            </div>
            <Phone className="w-6 h-6 sm:w-8 sm:h-8 text-blue-500" />
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

      {/* Support Tickets Tab */}
      {activeTab === 'tickets' && (
        <div className="space-y-6">
          {/* Filters */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 transition-colors duration-200">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
              <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Search tickets..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-full sm:w-64"
                  />
                </div>
                
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">All Status</option>
                  <option value="open">Open</option>
                  <option value="in_progress">In Progress</option>
                  <option value="resolved">Resolved</option>
                  <option value="closed">Closed</option>
                </select>
                
                <select
                  value={priorityFilter}
                  onChange={(e) => setPriorityFilter(e.target.value)}
                  className="px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">All Priority</option>
                  <option value="urgent">Urgent</option>
                  <option value="high">High</option>
                  <option value="medium">Medium</option>
                  <option value="low">Low</option>
                </select>
              </div>
            </div>
          </div>

          {/* Tickets Table */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 transition-colors duration-200">
            {/* Mobile Card Layout */}
            <div className="block sm:hidden">
              {tickets.map((ticket) => (
                <div key={ticket.id} className="p-3 border-b border-gray-200 dark:border-gray-700 last:border-b-0">
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center mb-1">
                        <MessageSquare className="w-3 h-3 text-gray-400 dark:text-gray-500 mr-2 flex-shrink-0" />
                        <span className="text-sm font-medium text-gray-900 dark:text-white truncate">{ticket.subject}</span>
                      </div>
                       <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">{ticket.customer.name}</p>
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-gray-600 dark:text-gray-300">#{ticket.id}</span>
                        <span className={`px-2 py-0.5 rounded-full text-xs ${
                          ticket.status === 'open'
                            ? 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300'
                            : ticket.status === 'in_progress'
                            ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300'
                            : 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300'
                        }`}>
                          {ticket.status}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-1 ml-2">
                      <button className="p-1 text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300">
                        <Eye className="w-3 h-3" />
                      </button>
                      <button className="p-1 text-green-600 hover:text-green-700 dark:text-green-400 dark:hover:text-green-300">
                        <MessageSquare className="w-3 h-3" />
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
                      Ticket
                    </th>
                    <th className="px-0.5 sm:px-6 py-0.5 sm:py-3 text-left text-[7px] sm:text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Customer
                    </th>
                    <th className="px-0.5 sm:px-6 py-0.5 sm:py-3 text-left text-[7px] sm:text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Priority
                    </th>
                    <th className="px-0.5 sm:px-6 py-0.5 sm:py-3 text-left text-[7px] sm:text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-0.5 sm:px-6 py-0.5 sm:py-3 text-left text-[7px] sm:text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Assigned To
                    </th>
                    <th className="px-0.5 sm:px-6 py-0.5 sm:py-3 text-left text-[7px] sm:text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Updated
                    </th>
                    <th className="px-0.5 sm:px-6 py-0.5 sm:py-3 text-left text-[7px] sm:text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {filteredTickets.map((ticket) => (
                    <tr key={ticket.id} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-150">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <MessageSquare className="w-4 h-4 text-gray-400 dark:text-gray-500 mr-3" />
                          <div>
                            <div className="text-sm font-medium text-gray-900 dark:text-white">{ticket.id}</div>
                            <div className="text-sm text-gray-500 dark:text-gray-400">{ticket.subject}</div>
                            <div className="flex items-center mt-1">
                              <span className="text-xs text-gray-500 dark:text-gray-400 mr-2">{ticket.category}</span>
                              {ticket.tags.map((tag, index) => (
                                <span key={index} className="inline-flex px-1 py-0.5 text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded mr-1">
                                  {tag}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <User className="w-4 h-4 text-gray-400 dark:text-gray-500 mr-2" />
                          <div>
                            <div className="text-sm font-medium text-gray-900 dark:text-white">{ticket.customer.name}</div>
                            <div className="text-sm text-gray-500 dark:text-gray-400">{ticket.customer.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getPriorityColor(ticket.priority)}`}>
                          {ticket.priority.charAt(0).toUpperCase() + ticket.priority.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(ticket.status)}`}>
                          {getStatusIcon(ticket.status)}
                          <span className="ml-1">
                            {ticket.status.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                          </span>
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900 dark:text-white">{ticket.assignedTo}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <Calendar className="w-4 h-4 text-gray-400 mr-2" />
                          <span className="text-sm text-gray-900 dark:text-white">{ticket.updatedAt}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex items-center space-x-2">
                          <button 
                            onClick={() => handleTicketAction(ticket.id, 'view')}
                            className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 p-1"
                            title="View Ticket"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => handleTicketAction(ticket.id, 'assign')}
                            className="text-green-600 hover:text-green-700 dark:text-green-400 dark:hover:text-green-300 p-1"
                            title="Assign Ticket"
                          >
                            <Reply className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => handleTicketAction(ticket.id, 'resolve')}
                            className="text-orange-600 hover:text-orange-700 dark:text-orange-400 dark:hover:text-orange-300 p-1"
                            title="Resolve Ticket"
                          >
                            <CheckCircle className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => handleTicketAction(ticket.id, 'close')}
                            className="text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300 p-1"
                            title="Close Ticket"
                          >
                            <Archive className="w-4 h-4" />
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

      {/* Live Chat Tab */}
      {activeTab === 'chats' && (
        <div className="space-y-6">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 transition-colors duration-200">
            {/* Mobile Card Layout */}
            <div className="block sm:hidden">
              {tickets.map((ticket) => (
                <div key={ticket.id} className="p-3 border-b border-gray-200 dark:border-gray-700 last:border-b-0">
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center mb-1">
                        <MessageSquare className="w-3 h-3 text-gray-400 dark:text-gray-500 mr-2 flex-shrink-0" />
                        <span className="text-sm font-medium text-gray-900 dark:text-white truncate">{ticket.subject}</span>
                      </div>
                       <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">{ticket.customer.name}</p>
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-gray-600 dark:text-gray-300">#{ticket.id}</span>
                        <span className={`px-2 py-0.5 rounded-full text-xs ${
                          ticket.status === 'open'
                            ? 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300'
                            : ticket.status === 'in_progress'
                            ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300'
                            : 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300'
                        }`}>
                          {ticket.status}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-1 ml-2">
                      <button className="p-1 text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300">
                        <Eye className="w-3 h-3" />
                      </button>
                      <button className="p-1 text-green-600 hover:text-green-700 dark:text-green-400 dark:hover:text-green-300">
                        <MessageSquare className="w-3 h-3" />
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
                      Customer
                    </th>
                    <th className="px-0.5 sm:px-6 py-0.5 sm:py-3 text-left text-[7px] sm:text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-0.5 sm:px-6 py-0.5 sm:py-3 text-left text-[7px] sm:text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Agent
                    </th>
                    <th className="px-0.5 sm:px-6 py-0.5 sm:py-3 text-left text-[7px] sm:text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Started
                    </th>
                    <th className="px-0.5 sm:px-6 py-0.5 sm:py-3 text-left text-[7px] sm:text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Messages
                    </th>
                    <th className="px-0.5 sm:px-6 py-0.5 sm:py-3 text-left text-[7px] sm:text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Last Message
                    </th>
                    <th className="px-0.5 sm:px-6 py-0.5 sm:py-3 text-left text-[7px] sm:text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {chatSessions.map((chat) => (
                    <tr key={chat.id} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-150">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <User className="w-4 h-4 text-gray-400 dark:text-gray-500 mr-3" />
                          <div>
                            <div className="text-sm font-medium text-gray-900 dark:text-white">{chat.customer.name}</div>
                            <div className="text-sm text-gray-500 dark:text-gray-400">{chat.customer.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(chat.status)}`}>
                          {chat.status.charAt(0).toUpperCase() + chat.status.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900 dark:text-white">{chat.agent}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900 dark:text-white">{chat.startedAt}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900 dark:text-white">{chat.messages}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500 dark:text-gray-400 max-w-xs truncate">
                          {chat.lastMessage}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex items-center space-x-2">
                          <button className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 p-1">
                            <Eye className="w-4 h-4" />
                          </button>
                          {chat.status === 'waiting' && (
                            <button className="text-green-600 hover:text-green-700 dark:text-green-400 dark:hover:text-green-300 p-1">
                              <User className="w-4 h-4" />
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

      {/* Analytics Tab */}
      {activeTab === 'analytics' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 transition-colors duration-200">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Ticket Categories</h3>
              <div className="space-y-4">
                {['technical', 'billing', 'shipping', 'product', 'general'].map((category) => {
                  const count = tickets.filter(t => t.category === category).length;
                  return (
                    <div key={category} className="flex items-center justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-400 capitalize">{category}</span>
                      <div className="flex items-center space-x-4">
                        <span className="text-sm text-gray-900 dark:text-white">{count}</span>
                        <div className="w-20 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                          <div 
                            className="bg-blue-600 h-2 rounded-full" 
                            style={{ width: `${(count / tickets.length) * 100}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
            
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 transition-colors duration-200">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Response Times</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Average Response Time</span>
                  <span className="text-sm font-medium text-gray-900 dark:text-white">2.5 hours</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Average Resolution Time</span>
                  <span className="text-sm font-medium text-gray-900 dark:text-white">24 hours</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Customer Satisfaction</span>
                  <span className="text-sm font-medium text-gray-900 dark:text-white">4.8/5</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* New Ticket Modal */}
      {showNewTicketModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Create New Ticket</h3>
                <button
                  onClick={() => setShowNewTicketModal(false)}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 text-2xl"
                >
                  ×
                </button>
              </div>
              
              <form onSubmit={handleCreateTicket} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Customer Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={newTicket.customerName}
                      onChange={(e) => setNewTicket({...newTicket, customerName: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter customer name"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Customer Email *
                    </label>
                    <input
                      type="email"
                      required
                      value={newTicket.customerEmail}
                      onChange={(e) => setNewTicket({...newTicket, customerEmail: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter customer email"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Priority *
                    </label>
                    <select
                      required
                      value={newTicket.priority}
                      onChange={(e) => setNewTicket({...newTicket, priority: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                      <option value="urgent">Urgent</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Category *
                    </label>
                    <select
                      required
                      value={newTicket.category}
                      onChange={(e) => setNewTicket({...newTicket, category: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="general">General</option>
                      <option value="technical">Technical</option>
                      <option value="billing">Billing</option>
                      <option value="shipping">Shipping</option>
                      <option value="product">Product</option>
                    </select>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Subject *
                  </label>
                  <input
                    type="text"
                    required
                    value={newTicket.subject}
                    onChange={(e) => setNewTicket({...newTicket, subject: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter ticket subject"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Description *
                  </label>
                  <textarea
                    required
                    rows={4}
                    value={newTicket.description}
                    onChange={(e) => setNewTicket({...newTicket, description: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter ticket description"
                  />
                </div>
                
                <div className="flex space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowNewTicketModal(false)}
                    className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Create Ticket
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Ticket Details Modal */}
      {showTicketModal && selectedTicket && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Ticket Details - {selectedTicket.id}</h3>
                <button
                  onClick={() => setShowTicketModal(false)}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 text-2xl"
                >
                  ×
                </button>
              </div>
              
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Customer Information</h4>
                    <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                      <p className="text-sm text-gray-900 dark:text-white"><strong>Name:</strong> {selectedTicket.customer.name}</p>
                      <p className="text-sm text-gray-900 dark:text-white"><strong>Email:</strong> {selectedTicket.customer.email}</p>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Ticket Information</h4>
                    <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                      <p className="text-sm text-gray-900 dark:text-white"><strong>Subject:</strong> {selectedTicket.subject}</p>
                      <p className="text-sm text-gray-900 dark:text-white"><strong>Priority:</strong> 
                        <span className={`ml-2 px-2 py-1 text-xs rounded-full ${getPriorityColor(selectedTicket.priority)}`}>
                          {selectedTicket.priority}
                        </span>
                      </p>
                      <p className="text-sm text-gray-900 dark:text-white"><strong>Status:</strong> 
                        <span className={`ml-2 px-2 py-1 text-xs rounded-full ${getStatusColor(selectedTicket.status)}`}>
                          {selectedTicket.status}
                        </span>
                      </p>
                      <p className="text-sm text-gray-900 dark:text-white"><strong>Assigned To:</strong> {selectedTicket.assignedTo}</p>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Description</h4>
                  <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                    <p className="text-sm text-gray-900 dark:text-white">{selectedTicket.subject}</p>
                  </div>
                </div>
                
                <div className="flex space-x-3">
                  <button
                    onClick={() => {
                      handleTicketAction(selectedTicket.id, 'assign');
                      setShowTicketModal(false);
                    }}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                  >
                    Assign to Me
                  </button>
                  <button
                    onClick={() => {
                      handleTicketAction(selectedTicket.id, 'resolve');
                      setShowTicketModal(false);
                    }}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Mark as Resolved
                  </button>
                  <button
                    onClick={() => {
                      handleTicketAction(selectedTicket.id, 'close');
                      setShowTicketModal(false);
                    }}
                    className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                  >
                    Close Ticket
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

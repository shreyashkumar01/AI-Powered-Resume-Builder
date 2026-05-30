import React, { useState, useEffect } from 'react';
import api from '../services/api';
import {
  FiUsers,
  FiFileText,
  FiTrendingUp,
  FiTrash2,
  FiSearch,
  FiShield,
  FiDatabase,
} from 'react-icons/fi';
import { toast } from 'react-hot-toast';
import { motion } from 'framer-motion';

export const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('analytics'); // 'analytics' or 'users'

  const fetchData = async () => {
    try {
      setLoading(true);
      
      // Fetch users list
      const usersRes = await api.get('/admin/users');
      // Fetch analytics summary
      const analyticsRes = await api.get('/admin/analytics');
      
      if (usersRes.data.success) {
        setUsers(usersRes.data.data);
      }
      if (analyticsRes.data.success) {
        setAnalytics(analyticsRes.data.data);
      }
    } catch (error) {
      console.error('Fetch Admin Data Error:', error);
      toast.error('Failed to load administrative workspace');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // User Deletion cascade handler
  const handleDeleteUser = async (id, name) => {
    if (id === users[users.length - 1]?._id) { // Safeguard checks
      // Simple warning
    }
    
    if (!window.confirm(`Are you sure you want to delete "${name}"? This will permanently delete their account and ALL of their resumes.`)) {
      return;
    }

    try {
      const res = await api.delete(`/admin/users/${id}`);
      if (res.data.success) {
        toast.success(`Account for ${name} removed`);
        // Refresh list
        setUsers(users.filter(u => u._id !== id));
        if (analytics) {
          setAnalytics(prev => ({
            ...prev,
            totals: {
              ...prev.totals,
              users: prev.totals.users - 1
            }
          }));
        }
      }
    } catch (error) {
      console.error('Delete User Error:', error);
      toast.error(error.response?.data?.message || 'Failed to remove user account');
    }
  };

  const filteredUsers = users.filter(u =>
    u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.role.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center text-slate-500">
        <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-4 text-xs font-semibold tracking-wider uppercase">Loading Control Panel...</p>
      </div>
    );
  }

  // Max value calculation for SVG chart scaling
  const maxGrowthCount = analytics?.growth ? Math.max(...analytics.growth.map(g => g.users), 5) : 5;
  const maxTemplateCount = analytics?.templates ? Math.max(...analytics.templates.map(t => t.count), 5) : 5;

  return (
    <div className="max-w-7xl mx-auto space-y-8 text-slate-800 dark:text-slate-100">
      
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold font-display text-slate-900 dark:text-white flex items-center space-x-2">
            <FiShield className="text-indigo-500 w-7 h-7" />
            <span>Admin Center</span>
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 font-light">
            Monitor registration metrics, templates statistics, and manage directories.
          </p>
        </div>

        {/* Tab switch control */}
        <div className="flex bg-slate-200/50 dark:bg-navy-900 p-1 rounded-xl">
          <button
            onClick={() => setActiveTab('analytics')}
            className={`px-4 py-2 rounded-lg text-xs font-semibold cursor-pointer transition-all ${
              activeTab === 'analytics'
                ? 'bg-white dark:bg-navy-800 text-indigo-600 dark:text-indigo-400 shadow-sm'
                : 'text-slate-500 dark:text-slate-400'
            }`}
          >
            Analytics Panel
          </button>
          <button
            onClick={() => setActiveTab('users')}
            className={`px-4 py-2 rounded-lg text-xs font-semibold cursor-pointer transition-all ${
              activeTab === 'users'
                ? 'bg-white dark:bg-navy-800 text-indigo-600 dark:text-indigo-400 shadow-sm'
                : 'text-slate-500 dark:text-slate-400'
            }`}
          >
            User Directory ({users.length})
          </button>
        </div>
      </div>

      {/* Analytics Tab View */}
      {activeTab === 'analytics' && analytics && (
        <div className="space-y-8">
          
          {/* Top Statistics Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="bg-white dark:bg-navy-900 p-6 rounded-2xl border border-slate-200 dark:border-navy-850 shadow-sm flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Registered System Users</p>
                <p className="text-3xl font-display font-extrabold text-indigo-600 dark:text-indigo-400 mt-2">{analytics.totals.users}</p>
              </div>
              <div className="w-12 h-12 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-500 dark:text-indigo-400 rounded-xl flex items-center justify-center">
                <FiUsers className="w-6 h-6" />
              </div>
            </div>

            <div className="bg-white dark:bg-navy-900 p-6 rounded-2xl border border-slate-200 dark:border-navy-850 shadow-sm flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Resumes Drafts</p>
                <p className="text-3xl font-display font-extrabold text-indigo-600 dark:text-indigo-400 mt-2">{analytics.totals.resumes}</p>
              </div>
              <div className="w-12 h-12 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-500 dark:text-indigo-400 rounded-xl flex items-center justify-center">
                <FiFileText className="w-6 h-6" />
              </div>
            </div>
          </div>

          {/* Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* SVG User Growth Chart */}
            <div className="bg-white dark:bg-navy-900 p-6 rounded-2xl border border-slate-200 dark:border-navy-850 shadow-sm space-y-4">
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500 flex items-center space-x-1.5">
                <FiTrendingUp className="text-indigo-500" />
                <span>Monthly User Growth</span>
              </h3>
              
              <div className="h-64 flex items-end justify-between pt-8 px-2 relative border-b border-l border-slate-100 dark:border-navy-850">
                {analytics.growth.map((item, idx) => {
                  const percentHeight = (item.users / maxGrowthCount) * 100;
                  return (
                    <div key={idx} className="flex flex-col items-center flex-grow group">
                      {/* Tooltip bar */}
                      <span className="opacity-0 group-hover:opacity-100 text-[10px] bg-slate-900 text-white rounded px-1.5 py-0.5 mb-1.5 transition-opacity font-mono">
                        {item.users}
                      </span>
                      {/* Bar segment */}
                      <div 
                        className="w-8 bg-gradient-to-t from-indigo-600 to-indigo-400 rounded-t-lg group-hover:scale-y-105 transition-all origin-bottom" 
                        style={{ height: `${Math.max(percentHeight, 4)}%` }}
                      ></div>
                      {/* Month Label */}
                      <span className="text-[10px] text-slate-400 mt-2 font-medium truncate max-w-[50px]">{item.name.split(' ')[0]}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* SVG Template Usage Popularity Chart */}
            <div className="bg-white dark:bg-navy-900 p-6 rounded-2xl border border-slate-200 dark:border-navy-850 shadow-sm space-y-4">
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500 flex items-center space-x-1.5">
                <FiDatabase className="text-indigo-500" />
                <span>Template Popularity</span>
              </h3>
              
              <div className="h-64 flex items-end justify-between pt-8 px-2 relative border-b border-l border-slate-100 dark:border-navy-850">
                {analytics.templates.map((item, idx) => {
                  const percentHeight = (item.count / maxTemplateCount) * 100;
                  return (
                    <div key={idx} className="flex flex-col items-center flex-grow group">
                      <span className="opacity-0 group-hover:opacity-100 text-[10px] bg-slate-900 text-white rounded px-1.5 py-0.5 mb-1.5 transition-opacity font-mono">
                        {item.count}
                      </span>
                      <div 
                        className="w-8 bg-gradient-to-t from-violet-600 to-violet-400 rounded-t-lg group-hover:scale-y-105 transition-all origin-bottom" 
                        style={{ height: `${Math.max(percentHeight, 4)}%` }}
                      ></div>
                      <span className="text-[10px] text-slate-400 mt-2 font-medium truncate max-w-[60px]">{item.template}</span>
                    </div>
                  );
                })}
              </div>
            </div>

          </div>

          {/* Recent Activity Table */}
          <div className="bg-white dark:bg-navy-900 rounded-2xl border border-slate-200 dark:border-navy-850 shadow-sm p-6 space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500">Recent Resume Generations</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-100 dark:border-navy-800 text-slate-400 font-semibold uppercase tracking-wider">
                    <th className="py-3 px-4">Resume Title</th>
                    <th className="py-3 px-4">Author</th>
                    <th className="py-3 px-4">Layout Selected</th>
                    <th className="py-3 px-4">Last Activity</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-navy-850">
                  {analytics.recentActivity.map((res) => (
                    <tr key={res._id} className="hover:bg-slate-50/50 dark:hover:bg-navy-800/20">
                      <td className="py-3 px-4 font-semibold text-slate-900 dark:text-slate-100">{res.title}</td>
                      <td className="py-3 px-4">
                        <p className="font-medium">{res.userName}</p>
                        <p className="text-[10px] text-slate-400">{res.userEmail}</p>
                      </td>
                      <td className="py-3 px-4 capitalize">
                        <span className="px-2 py-0.5 rounded bg-indigo-50 dark:bg-indigo-950/20 text-indigo-600 dark:text-indigo-400 font-semibold text-[10px]">
                          {res.template}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-slate-400">{new Date(res.updatedAt).toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      )}

      {/* Directory Tab View */}
      {activeTab === 'users' && (
        <div className="bg-white dark:bg-navy-900 border border-slate-200 dark:border-navy-850 rounded-2xl shadow-sm p-6 space-y-6">
          
          {/* User search bar */}
          <div className="relative max-w-md">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <FiSearch className="w-4.5 h-4.5" />
            </div>
            <input
              type="text"
              placeholder="Search directory by name, email, or role..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="block w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 dark:bg-navy-950/60 border border-slate-200 dark:border-navy-800 text-sm focus:border-indigo-500 outline-none transition-all"
            />
          </div>

          {/* User listing table */}
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-100 dark:border-navy-800 text-slate-400 font-semibold uppercase tracking-wider">
                  <th className="py-3.5 px-4">Name</th>
                  <th className="py-3.5 px-4">Email</th>
                  <th className="py-3.5 px-4">System Role</th>
                  <th className="py-3.5 px-4">Joined Date</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-navy-850">
                {filteredUsers.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-slate-400 font-light">
                      No accounts matched the query in the directory.
                    </td>
                  </tr>
                ) : (
                  filteredUsers.map((u) => (
                    <tr key={u._id} className="hover:bg-slate-50/50 dark:hover:bg-navy-800/20">
                      <td className="py-3.5 px-4 font-semibold text-slate-900 dark:text-slate-100">{u.name}</td>
                      <td className="py-3.5 px-4 font-mono">{u.email}</td>
                      <td className="py-3.5 px-4 capitalize">
                        <span className={`px-2 py-0.5 rounded font-bold text-[10px] ${
                          u.role === 'admin' 
                            ? 'bg-red-50 dark:bg-red-950/20 text-red-600' 
                            : 'bg-slate-100 dark:bg-navy-800 text-slate-600 dark:text-slate-400'
                        }`}>
                          {u.role}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-slate-400">{new Date(u.createdAt).toLocaleDateString()}</td>
                      <td className="py-3.5 px-4 text-right">
                        <button
                          onClick={() => handleDeleteUser(u._id, u.name)}
                          disabled={u.role === 'admin'}
                          className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 rounded-lg cursor-pointer transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                          title="Delete user and all their resumes"
                        >
                          <FiTrash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

    </div>
  );
};

export default AdminDashboard;

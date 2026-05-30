import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FiFileText, FiUser, FiLogOut, FiLayout } from 'react-icons/fi';
import { motion } from 'framer-motion';

export const MainLayout = ({ children }) => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-navy-950 text-slate-800 dark:text-slate-100 transition-colors duration-300">
      {/* Navbar */}
      <header className="sticky top-0 z-50 w-full glass shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-2 group">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center text-white shadow-md shadow-indigo-500/20 transform group-hover:scale-105 transition-transform duration-200">
                <FiFileText className="w-5.5 h-5.5" />
              </div>
              <span className="font-display font-bold text-xl tracking-tight bg-gradient-to-r from-indigo-600 to-violet-500 bg-clip-text text-transparent dark:from-indigo-400 dark:to-violet-400">
                ResumeAI
              </span>
            </Link>

            {/* Nav Links */}
            <nav className="hidden md:flex space-x-8 text-sm font-medium">
              <a href="#templates" className="text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                Templates
              </a>
              <a href="#features" className="text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                AI Features
              </a>
              <a href="#faq" className="text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                FAQ
              </a>
            </nav>

            {/* Actions */}
            <div className="flex items-center space-x-4">
              {isAuthenticated ? (
                <div className="flex items-center space-x-3">
                  <Link to="/dashboard">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="flex items-center space-x-2 px-4 h-10 rounded-xl text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 shadow-md shadow-indigo-500/10 cursor-pointer"
                    >
                      <FiLayout className="w-4 h-4" />
                      <span>Dashboard</span>
                    </motion.button>
                  </Link>
                  <button
                    onClick={handleLogout}
                    title="Logout"
                    className="p-2.5 rounded-xl border border-slate-200 dark:border-navy-800 text-slate-500 dark:text-slate-400 hover:text-red-500 dark:hover:text-red-400 hover:bg-red-50/50 dark:hover:bg-red-950/20 transition-all cursor-pointer"
                  >
                    <FiLogOut className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <div className="flex items-center space-x-3">
                  <Link to="/login" className="text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 px-3 py-2 transition-colors">
                    Login
                  </Link>
                  <Link to="/register">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="px-4 h-10 rounded-xl text-sm font-medium text-white bg-gradient-to-r from-indigo-600 to-violet-500 hover:from-indigo-700 hover:to-violet-600 shadow-md shadow-indigo-500/15 cursor-pointer"
                    >
                      Get Started
                    </motion.button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow">{children}</main>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 py-12 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-lg bg-indigo-500 flex items-center justify-center text-white">
                  <FiFileText className="w-4.5 h-4.5" />
                </div>
                <span className="font-display font-bold text-lg text-white">ResumeAI</span>
              </div>
              <p className="text-xs leading-relaxed text-slate-500">
                AI-powered professional resume builder. Design templates, generate polished content, and download ATS-ready PDFs in seconds.
              </p>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-white tracking-wider uppercase mb-4">Product</h4>
              <ul className="space-y-2 text-xs">
                <li><a href="#templates" className="hover:text-white transition-colors">Templates</a></li>
                <li><a href="#features" className="hover:text-white transition-colors">AI Writer</a></li>
                <li><a href="#pricing" className="hover:text-white transition-colors">Pricing</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-white tracking-wider uppercase mb-4">Resources</h4>
              <ul className="space-y-2 text-xs">
                <li><a href="#" className="hover:text-white transition-colors">Resume Writing Guide</a></li>
                <li><a href="#" className="hover:text-white transition-colors">ATS Best Practices</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-white tracking-wider uppercase mb-4">Company</h4>
              <p className="text-xs text-slate-500">
                Created by Google DeepMind Advanced AI Coding Team.
              </p>
            </div>
          </div>
          <div className="mt-12 pt-8 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center text-xs text-slate-500">
            <p>&copy; {new Date().getFullYear()} ResumeAI. All rights reserved.</p>
            <p>Empowering professionals globally.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default MainLayout;

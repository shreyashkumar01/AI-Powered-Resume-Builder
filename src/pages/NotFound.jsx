import React from 'react';
import { Link } from 'react-router-dom';
import { FiHome, FiAlertTriangle, FiArrowLeft } from 'react-icons/fi';
import { motion } from 'framer-motion';

export const NotFound = () => {
  return (
    <div className="min-h-screen bg-navy-950 flex flex-col items-center justify-center p-6 text-white text-center relative overflow-hidden">
      
      {/* Glow Effects */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-500/10 rounded-full blur-[100px] pointer-events-none"></div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="max-w-md w-full glass p-8 rounded-3xl border border-white/5 shadow-2xl relative"
      >
        <div className="w-16 h-16 rounded-2xl bg-red-500/10 flex items-center justify-center text-red-400 mx-auto mb-6">
          <FiAlertTriangle className="w-8 h-8" />
        </div>

        <h1 className="text-6xl font-display font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-indigo-400 mb-2">
          404
        </h1>
        <h2 className="text-xl font-bold font-display text-white mb-4">
          Experience Gap Detected
        </h2>
        <p className="text-sm text-slate-400 leading-relaxed font-light mb-8">
          The section or page you are looking for has either been moved, deleted, or does not exist. Our parsers couldn't find it in our system!
        </p>

        <div className="flex flex-col sm:flex-row items-center gap-4 justify-center">
          <Link to="/dashboard" className="w-full sm:w-auto">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="w-full px-6 py-2.5 rounded-xl text-xs font-semibold bg-indigo-600 hover:bg-indigo-700 text-white flex items-center justify-center space-x-2 cursor-pointer shadow-md shadow-indigo-500/25"
            >
              <FiHome className="w-4 h-4" />
              <span>Dashboard Station</span>
            </motion.button>
          </Link>
          <button
            onClick={() => window.history.back()}
            className="w-full sm:w-auto px-6 py-2.5 rounded-xl text-xs font-semibold border border-slate-800 hover:border-slate-700 bg-navy-900/50 hover:bg-navy-900 text-slate-300 flex items-center justify-center space-x-2 cursor-pointer transition-colors"
          >
            <FiArrowLeft className="w-4 h-4" />
            <span>Go Back</span>
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default NotFound;

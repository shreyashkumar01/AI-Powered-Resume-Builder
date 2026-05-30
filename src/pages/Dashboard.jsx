import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';
import {
  FiPlus,
  FiSearch,
  FiFilter,
  FiClock,
  FiTrash2,
  FiEdit,
  FiCopy,
  FiFileText,
  FiExternalLink,
} from 'react-icons/fi';
import { toast } from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';

export const Dashboard = () => {
  const [resumes, setResumes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [templateFilter, setTemplateFilter] = useState('all');
  const [sortBy, setSortBy] = useState('updated'); // 'updated', 'created', 'alpha'
  
  // Modal State
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [newResumeTitle, setNewResumeTitle] = useState('');
  const [newResumeTemplate, setNewResumeTemplate] = useState('modern');
  const [isCreating, setIsCreating] = useState(false);

  const navigate = useNavigate();

  // Fetch all user resumes
  const fetchResumes = async () => {
    try {
      setLoading(true);
      const res = await api.get('/resumes/my-resumes');
      if (res.data.success) {
        setResumes(res.data.data);
      }
    } catch (error) {
      console.error('Fetch Resumes Error:', error);
      toast.error('Failed to load resumes. Is server online?');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResumes();
  }, []);

  // Handle Delete Resume
  const handleDelete = async (id, e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!window.confirm('Are you sure you want to delete this resume? This action is permanent.')) return;

    try {
      const res = await api.delete(`/resumes/${id}`);
      if (res.data.success) {
        toast.success('Resume deleted successfully');
        setResumes(resumes.filter((r) => r._id !== id));
      }
    } catch (error) {
      console.error('Delete Resume Error:', error);
      toast.error('Failed to delete resume');
    }
  };

  // Handle Create Resume
  const handleCreate = async (e) => {
    e.preventDefault();
    if (!newResumeTitle.trim()) {
      return toast.error('Please enter a resume title');
    }

    try {
      setIsCreating(true);
      const res = await api.post('/resumes', {
        title: newResumeTitle,
        template: newResumeTemplate,
      });

      if (res.data.success) {
        toast.success('Draft initialized!');
        setCreateModalOpen(false);
        setNewResumeTitle('');
        navigate(`/builder/${res.data.data._id}`);
      }
    } catch (error) {
      console.error('Create Resume Error:', error);
      toast.error('Failed to initialize resume');
    } finally {
      setIsCreating(false);
    }
  };

  // Filter & Sort Logic
  const filteredAndSortedResumes = resumes
    .filter((resume) => {
      const matchesSearch = resume.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (resume.personalInfo?.jobTitle || '').toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesTemplate = templateFilter === 'all' || resume.template === templateFilter;
      
      return matchesSearch && matchesTemplate;
    })
    .sort((a, b) => {
      if (sortBy === 'updated') {
        return new Date(b.updatedAt) - new Date(a.updatedAt);
      }
      if (sortBy === 'created') {
        return new Date(b.createdAt) - new Date(a.createdAt);
      }
      if (sortBy === 'alpha') {
        return a.title.localeCompare(b.title);
      }
      return 0;
    });

  // Calculate Resume Completion Score (rough check on sections filled)
  const calculateCompletion = (resume) => {
    let score = 10; // Base details filled
    const info = resume.personalInfo || {};
    
    if (info.fullName) score += 10;
    if (info.email) score += 10;
    if (info.phone) score += 10;
    if (info.jobTitle) score += 10;
    if (info.summary) score += 10;
    
    if (resume.education?.length > 0) score += 15;
    if (resume.experience?.length > 0) score += 15;
    if (resume.skills?.length > 0) score += 10;

    return Math.min(score, 100);
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold font-display text-slate-900 dark:text-white">My Resumes</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 font-light">Create and customize your documents.</p>
        </div>
        <button
          onClick={() => setCreateModalOpen(true)}
          className="inline-flex items-center justify-center space-x-2 px-5 py-3 rounded-xl text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 shadow-md shadow-indigo-500/20 transition-all cursor-pointer hover:scale-[1.02] active:scale-[0.98]"
        >
          <FiPlus className="w-5 h-5" />
          <span>New Resume</span>
        </button>
      </div>

      {/* Analytics stats row */}
      {!loading && resumes.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="bg-white dark:bg-navy-900 p-6 rounded-2xl border border-slate-200 dark:border-navy-850 shadow-sm">
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Total Resumes</p>
            <p className="text-3xl font-display font-extrabold text-indigo-600 dark:text-indigo-400 mt-2">{resumes.length}</p>
          </div>
          <div className="bg-white dark:bg-navy-900 p-6 rounded-2xl border border-slate-200 dark:border-navy-850 shadow-sm">
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Favorite Template</p>
            <p className="text-xl font-display font-bold text-slate-800 dark:text-slate-200 mt-3.5 capitalize">
              {resumes.reduce((acc, curr) => {
                acc[curr.template] = (acc[curr.template] || 0) + 1;
                return acc;
              }, {})['modern'] >= 0
                ? Object.entries(
                    resumes.reduce((acc, curr) => {
                      acc[curr.template] = (acc[curr.template] || 0) + 1;
                      return acc;
                    }, {})
                  ).sort((a, b) => b[1] - a[1])[0][0]
                : 'Modern'}
            </p>
          </div>
          <div className="bg-white dark:bg-navy-900 p-6 rounded-2xl border border-slate-200 dark:border-navy-850 shadow-sm">
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Average Completion</p>
            <p className="text-3xl font-display font-extrabold text-emerald-500 mt-2">
              {Math.round(resumes.reduce((acc, curr) => acc + calculateCompletion(curr), 0) / resumes.length)}%
            </p>
          </div>
        </div>
      )}

      {/* Control Bar (Search, filter, sorting) */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-navy-900 p-4 rounded-2xl border border-slate-200 dark:border-navy-850 shadow-sm">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
            <FiSearch className="w-4.5 h-4.5" />
          </div>
          <input
            type="text"
            placeholder="Search by title or role..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="block w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 dark:bg-navy-950/60 border border-slate-200 dark:border-navy-800 text-sm focus:border-indigo-500 outline-none transition-all"
          />
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Template Filter */}
          <div className="flex items-center space-x-2">
            <FiFilter className="w-4 h-4 text-slate-400" />
            <select
              value={templateFilter}
              onChange={(e) => setTemplateFilter(e.target.value)}
              className="px-3 py-2 rounded-xl bg-slate-50 dark:bg-navy-950 border border-slate-200 dark:border-navy-800 text-xs focus:border-indigo-500 outline-none transition-all cursor-pointer capitalize"
            >
              <option value="all">All Templates</option>
              <option value="modern">Modern</option>
              <option value="ats">ATS-Friendly</option>
              <option value="corporate">Corporate</option>
              <option value="creative">Creative</option>
              <option value="minimal">Minimal</option>
            </select>
          </div>

          {/* Sorting */}
          <div className="flex items-center space-x-2">
            <FiClock className="w-4 h-4 text-slate-400" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-2 rounded-xl bg-slate-50 dark:bg-navy-950 border border-slate-200 dark:border-navy-800 text-xs focus:border-indigo-500 outline-none transition-all cursor-pointer"
            >
              <option value="updated">Latest Edited</option>
              <option value="created">Date Created</option>
              <option value="alpha">Alphabetical</option>
            </select>
          </div>
        </div>
      </div>

      {/* Resumes Grid/List Display */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((n) => (
            <div key={n} className="bg-white dark:bg-navy-900 border border-slate-200 dark:border-navy-850 p-6 rounded-2xl space-y-4 animate-pulse">
              <div className="h-4 bg-slate-200 dark:bg-navy-800 rounded w-2/3"></div>
              <div className="h-3 bg-slate-200 dark:bg-navy-800 rounded w-1/2"></div>
              <div className="pt-6 border-t border-slate-100 dark:border-navy-850 flex justify-between items-center">
                <div className="h-8 bg-slate-200 dark:bg-navy-800 rounded w-20"></div>
                <div className="h-8 bg-slate-200 dark:bg-navy-800 rounded w-10"></div>
              </div>
            </div>
          ))}
        </div>
      ) : filteredAndSortedResumes.length === 0 ? (
        <div className="bg-white dark:bg-navy-900 p-12 text-center rounded-3xl border border-slate-200 dark:border-navy-850 shadow-sm max-w-2xl mx-auto space-y-6">
          <div className="w-16 h-16 rounded-full bg-indigo-50 dark:bg-indigo-950/40 text-indigo-500 dark:text-indigo-400 flex items-center justify-center mx-auto">
            <FiFileText className="w-8 h-8" />
          </div>
          <div>
            <h3 className="text-lg font-bold font-display text-slate-800 dark:text-white">No Resumes Found</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1.5 font-light leading-relaxed max-w-sm mx-auto">
              {searchQuery || templateFilter !== 'all'
                ? "No drafts match your current search queries or filters. Try adjusting your fields!"
                : "It looks like you haven't started building any resumes yet. Click the button below to initialize a draft."}
            </p>
          </div>
          {(!searchQuery && templateFilter === 'all') && (
            <button
              onClick={() => setCreateModalOpen(true)}
              className="inline-flex items-center justify-center space-x-2 px-5 py-2.5 rounded-xl text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 shadow-md cursor-pointer"
            >
              <FiPlus className="w-4 h-4" />
              <span>Initialize First Draft</span>
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAndSortedResumes.map((resume) => {
            const completion = calculateCompletion(resume);
            return (
              <motion.div
                key={resume._id}
                layout
                whileHover={{ y: -4 }}
                className="bg-white dark:bg-navy-900 rounded-2xl border border-slate-200 dark:border-navy-850 shadow-sm hover:shadow-md hover:border-indigo-500/20 dark:hover:border-indigo-500/30 overflow-hidden flex flex-col justify-between"
              >
                {/* Visual Header */}
                <div className="p-6">
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="font-bold text-slate-800 dark:text-white group-hover:text-indigo-600 transition-colors truncate max-w-[200px]" title={resume.title}>
                      {resume.title}
                    </h3>
                    <span className="inline-flex px-2 py-0.5 rounded-full text-[10px] font-semibold bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 capitalize border border-indigo-100 dark:border-indigo-900/40">
                      {resume.template}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 font-light truncate">
                    {resume.personalInfo?.jobTitle || 'No target title set'}
                  </p>

                  {/* Completion Score */}
                  <div className="mt-6 space-y-1.5">
                    <div className="flex justify-between items-center text-[10px] font-medium text-slate-400">
                      <span>Completion Score</span>
                      <span className="font-semibold text-slate-700 dark:text-slate-300">{completion}%</span>
                    </div>
                    <div className="w-full h-1.5 rounded-full bg-slate-100 dark:bg-navy-800 overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${
                          completion < 40 ? 'bg-amber-500' : completion < 80 ? 'bg-indigo-500' : 'bg-emerald-500'
                        }`}
                        style={{ width: `${completion}%` }}
                      ></div>
                    </div>
                  </div>
                </div>

                {/* Footer Controls */}
                <div className="px-6 py-4 bg-slate-50 dark:bg-navy-900/40 border-t border-slate-100 dark:border-navy-850 flex items-center justify-between">
                  <span className="text-[10px] text-slate-400 font-light flex items-center space-x-1">
                    <FiClock className="w-3.5 h-3.5 text-slate-400" />
                    <span>Edited {new Date(resume.updatedAt).toLocaleDateString()}</span>
                  </span>
                  
                  <div className="flex items-center space-x-1">
                    <Link
                      to={`/builder/${resume._id}`}
                      className="p-2 rounded-lg text-slate-500 hover:text-indigo-600 hover:bg-slate-100 dark:hover:bg-navy-800 transition-colors"
                      title="Edit Resume"
                    >
                      <FiEdit className="w-4 h-4" />
                    </Link>
                    <button
                      onClick={(e) => handleDelete(resume._id, e)}
                      className="p-2 rounded-lg text-slate-500 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 transition-colors cursor-pointer"
                      title="Delete Resume"
                    >
                      <FiTrash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Creation Modal */}
      <AnimatePresence>
        {createModalOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              onClick={() => !isCreating && setCreateModalOpen(false)}
              className="fixed inset-0 bg-black/60 z-40 backdrop-blur-xs"
            ></motion.div>

            {/* Modal Box */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="fixed inset-0 m-auto w-full max-w-lg h-fit bg-white dark:bg-navy-900 border border-slate-200 dark:border-navy-850 shadow-2xl rounded-3xl p-6 sm:p-8 z-50 overflow-hidden text-slate-800 dark:text-white"
            >
              <h2 className="text-xl font-bold font-display mb-2">Initialize New Resume</h2>
              <p className="text-xs text-slate-400 font-light mb-6">Choose a document name and layout model to begin.</p>

              <form onSubmit={handleCreate} className="space-y-6">
                {/* Title */}
                <div>
                  <label htmlFor="modalTitle" className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                    Resume Document Name
                  </label>
                  <input
                    id="modalTitle"
                    type="text"
                    required
                    disabled={isCreating}
                    placeholder="e.g. Senior Frontend Engineer Resume"
                    value={newResumeTitle}
                    onChange={(e) => setNewResumeTitle(e.target.value)}
                    className="block w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-navy-950 border border-slate-200 dark:border-navy-800 text-sm focus:border-indigo-500 outline-none transition-all"
                  />
                </div>

                {/* Templates Selector */}
                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                    Template Design Model
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { id: 'modern', name: 'Modern', style: 'border-indigo-500' },
                      { id: 'ats', name: 'ATS Friendly', style: 'border-slate-600' },
                      { id: 'corporate', name: 'Corporate', style: 'border-blue-600' },
                      { id: 'creative', name: 'Creative', style: 'border-emerald-500' },
                      { id: 'minimal', name: 'Minimal', style: 'border-amber-500' },
                    ].map((tpl) => (
                      <button
                        key={tpl.id}
                        type="button"
                        onClick={() => setNewResumeTemplate(tpl.id)}
                        className={`p-3 rounded-xl border text-left flex flex-col justify-between h-20 transition-all cursor-pointer ${
                          newResumeTemplate === tpl.id
                            ? 'border-indigo-600 bg-indigo-50/50 dark:bg-indigo-950/20'
                            : 'border-slate-200 dark:border-navy-800 hover:border-slate-300 dark:hover:border-navy-700 bg-slate-50/50 dark:bg-navy-950/20'
                        }`}
                      >
                        <span className="text-xs font-bold">{tpl.name}</span>
                        <span className="text-[10px] text-slate-400 font-light capitalize">{tpl.id} style</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center justify-end space-x-3 pt-4 border-t border-slate-100 dark:border-navy-850">
                  <button
                    type="button"
                    disabled={isCreating}
                    onClick={() => setCreateModalOpen(false)}
                    className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-500 hover:bg-slate-100 dark:hover:bg-navy-800 cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isCreating}
                    className="px-6 py-2.5 rounded-xl text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 shadow-md shadow-indigo-500/10 cursor-pointer flex items-center justify-center"
                  >
                    {isCreating ? 'Creating Workspace...' : 'Initialize Draft'}
                  </button>
                </div>
              </form>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Dashboard;

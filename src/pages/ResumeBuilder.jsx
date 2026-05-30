import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useResume } from '../context/ResumeContext';
import {
  FiSave,
  FiDownload,
  FiZoomIn,
  FiZoomOut,
  FiRotateCcw,
  FiPlus,
  FiTrash2,
  FiArrowLeft,
  FiChevronUp,
  FiChevronDown,
  FiLayout,
  FiSliders,
  FiCheck,
} from 'react-icons/fi';
import { HiSparkles } from 'react-icons/hi';
import { toast } from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import html2pdf from 'html2pdf.js';

// Import Templates
import ModernTemplate from '../templates/ModernTemplate';
import AtsTemplate from '../templates/AtsTemplate';
import CorporateTemplate from '../templates/CorporateTemplate';
import CreativeTemplate from '../templates/CreativeTemplate';
import MinimalTemplate from '../templates/MinimalTemplate';

export const ResumeBuilder = () => {
  const { id } = useParams();
  const {
    resume,
    loading,
    saving,
    loadResume,
    updateResumeLocal,
    saveResumeManual,
    generateSummary,
    generateObjective,
    improveContent,
    suggestSkills,
  } = useResume();

  // Active form section accordion index
  const [activeSection, setActiveSection] = useState('personal');
  
  // Preview Zoom level
  const [zoom, setZoom] = useState(0.85); // Default scale

  // AI Assistant drawer/state
  const [aiAssistantOpen, setAiAssistantOpen] = useState(false);
  const [aiPrompt, setAiPrompt] = useState('');
  const [aiLoading, setAiLoading] = useState(false);
  const [suggestedSkillsList, setSuggestedSkillsList] = useState([]);

  // Load resume data on mount or ID change
  useEffect(() => {
    if (id) {
      loadResume(id);
    }
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center text-slate-500">
        <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-4 text-xs font-semibold tracking-wider uppercase">Loading Workspace...</p>
      </div>
    );
  }

  if (!resume) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center text-slate-500 max-w-sm mx-auto text-center space-y-4">
        <p className="text-sm font-light">We couldn't retrieve the requested resume. It may have been deleted, or there was a network connection error.</p>
        <Link to="/dashboard" className="px-4 py-2 bg-indigo-600 text-white rounded-xl text-xs font-semibold">
          Return to Dashboard
        </Link>
      </div>
    );
  }

  // Template Renderer Selector
  const renderActiveTemplate = () => {
    switch (resume.template) {
      case 'ats':
        return <AtsTemplate data={resume} />;
      case 'corporate':
        return <CorporateTemplate data={resume} />;
      case 'creative':
        return <CreativeTemplate data={resume} />;
      case 'minimal':
        return <MinimalTemplate data={resume} />;
      default:
        return <ModernTemplate data={resume} />;
    }
  };

  // PDF Downloader Action
  const handleDownloadPDF = () => {
    const element = document.getElementById('resume-pdf-root');
    if (!element) return toast.error('Preview element not loaded');

    toast.loading('Compiling PDF layout...', { id: 'pdf-download' });

    // Set configuration options for pixel-perfect print rendering
    const opt = {
      margin: 0,
      filename: `${resume.title.replace(/\s+/g, '_') || 'Resume'}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { 
        scale: 2, 
        useCORS: true, 
        letterRendering: true,
        logging: false
      },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };

    html2pdf()
      .set(opt)
      .from(element)
      .save()
      .then(() => {
        toast.success('Downloaded successfully!', { id: 'pdf-download' });
      })
      .catch((err) => {
        console.error('PDF Generation Error:', err);
        toast.error('Failed to compile PDF', { id: 'pdf-download' });
      });
  };

  // ==========================================
  // MULTI-ENTRY FORM UTILITY HANDLERS
  // ==========================================

  const handlePersonalInfoChange = (field, val) => {
    updateResumeLocal({
      personalInfo: {
        ...resume.personalInfo,
        [field]: val,
      },
    });
  };

  const handleArrayFieldChange = (section, index, field, val) => {
    const list = [...(resume[section] || [])];
    list[index] = { ...list[index], [field]: val };
    updateResumeLocal({ [section]: list });
  };

  const addArrayEntry = (section, templateObject) => {
    const list = [...(resume[section] || [])];
    list.push(templateObject);
    updateResumeLocal({ [section]: list });
  };

  const removeArrayEntry = (section, index) => {
    const list = [...(resume[section] || [])].filter((_, i) => i !== index);
    updateResumeLocal({ [section]: list });
  };

  // Inline AI improver button handler
  const handleImproveInlineText = async (section, index, field, currentValue) => {
    if (!currentValue || currentValue.trim() === '') {
      return toast.error('Please type some text first before optimizing.');
    }

    toast.loading('Optimizing text flow...', { id: 'ai-improve' });
    const res = await improveContent(currentValue);
    
    if (res.success) {
      if (index === null) {
        // Personal info summary
        handlePersonalInfoChange(field, res.data);
      } else {
        // Inside lists (experience, projects)
        handleArrayFieldChange(section, index, field, res.data);
      }
      toast.success('Text enhanced!', { id: 'ai-improve' });
    } else {
      toast.error('AI improvement failed', { id: 'ai-improve' });
    }
  };

  // ==========================================
  // AI DRAWER ASSISTANT ACTIONS
  // ==========================================

  const handleAIGenerateSummary = async () => {
    const jobTitle = resume.personalInfo?.jobTitle;
    if (!jobTitle) {
      return toast.error('Please enter a target Job Title in Personal Info first.');
    }

    const skillNames = (resume.skills || []).map(s => s.name);
    setAiLoading(true);
    const res = await generateSummary(jobTitle, skillNames);
    setAiLoading(false);

    if (res.success) {
      handlePersonalInfoChange('summary', res.data);
      toast.success('AI summary injected successfully!');
    }
  };

  const handleAIGenerateObjective = async () => {
    const jobTitle = resume.personalInfo?.jobTitle;
    if (!jobTitle) {
      return toast.error('Please enter a target Job Title in Personal Info first.');
    }

    setAiLoading(true);
    const res = await generateObjective(jobTitle);
    setAiLoading(false);

    if (res.success) {
      handlePersonalInfoChange('summary', res.data);
      toast.success('AI objective injected successfully!');
    }
  };

  const handleAISuggestSkills = async () => {
    const jobTitle = resume.personalInfo?.jobTitle;
    if (!jobTitle) {
      return toast.error('Please enter a target Job Title in Personal Info first.');
    }

    setAiLoading(true);
    const res = await suggestSkills(jobTitle);
    setAiLoading(false);

    if (res.success) {
      setSuggestedSkillsList(res.data);
      toast.success('AI skill suggestions loaded!');
    }
  };

  const addSuggestedSkill = (skillName) => {
    const skillExists = (resume.skills || []).some(s => s.name.toLowerCase() === skillName.toLowerCase());
    if (skillExists) {
      return toast.error('Skill already in list');
    }
    
    addArrayEntry('skills', { name: skillName, level: 'Intermediate' });
    setSuggestedSkillsList(prev => prev.filter(s => s !== skillName));
    toast.success(`Added ${skillName}`);
  };

  return (
    <div className="h-[calc(100vh-5rem)] flex flex-col relative text-slate-800 dark:text-slate-100">
      
      {/* Upper Action Header */}
      <div className="h-14 flex items-center justify-between border-b border-slate-200 dark:border-navy-900 bg-white dark:bg-navy-900/60 px-4 md:px-6">
        <div className="flex items-center space-x-3">
          <Link to="/dashboard" className="p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-navy-800 rounded-lg transition-colors">
            <FiArrowLeft className="w-4.5 h-4.5" />
          </Link>
          <div className="flex items-baseline space-x-2">
            <input
              type="text"
              value={resume.title}
              onChange={(e) => updateResumeLocal({ title: e.target.value })}
              className="text-sm font-bold bg-transparent outline-none border-b border-transparent focus:border-indigo-500 px-1 py-0.5 truncate max-w-[200px]"
            />
            <span className="text-[10px] text-slate-400 font-light hidden sm:inline">
              {saving ? 'Auto-saving...' : 'Saved to Cloud'}
            </span>
          </div>
        </div>

        {/* Global Action buttons */}
        <div className="flex items-center space-x-2">
          {/* Quick AI Trigger */}
          <button
            onClick={() => setAiAssistantOpen(!aiAssistantOpen)}
            className="inline-flex items-center justify-center space-x-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-900/30 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
          >
            <HiSparkles className="w-3.5 h-3.5" />
            <span>AI Copilot</span>
          </button>

          {/* Save Manual */}
          <button
            onClick={saveResumeManual}
            className="p-2.5 rounded-xl border border-slate-200 dark:border-navy-800 text-slate-500 dark:text-slate-400 hover:text-indigo-600 hover:bg-slate-50 dark:hover:bg-navy-800 transition-colors cursor-pointer"
            title="Force Save"
          >
            <FiSave className="w-4 h-4" />
          </button>

          {/* Export PDF */}
          <button
            onClick={handleDownloadPDF}
            className="inline-flex items-center space-x-1.5 px-4.5 py-2.5 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 shadow-md shadow-indigo-500/10 cursor-pointer"
          >
            <FiDownload className="w-4 h-4" />
            <span>Download PDF</span>
          </button>
        </div>
      </div>

      {/* Main Workspace Split Pane */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* LEFT COLUMN: MULTI-STEP EDIT PANELS */}
        <div className="w-full md:w-1/2 flex flex-col border-r border-slate-200 dark:border-navy-900 bg-white dark:bg-navy-900/20 overflow-y-auto">
          
          {/* Settings Section Accordion Item */}
          <div className="border-b border-slate-100 dark:border-navy-900/60">
            <button
              onClick={() => setActiveSection(activeSection === 'settings' ? '' : 'settings')}
              className="w-full px-6 py-4 flex items-center justify-between font-display font-semibold text-sm hover:bg-slate-50 dark:hover:bg-navy-800/40 text-slate-700 dark:text-slate-200"
            >
              <div className="flex items-center space-x-2.5">
                <FiSliders className="w-4.5 h-4.5 text-indigo-500" />
                <span>Template & Visual Theme</span>
              </div>
              {activeSection === 'settings' ? <FiChevronUp /> : <FiChevronDown />}
            </button>
            
            <AnimatePresence>
              {activeSection === 'settings' && (
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: 'auto' }}
                  exit={{ height: 0 }}
                  className="overflow-hidden bg-slate-50/50 dark:bg-navy-900/10 px-6 pb-6 pt-2 space-y-5 text-xs"
                >
                  {/* Template Picker */}
                  <div>
                    <label className="block font-semibold text-slate-500 uppercase tracking-wider mb-2">Template Layout</label>
                    <div className="grid grid-cols-3 gap-2">
                      {['modern', 'ats', 'corporate', 'creative', 'minimal'].map((t) => (
                        <button
                          key={t}
                          onClick={() => updateResumeLocal({ template: t })}
                          className={`py-2 px-3 border text-center rounded-xl font-bold capitalize cursor-pointer transition-all ${
                            resume.template === t
                              ? 'border-indigo-500 bg-indigo-50/30 text-indigo-600 dark:text-indigo-400 font-extrabold'
                              : 'border-slate-200 dark:border-navy-850 hover:border-slate-300 text-slate-600 dark:text-slate-400'
                          }`}
                        >
                          {t}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Fonts and Colors */}
                  <div className="grid grid-cols-2 gap-4">
                    {/* Font Selector */}
                    <div>
                      <label className="block font-semibold text-slate-500 uppercase tracking-wider mb-2">Typography Font</label>
                      <select
                        value={resume.theme?.fontFamily || 'Inter'}
                        onChange={(e) => updateResumeLocal({ theme: { ...resume.theme, fontFamily: e.target.value } })}
                        className="w-full px-3 py-2 bg-white dark:bg-navy-950 border border-slate-200 dark:border-navy-800 rounded-xl outline-none"
                      >
                        <option value="Inter">Inter (Sleek Sans)</option>
                        <option value="Outfit">Outfit (Sans Display)</option>
                        <option value="Lora">Lora (Elegant Serif)</option>
                        <option value="Playfair Display">Playfair Display (Fancy)</option>
                        <option value="Fira Code">Fira Code (Modern Tech)</option>
                      </select>
                    </div>

                    {/* Spacing Selector */}
                    <div>
                      <label className="block font-semibold text-slate-500 uppercase tracking-wider mb-2">Layout Spacing</label>
                      <select
                        value={resume.theme?.spacing || 'normal'}
                        onChange={(e) => updateResumeLocal({ theme: { ...resume.theme, spacing: e.target.value } })}
                        className="w-full px-3 py-2 bg-white dark:bg-navy-950 border border-slate-200 dark:border-navy-800 rounded-xl outline-none"
                      >
                        <option value="compact">Compact (Tight data)</option>
                        <option value="normal">Normal</option>
                        <option value="loose">Loose (More padding)</option>
                      </select>
                    </div>
                  </div>

                  {/* Color Customizer */}
                  <div>
                    <label className="block font-semibold text-slate-500 uppercase tracking-wider mb-2">Accent Theme Color</label>
                    <div className="flex items-center space-x-3">
                      <input
                        type="color"
                        value={resume.theme?.primaryColor || '#6366f1'}
                        onChange={(e) => updateResumeLocal({ theme: { ...resume.theme, primaryColor: e.target.value } })}
                        className="w-8 h-8 rounded-lg cursor-pointer border-0 outline-none"
                      />
                      <span className="font-mono text-slate-500 text-xs font-semibold">{resume.theme?.primaryColor || '#6366f1'}</span>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Personal Info Accordion */}
          <div className="border-b border-slate-100 dark:border-navy-900/60">
            <button
              onClick={() => setActiveSection(activeSection === 'personal' ? '' : 'personal')}
              className="w-full px-6 py-4 flex items-center justify-between font-display font-semibold text-sm hover:bg-slate-50 dark:hover:bg-navy-800/40 text-slate-700 dark:text-slate-200"
            >
              <span>Personal Information</span>
              {activeSection === 'personal' ? <FiChevronUp /> : <FiChevronDown />}
            </button>
            
            <AnimatePresence>
              {activeSection === 'personal' && (
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: 'auto' }}
                  exit={{ height: 0 }}
                  className="overflow-hidden bg-slate-50/50 dark:bg-navy-900/10 px-6 pb-6 pt-2 space-y-4"
                >
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Full Name</label>
                      <input
                        type="text"
                        value={resume.personalInfo?.fullName || ''}
                        onChange={(e) => handlePersonalInfoChange('fullName', e.target.value)}
                        className="w-full px-3 py-2 text-xs bg-white dark:bg-navy-950 border border-slate-200 dark:border-navy-800 rounded-lg outline-none"
                        placeholder="John Doe"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Job Title Target</label>
                      <input
                        type="text"
                        value={resume.personalInfo?.jobTitle || ''}
                        onChange={(e) => handlePersonalInfoChange('jobTitle', e.target.value)}
                        className="w-full px-3 py-2 text-xs bg-white dark:bg-navy-950 border border-slate-200 dark:border-navy-800 rounded-lg outline-none"
                        placeholder="e.g. Senior React Developer"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Email Address</label>
                      <input
                        type="email"
                        value={resume.personalInfo?.email || ''}
                        onChange={(e) => handlePersonalInfoChange('email', e.target.value)}
                        className="w-full px-3 py-2 text-xs bg-white dark:bg-navy-950 border border-slate-200 dark:border-navy-800 rounded-lg outline-none"
                        placeholder="email@example.com"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Phone Number</label>
                      <input
                        type="text"
                        value={resume.personalInfo?.phone || ''}
                        onChange={(e) => handlePersonalInfoChange('phone', e.target.value)}
                        className="w-full px-3 py-2 text-xs bg-white dark:bg-navy-950 border border-slate-200 dark:border-navy-800 rounded-lg outline-none"
                        placeholder="+1 (555) 000-0000"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Location</label>
                      <input
                        type="text"
                        value={resume.personalInfo?.location || ''}
                        onChange={(e) => handlePersonalInfoChange('location', e.target.value)}
                        className="w-full px-3 py-2 text-xs bg-white dark:bg-navy-950 border border-slate-200 dark:border-navy-800 rounded-lg outline-none"
                        placeholder="City, State / Country"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Portfolio Link</label>
                      <input
                        type="text"
                        value={resume.personalInfo?.website || ''}
                        onChange={(e) => handlePersonalInfoChange('website', e.target.value)}
                        className="w-full px-3 py-2 text-xs bg-white dark:bg-navy-950 border border-slate-200 dark:border-navy-800 rounded-lg outline-none"
                        placeholder="https://myportfolio.com"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-1.5">LinkedIn Profile</label>
                      <input
                        type="text"
                        value={resume.personalInfo?.linkedin || ''}
                        onChange={(e) => handlePersonalInfoChange('linkedin', e.target.value)}
                        className="w-full px-3 py-2 text-xs bg-white dark:bg-navy-950 border border-slate-200 dark:border-navy-800 rounded-lg outline-none"
                        placeholder="https://linkedin.com/in/username"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-1.5">GitHub Profile</label>
                      <input
                        type="text"
                        value={resume.personalInfo?.github || ''}
                        onChange={(e) => handlePersonalInfoChange('github', e.target.value)}
                        className="w-full px-3 py-2 text-xs bg-white dark:bg-navy-950 border border-slate-200 dark:border-navy-800 rounded-lg outline-none"
                        placeholder="https://github.com/username"
                      />
                    </div>
                  </div>

                  {/* Summary / Objective Textarea */}
                  <div className="relative">
                    <div className="flex justify-between items-baseline mb-1">
                      <label className="block text-[10px] font-semibold text-slate-500 uppercase tracking-wider">Professional Summary</label>
                      <button
                        type="button"
                        onClick={() => handleImproveInlineText('personalInfo', null, 'summary', resume.personalInfo?.summary)}
                        className="inline-flex items-center space-x-1 text-[10px] text-indigo-500 hover:text-indigo-600 font-semibold cursor-pointer"
                        title="AI grammar check and impact rewrite"
                      >
                        <HiSparkles />
                        <span>AI Rewrite</span>
                      </button>
                    </div>
                    <textarea
                      value={resume.personalInfo?.summary || ''}
                      onChange={(e) => handlePersonalInfoChange('summary', e.target.value)}
                      rows={5}
                      className="w-full px-3 py-2 text-xs bg-white dark:bg-navy-950 border border-slate-200 dark:border-navy-800 rounded-lg outline-none resize-none font-light leading-relaxed"
                      placeholder="Write a summary or use the AI Copilot on the top-right to generate one..."
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Work Experience Accordion */}
          <div className="border-b border-slate-100 dark:border-navy-900/60">
            <button
              onClick={() => setActiveSection(activeSection === 'experience' ? '' : 'experience')}
              className="w-full px-6 py-4 flex items-center justify-between font-display font-semibold text-sm hover:bg-slate-50 dark:hover:bg-navy-800/40 text-slate-700 dark:text-slate-200"
            >
              <span>Work Experience</span>
              {activeSection === 'experience' ? <FiChevronUp /> : <FiChevronDown />}
            </button>
            
            <AnimatePresence>
              {activeSection === 'experience' && (
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: 'auto' }}
                  exit={{ height: 0 }}
                  className="overflow-hidden bg-slate-50/50 dark:bg-navy-900/10 px-6 pb-6 pt-2 space-y-4"
                >
                  {(resume.experience || []).map((exp, idx) => (
                    <div key={idx} className="p-4 bg-white dark:bg-navy-950 rounded-2xl border border-slate-200 dark:border-navy-800 space-y-4 relative">
                      <button
                        type="button"
                        onClick={() => removeArrayEntry('experience', idx)}
                        className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-red-500 rounded-lg hover:bg-slate-50 dark:hover:bg-navy-800 cursor-pointer"
                        title="Remove position"
                      >
                        <FiTrash2 className="w-4 h-4" />
                      </button>

                      <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wide">Position #{idx + 1}</h4>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-[10px] font-semibold text-slate-400 uppercase mb-1">Company</label>
                          <input
                            type="text"
                            value={exp.company || ''}
                            onChange={(e) => handleArrayFieldChange('experience', idx, 'company', e.target.value)}
                            className="w-full px-3 py-1.5 text-xs bg-slate-50 dark:bg-navy-900 border border-slate-200 dark:border-navy-800 rounded-lg outline-none"
                            placeholder="Acme Corp"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-semibold text-slate-400 uppercase mb-1">Role Position</label>
                          <input
                            type="text"
                            value={exp.position || ''}
                            onChange={(e) => handleArrayFieldChange('experience', idx, 'position', e.target.value)}
                            className="w-full px-3 py-1.5 text-xs bg-slate-50 dark:bg-navy-900 border border-slate-200 dark:border-navy-800 rounded-lg outline-none"
                            placeholder="Frontend Developer"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-3 gap-3">
                        <div>
                          <label className="block text-[10px] font-semibold text-slate-400 uppercase mb-1">Start Date</label>
                          <input
                            type="text"
                            value={exp.startDate || ''}
                            onChange={(e) => handleArrayFieldChange('experience', idx, 'startDate', e.target.value)}
                            className="w-full px-3 py-1.5 text-xs bg-slate-50 dark:bg-navy-900 border border-slate-200 dark:border-navy-800 rounded-lg outline-none"
                            placeholder="MM/YYYY"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-semibold text-slate-400 uppercase mb-1">End Date</label>
                          <input
                            type="text"
                            disabled={exp.current}
                            value={exp.current ? '' : exp.endDate || ''}
                            onChange={(e) => handleArrayFieldChange('experience', idx, 'endDate', e.target.value)}
                            className="w-full px-3 py-1.5 text-xs bg-slate-50 dark:bg-navy-900 border border-slate-200 dark:border-navy-800 rounded-lg outline-none disabled:opacity-50"
                            placeholder="MM/YYYY"
                          />
                        </div>
                        <div className="flex items-center pt-5">
                          <input
                            type="checkbox"
                            id={`exp-curr-${idx}`}
                            checked={exp.current || false}
                            onChange={(e) => handleArrayFieldChange('experience', idx, 'current', e.target.checked)}
                            className="mr-2"
                          />
                          <label htmlFor={`exp-curr-${idx}`} className="text-[10px] font-semibold text-slate-500 uppercase cursor-pointer">Current</label>
                        </div>
                      </div>

                      <div>
                        <label className="block text-[10px] font-semibold text-slate-400 uppercase mb-1">Location</label>
                        <input
                          type="text"
                          value={exp.location || ''}
                          onChange={(e) => handleArrayFieldChange('experience', idx, 'location', e.target.value)}
                          className="w-full px-3 py-1.5 text-xs bg-slate-50 dark:bg-navy-900 border border-slate-200 dark:border-navy-800 rounded-lg outline-none"
                          placeholder="New York, NY"
                        />
                      </div>

                      {/* Role bullets description */}
                      <div>
                        <div className="flex justify-between items-baseline mb-1">
                          <label className="block text-[10px] font-semibold text-slate-400 uppercase">Achievements & Responsibilities</label>
                          <button
                            type="button"
                            onClick={() => handleImproveInlineText('experience', idx, 'description', exp.description)}
                            className="inline-flex items-center space-x-1 text-[10px] text-indigo-500 hover:text-indigo-600 font-semibold cursor-pointer"
                            title="AI grammar rewrite"
                          >
                            <HiSparkles />
                            <span>AI Improve</span>
                          </button>
                        </div>
                        <textarea
                          value={exp.description || ''}
                          onChange={(e) => handleArrayFieldChange('experience', idx, 'description', e.target.value)}
                          rows={4}
                          className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-navy-900 border border-slate-200 dark:border-navy-800 rounded-lg outline-none resize-none font-light leading-relaxed"
                          placeholder="- Spearheaded design changes..."
                        />
                      </div>
                    </div>
                  ))}

                  <button
                    type="button"
                    onClick={() => addArrayEntry('experience', { company: '', position: '', location: '', startDate: '', endDate: '', description: '', current: false })}
                    className="w-full py-2.5 rounded-xl border border-dashed border-slate-300 dark:border-navy-800 text-xs font-semibold text-indigo-500 hover:bg-slate-100/50 dark:hover:bg-navy-800/20 transition-all flex items-center justify-center space-x-2 cursor-pointer"
                  >
                    <FiPlus className="w-4 h-4" />
                    <span>Add Work Experience</span>
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Education Accordion */}
          <div className="border-b border-slate-100 dark:border-navy-900/60">
            <button
              onClick={() => setActiveSection(activeSection === 'education' ? '' : 'education')}
              className="w-full px-6 py-4 flex items-center justify-between font-display font-semibold text-sm hover:bg-slate-50 dark:hover:bg-navy-800/40 text-slate-700 dark:text-slate-200"
            >
              <span>Education</span>
              {activeSection === 'education' ? <FiChevronUp /> : <FiChevronDown />}
            </button>
            
            <AnimatePresence>
              {activeSection === 'education' && (
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: 'auto' }}
                  exit={{ height: 0 }}
                  className="overflow-hidden bg-slate-50/50 dark:bg-navy-900/10 px-6 pb-6 pt-2 space-y-4"
                >
                  {(resume.education || []).map((edu, idx) => (
                    <div key={idx} className="p-4 bg-white dark:bg-navy-950 rounded-2xl border border-slate-200 dark:border-navy-800 space-y-4 relative">
                      <button
                        type="button"
                        onClick={() => removeArrayEntry('education', idx)}
                        className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-red-500 rounded-lg hover:bg-slate-50 dark:hover:bg-navy-800 cursor-pointer"
                      >
                        <FiTrash2 className="w-4 h-4" />
                      </button>

                      <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wide">Education #{idx + 1}</h4>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-[10px] font-semibold text-slate-400 uppercase mb-1">School / Academy</label>
                          <input
                            type="text"
                            value={edu.school || ''}
                            onChange={(e) => handleArrayFieldChange('education', idx, 'school', e.target.value)}
                            className="w-full px-3 py-1.5 text-xs bg-slate-50 dark:bg-navy-900 border border-slate-200 dark:border-navy-800 rounded-lg outline-none"
                            placeholder="Stanford University"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-semibold text-slate-400 uppercase mb-1">Degree Title</label>
                          <input
                            type="text"
                            value={edu.degree || ''}
                            onChange={(e) => handleArrayFieldChange('education', idx, 'degree', e.target.value)}
                            className="w-full px-3 py-1.5 text-xs bg-slate-50 dark:bg-navy-900 border border-slate-200 dark:border-navy-800 rounded-lg outline-none"
                            placeholder="Bachelor of Science"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-3 gap-3">
                        <div>
                          <label className="block text-[10px] font-semibold text-slate-400 uppercase mb-1">Field of Study</label>
                          <input
                            type="text"
                            value={edu.fieldOfStudy || ''}
                            onChange={(e) => handleArrayFieldChange('education', idx, 'fieldOfStudy', e.target.value)}
                            className="w-full px-3 py-1.5 text-xs bg-slate-50 dark:bg-navy-900 border border-slate-200 dark:border-navy-800 rounded-lg outline-none"
                            placeholder="Computer Science"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-semibold text-slate-400 uppercase mb-1">Start Date</label>
                          <input
                            type="text"
                            value={edu.startDate || ''}
                            onChange={(e) => handleArrayFieldChange('education', idx, 'startDate', e.target.value)}
                            className="w-full px-3 py-1.5 text-xs bg-slate-50 dark:bg-navy-900 border border-slate-200 dark:border-navy-800 rounded-lg outline-none"
                            placeholder="YYYY"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-semibold text-slate-400 uppercase mb-1">End Date</label>
                          <input
                            type="text"
                            disabled={edu.current}
                            value={edu.current ? '' : edu.endDate || ''}
                            onChange={(e) => handleArrayFieldChange('education', idx, 'endDate', e.target.value)}
                            className="w-full px-3 py-1.5 text-xs bg-slate-50 dark:bg-navy-900 border border-slate-200 dark:border-navy-800 rounded-lg outline-none"
                            placeholder="YYYY"
                          />
                        </div>
                      </div>

                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          id={`edu-curr-${idx}`}
                          checked={edu.current || false}
                          onChange={(e) => handleArrayFieldChange('education', idx, 'current', e.target.checked)}
                          className="mr-2"
                        />
                        <label htmlFor={`edu-curr-${idx}`} className="text-[10px] font-semibold text-slate-500 uppercase cursor-pointer">Enrolled / Current</label>
                      </div>

                      <div>
                        <label className="block text-[10px] font-semibold text-slate-400 uppercase mb-1">Description (Optional)</label>
                        <textarea
                          value={edu.description || ''}
                          onChange={(e) => handleArrayFieldChange('education', idx, 'description', e.target.value)}
                          rows={2}
                          className="w-full px-3 py-1.5 text-xs bg-slate-50 dark:bg-navy-900 border border-slate-200 dark:border-navy-800 rounded-lg outline-none resize-none font-light"
                          placeholder="Honors, key coursework..."
                        />
                      </div>
                    </div>
                  ))}

                  <button
                    type="button"
                    onClick={() => addArrayEntry('education', { school: '', degree: '', fieldOfStudy: '', startDate: '', endDate: '', description: '', current: false })}
                    className="w-full py-2.5 rounded-xl border border-dashed border-slate-300 dark:border-navy-800 text-xs font-semibold text-indigo-500 hover:bg-slate-100/50 dark:hover:bg-navy-800/20 transition-all flex items-center justify-center space-x-2 cursor-pointer"
                  >
                    <FiPlus className="w-4 h-4" />
                    <span>Add Education</span>
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Key Skills Accordion */}
          <div className="border-b border-slate-100 dark:border-navy-900/60">
            <button
              onClick={() => setActiveSection(activeSection === 'skills' ? '' : 'skills')}
              className="w-full px-6 py-4 flex items-center justify-between font-display font-semibold text-sm hover:bg-slate-50 dark:hover:bg-navy-800/40 text-slate-700 dark:text-slate-200"
            >
              <span>Skills Inventory</span>
              {activeSection === 'skills' ? <FiChevronUp /> : <FiChevronDown />}
            </button>
            
            <AnimatePresence>
              {activeSection === 'skills' && (
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: 'auto' }}
                  exit={{ height: 0 }}
                  className="overflow-hidden bg-slate-50/50 dark:bg-navy-900/10 px-6 pb-6 pt-2 space-y-4"
                >
                  <div className="flex flex-wrap gap-2 mb-3">
                    {(resume.skills || []).map((sk, idx) => (
                      <span
                        key={idx}
                        className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-white dark:bg-navy-900 border border-slate-200 dark:border-navy-850 text-xs font-medium text-slate-700 dark:text-slate-300 shadow-xs"
                      >
                        <span>{sk.name}</span>
                        <button
                          type="button"
                          onClick={() => removeArrayEntry('skills', idx)}
                          className="text-slate-400 hover:text-red-500 transition-colors cursor-pointer ml-1"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>

                  {/* Manual Add Skills */}
                  <div className="flex items-center space-x-2 pt-2 border-t border-slate-100 dark:border-navy-850">
                    <input
                      type="text"
                      id="manual-skill-input"
                      placeholder="Type a skill (e.g. React.js)"
                      className="flex-1 px-3 py-2 text-xs bg-white dark:bg-navy-950 border border-slate-200 dark:border-navy-800 rounded-lg outline-none"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && e.target.value.trim()) {
                          addArrayEntry('skills', { name: e.target.value.trim(), level: 'Intermediate' });
                          e.target.value = '';
                        }
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => {
                        const input = document.getElementById('manual-skill-input');
                        if (input && input.value.trim()) {
                          addArrayEntry('skills', { name: input.value.trim(), level: 'Intermediate' });
                          input.value = '';
                        }
                      }}
                      className="px-4 py-2 text-xs font-semibold text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 cursor-pointer"
                    >
                      Add
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Key Projects Accordion */}
          <div className="border-b border-slate-100 dark:border-navy-900/60">
            <button
              onClick={() => setActiveSection(activeSection === 'projects' ? '' : 'projects')}
              className="w-full px-6 py-4 flex items-center justify-between font-display font-semibold text-sm hover:bg-slate-50 dark:hover:bg-navy-800/40 text-slate-700 dark:text-slate-200"
            >
              <span>Projects Portfolio</span>
              {activeSection === 'projects' ? <FiChevronUp /> : <FiChevronDown />}
            </button>
            
            <AnimatePresence>
              {activeSection === 'projects' && (
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: 'auto' }}
                  exit={{ height: 0 }}
                  className="overflow-hidden bg-slate-50/50 dark:bg-navy-900/10 px-6 pb-6 pt-2 space-y-4"
                >
                  {(resume.projects || []).map((proj, idx) => (
                    <div key={idx} className="p-4 bg-white dark:bg-navy-950 rounded-2xl border border-slate-200 dark:border-navy-800 space-y-4 relative">
                      <button
                        type="button"
                        onClick={() => removeArrayEntry('projects', idx)}
                        className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-red-500 rounded-lg hover:bg-slate-50 dark:hover:bg-navy-800 cursor-pointer"
                      >
                        <FiTrash2 className="w-4 h-4" />
                      </button>

                      <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wide">Project #{idx + 1}</h4>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-[10px] font-semibold text-slate-400 uppercase mb-1">Project Name</label>
                          <input
                            type="text"
                            value={proj.name || ''}
                            onChange={(e) => handleArrayFieldChange('projects', idx, 'name', e.target.value)}
                            className="w-full px-3 py-1.5 text-xs bg-slate-50 dark:bg-navy-900 border border-slate-200 dark:border-navy-800 rounded-lg outline-none"
                            placeholder="E-commerce App"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-semibold text-slate-400 uppercase mb-1">Technologies Used</label>
                          <input
                            type="text"
                            value={proj.technologies || ''}
                            onChange={(e) => handleArrayFieldChange('projects', idx, 'technologies', e.target.value)}
                            className="w-full px-3 py-1.5 text-xs bg-slate-50 dark:bg-navy-900 border border-slate-200 dark:border-navy-800 rounded-lg outline-none"
                            placeholder="React, Node.js, Express"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-[10px] font-semibold text-slate-400 uppercase mb-1">Project Link (Optional)</label>
                        <input
                          type="text"
                          value={proj.link || ''}
                          onChange={(e) => handleArrayFieldChange('projects', idx, 'link', e.target.value)}
                          className="w-full px-3 py-1.5 text-xs bg-slate-50 dark:bg-navy-900 border border-slate-200 dark:border-navy-800 rounded-lg outline-none"
                          placeholder="https://github.com/my-project"
                        />
                      </div>

                      <div>
                        <div className="flex justify-between items-baseline mb-1">
                          <label className="block text-[10px] font-semibold text-slate-400 uppercase">Project Description</label>
                          <button
                            type="button"
                            onClick={() => handleImproveInlineText('projects', idx, 'description', proj.description)}
                            className="inline-flex items-center space-x-1 text-[10px] text-indigo-500 hover:text-indigo-600 font-semibold cursor-pointer"
                          >
                            <HiSparkles />
                            <span>AI Improve</span>
                          </button>
                        </div>
                        <textarea
                          value={proj.description || ''}
                          onChange={(e) => handleArrayFieldChange('projects', idx, 'description', e.target.value)}
                          rows={3}
                          className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-navy-900 border border-slate-200 dark:border-navy-800 rounded-lg outline-none resize-none font-light"
                          placeholder="Describe your role, accomplishments..."
                        />
                      </div>
                    </div>
                  ))}

                  <button
                    type="button"
                    onClick={() => addArrayEntry('projects', { name: '', description: '', technologies: '', link: '' })}
                    className="w-full py-2.5 rounded-xl border border-dashed border-slate-300 dark:border-navy-800 text-xs font-semibold text-indigo-500 hover:bg-slate-100/50 dark:hover:bg-navy-800/20 transition-all flex items-center justify-center space-x-2 cursor-pointer"
                  >
                    <FiPlus className="w-4 h-4" />
                    <span>Add Project Workspace</span>
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Certifications Accordion */}
          <div className="border-b border-slate-100 dark:border-navy-900/60">
            <button
              onClick={() => setActiveSection(activeSection === 'certifications' ? '' : 'certifications')}
              className="w-full px-6 py-4 flex items-center justify-between font-display font-semibold text-sm hover:bg-slate-50 dark:hover:bg-navy-800/40 text-slate-700 dark:text-slate-200"
            >
              <span>Certifications</span>
              {activeSection === 'certifications' ? <FiChevronUp /> : <FiChevronDown />}
            </button>
            
            <AnimatePresence>
              {activeSection === 'certifications' && (
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: 'auto' }}
                  exit={{ height: 0 }}
                  className="overflow-hidden bg-slate-50/50 dark:bg-navy-900/10 px-6 pb-6 pt-2 space-y-4"
                >
                  {(resume.certifications || []).map((cert, idx) => (
                    <div key={idx} className="p-4 bg-white dark:bg-navy-950 rounded-2xl border border-slate-200 dark:border-navy-800 space-y-4 relative">
                      <button
                        type="button"
                        onClick={() => removeArrayEntry('certifications', idx)}
                        className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-red-500 rounded-lg hover:bg-slate-50 dark:hover:bg-navy-800 cursor-pointer"
                      >
                        <FiTrash2 className="w-4 h-4" />
                      </button>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-[10px] font-semibold text-slate-400 uppercase mb-1">Certification Name</label>
                          <input
                            type="text"
                            value={cert.name || ''}
                            onChange={(e) => handleArrayFieldChange('certifications', idx, 'name', e.target.value)}
                            className="w-full px-3 py-1.5 text-xs bg-slate-50 dark:bg-navy-900 border border-slate-200 dark:border-navy-800 rounded-lg outline-none"
                            placeholder="AWS Solutions Architect"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-semibold text-slate-400 uppercase mb-1">Issuing Organization</label>
                          <input
                            type="text"
                            value={cert.issuer || ''}
                            onChange={(e) => handleArrayFieldChange('certifications', idx, 'issuer', e.target.value)}
                            className="w-full px-3 py-1.5 text-xs bg-slate-50 dark:bg-navy-900 border border-slate-200 dark:border-navy-800 rounded-lg outline-none"
                            placeholder="Amazon Web Services"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-[10px] font-semibold text-slate-400 uppercase mb-1">Date Issued</label>
                          <input
                            type="text"
                            value={cert.date || ''}
                            onChange={(e) => handleArrayFieldChange('certifications', idx, 'date', e.target.value)}
                            className="w-full px-3 py-1.5 text-xs bg-slate-50 dark:bg-navy-900 border border-slate-200 dark:border-navy-800 rounded-lg outline-none"
                            placeholder="MM/YYYY"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-semibold text-slate-400 uppercase mb-1">Credential Link</label>
                          <input
                            type="text"
                            value={cert.link || ''}
                            onChange={(e) => handleArrayFieldChange('certifications', idx, 'link', e.target.value)}
                            className="w-full px-3 py-1.5 text-xs bg-slate-50 dark:bg-navy-900 border border-slate-200 dark:border-navy-800 rounded-lg outline-none"
                            placeholder="https://verify.credential"
                          />
                        </div>
                      </div>
                    </div>
                  ))}

                  <button
                    type="button"
                    onClick={() => addArrayEntry('certifications', { name: '', issuer: '', date: '', link: '' })}
                    className="w-full py-2.5 rounded-xl border border-dashed border-slate-300 dark:border-navy-800 text-xs font-semibold text-indigo-500 hover:bg-slate-100/50 dark:hover:bg-navy-800/20 transition-all flex items-center justify-center space-x-2 cursor-pointer"
                  >
                    <FiPlus className="w-4 h-4" />
                    <span>Add Certification</span>
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Languages Accordion */}
          <div className="border-b border-slate-100 dark:border-navy-900/60">
            <button
              onClick={() => setActiveSection(activeSection === 'languages' ? '' : 'languages')}
              className="w-full px-6 py-4 flex items-center justify-between font-display font-semibold text-sm hover:bg-slate-50 dark:hover:bg-navy-800/40 text-slate-700 dark:text-slate-200"
            >
              <span>Languages</span>
              {activeSection === 'languages' ? <FiChevronUp /> : <FiChevronDown />}
            </button>
            
            <AnimatePresence>
              {activeSection === 'languages' && (
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: 'auto' }}
                  exit={{ height: 0 }}
                  className="overflow-hidden bg-slate-50/50 dark:bg-navy-900/10 px-6 pb-6 pt-2 space-y-4"
                >
                  {(resume.languages || []).map((lang, idx) => (
                    <div key={idx} className="p-4 bg-white dark:bg-navy-950 rounded-2xl border border-slate-200 dark:border-navy-800 space-y-4 relative">
                      <button
                        type="button"
                        onClick={() => removeArrayEntry('languages', idx)}
                        className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-red-500 rounded-lg hover:bg-slate-50 dark:hover:bg-navy-800 cursor-pointer"
                      >
                        <FiTrash2 className="w-4 h-4" />
                      </button>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-[10px] font-semibold text-slate-400 uppercase mb-1">Language</label>
                          <input
                            type="text"
                            value={lang.language || ''}
                            onChange={(e) => handleArrayFieldChange('languages', idx, 'language', e.target.value)}
                            className="w-full px-3 py-1.5 text-xs bg-slate-50 dark:bg-navy-900 border border-slate-200 dark:border-navy-800 rounded-lg outline-none"
                            placeholder="Spanish"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-semibold text-slate-400 uppercase mb-1">Proficiency Level</label>
                          <select
                            value={lang.proficiency || 'Professional'}
                            onChange={(e) => handleArrayFieldChange('languages', idx, 'proficiency', e.target.value)}
                            className="w-full px-3 py-1.5 text-xs bg-slate-50 dark:bg-navy-900 border border-slate-200 dark:border-navy-800 rounded-lg outline-none"
                          >
                            <option value="Elementary">Elementary (A1/A2)</option>
                            <option value="Limited">Limited Working (B1)</option>
                            <option value="Professional">Professional Working (B2/C1)</option>
                            <option value="Full Professional">Full Professional (C2)</option>
                            <option value="Native">Native / Bilingual</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  ))}

                  <button
                    type="button"
                    onClick={() => addArrayEntry('languages', { language: '', proficiency: 'Professional' })}
                    className="w-full py-2.5 rounded-xl border border-dashed border-slate-300 dark:border-navy-800 text-xs font-semibold text-indigo-500 hover:bg-slate-100/50 dark:hover:bg-navy-800/20 transition-all flex items-center justify-center space-x-2 cursor-pointer"
                  >
                    <FiPlus className="w-4 h-4" />
                    <span>Add Language</span>
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Achievements Accordion */}
          <div className="border-b border-slate-100 dark:border-navy-900/60 mb-6">
            <button
              onClick={() => setActiveSection(activeSection === 'achievements' ? '' : 'achievements')}
              className="w-full px-6 py-4 flex items-center justify-between font-display font-semibold text-sm hover:bg-slate-50 dark:hover:bg-navy-800/40 text-slate-700 dark:text-slate-200"
            >
              <span>Achievements & Honors</span>
              {activeSection === 'achievements' ? <FiChevronUp /> : <FiChevronDown />}
            </button>
            
            <AnimatePresence>
              {activeSection === 'achievements' && (
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: 'auto' }}
                  exit={{ height: 0 }}
                  className="overflow-hidden bg-slate-50/50 dark:bg-navy-900/10 px-6 pb-6 pt-2 space-y-4"
                >
                  {(resume.achievements || []).map((ach, idx) => (
                    <div key={idx} className="p-4 bg-white dark:bg-navy-950 rounded-2xl border border-slate-200 dark:border-navy-800 space-y-4 relative">
                      <button
                        type="button"
                        onClick={() => removeArrayEntry('achievements', idx)}
                        className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-red-500 rounded-lg hover:bg-slate-50 dark:hover:bg-navy-800 cursor-pointer"
                      >
                        <FiTrash2 className="w-4 h-4" />
                      </button>

                      <div>
                        <label className="block text-[10px] font-semibold text-slate-400 uppercase mb-1">Achievement Title</label>
                        <input
                          type="text"
                          value={ach.title || ''}
                          onChange={(e) => handleArrayFieldChange('achievements', idx, 'title', e.target.value)}
                          className="w-full px-3 py-1.5 text-xs bg-slate-50 dark:bg-navy-900 border border-slate-200 dark:border-navy-800 rounded-lg outline-none"
                          placeholder="Hackathon Winner"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-semibold text-slate-400 uppercase mb-1">Details description</label>
                        <textarea
                          value={ach.description || ''}
                          onChange={(e) => handleArrayFieldChange('achievements', idx, 'description', e.target.value)}
                          rows={2}
                          className="w-full px-3 py-1.5 text-xs bg-slate-50 dark:bg-navy-900 border border-slate-200 dark:border-navy-800 rounded-lg outline-none resize-none font-light"
                          placeholder="First place out of 100 teams..."
                        />
                      </div>
                    </div>
                  ))}

                  <button
                    type="button"
                    onClick={() => addArrayEntry('achievements', { title: '', description: '' })}
                    className="w-full py-2.5 rounded-xl border border-dashed border-slate-300 dark:border-navy-800 text-xs font-semibold text-indigo-500 hover:bg-slate-100/50 dark:hover:bg-navy-800/20 transition-all flex items-center justify-center space-x-2 cursor-pointer"
                  >
                    <FiPlus className="w-4 h-4" />
                    <span>Add Achievement</span>
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

        </div>

        {/* RIGHT COLUMN: LIVE RESUME PREVIEW PANEL */}
        <div className="hidden md:flex flex-1 flex-col bg-slate-100 dark:bg-navy-950 overflow-hidden relative">
          
          {/* Zoom controls header toolbar */}
          <div className="h-12 bg-white dark:bg-navy-900 border-b border-slate-200 dark:border-navy-900 px-4 flex items-center justify-between text-xs">
            <span className="font-semibold text-slate-500 uppercase tracking-wider flex items-center space-x-1.5">
              <FiLayout className="w-3.5 h-3.5" />
              <span>Real-time Preview</span>
            </span>

            {/* Zoom Button cluster */}
            <div className="flex items-center space-x-1.5">
              <button
                onClick={() => setZoom(prev => Math.max(prev - 0.05, 0.4))}
                className="p-1.5 bg-slate-50 dark:bg-navy-955 rounded-lg border border-slate-200 dark:border-navy-850 hover:bg-slate-100 cursor-pointer"
                title="Zoom Out"
              >
                <FiZoomOut className="w-3.5 h-3.5" />
              </button>
              <span className="font-mono text-slate-500 select-none px-1 text-[10px] font-bold">{Math.round(zoom * 100)}%</span>
              <button
                onClick={() => setZoom(prev => Math.min(prev + 0.05, 1.2))}
                className="p-1.5 bg-slate-50 dark:bg-navy-955 rounded-lg border border-slate-200 dark:border-navy-850 hover:bg-slate-100 cursor-pointer"
                title="Zoom In"
              >
                <FiZoomIn className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setZoom(0.85)}
                className="p-1.5 bg-slate-50 dark:bg-navy-955 rounded-lg border border-slate-200 dark:border-navy-850 hover:bg-slate-100 cursor-pointer"
                title="Reset Zoom"
              >
                <FiRotateCcw className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Scrollable Viewport housing the scaled A4 document card */}
          <div className="flex-1 overflow-auto p-8 flex justify-center items-start">
            <div
              className="origin-top transition-transform duration-100 shadow-2xl relative"
              style={{ transform: `scale(${zoom})` }}
            >
              {renderActiveTemplate()}
            </div>
          </div>
        </div>

      </div>

      {/* FLOATING SIDEBAR PANEL: AI COPILOT DRAWER */}
      <AnimatePresence>
        {aiAssistantOpen && (
          <>
            {/* Drawer Backdrop on mobile */}
            <div className="fixed inset-0 z-35 md:hidden bg-black/40" onClick={() => setAiAssistantOpen(false)}></div>
            
            {/* Drawer Pane */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'tween', duration: 0.3 }}
              className="absolute right-0 top-0 bottom-0 w-80 bg-white dark:bg-navy-900 border-l border-slate-200 dark:border-navy-850 shadow-2xl z-40 flex flex-col p-6 text-slate-800 dark:text-white"
            >
              <div className="flex justify-between items-center pb-4 border-b border-slate-100 dark:border-navy-800 mb-6">
                <h3 className="font-display font-bold text-md flex items-center space-x-2">
                  <HiSparkles className="text-indigo-500" />
                  <span>AI Copilot Engine</span>
                </h3>
                <button
                  type="button"
                  onClick={() => setAiAssistantOpen(false)}
                  className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer text-sm"
                >
                  ×
                </button>
              </div>

              {/* AI Functions */}
              <div className="flex-grow overflow-y-auto space-y-6 text-xs">
                
                {/* 1. Generate Summary */}
                <div className="p-4 bg-indigo-50/50 dark:bg-indigo-950/20 rounded-2xl border border-indigo-100/50 dark:border-indigo-900/35 space-y-3">
                  <h4 className="font-bold flex items-center space-x-1">
                    <HiSparkles className="text-indigo-500" />
                    <span>AI Profile Summarizer</span>
                  </h4>
                  <p className="text-[10px] text-slate-500 font-light leading-relaxed">
                    Creates an Executive Summary using your target Job Title and current list of inventory skills.
                  </p>
                  <button
                    type="button"
                    disabled={aiLoading}
                    onClick={handleAIGenerateSummary}
                    className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold shadow-xs disabled:opacity-50 cursor-pointer flex items-center justify-center space-x-1.5"
                  >
                    <span>Generate Summary</span>
                  </button>
                </div>

                {/* 2. Generate Objective */}
                <div className="p-4 bg-violet-50/50 dark:bg-violet-950/20 rounded-2xl border border-violet-100/50 dark:border-violet-900/35 space-y-3">
                  <h4 className="font-bold flex items-center space-x-1">
                    <HiSparkles className="text-violet-500" />
                    <span>AI Career Objective</span>
                  </h4>
                  <p className="text-[10px] text-slate-500 font-light leading-relaxed">
                    Generates a focused 2-sentence objective target based on your target role title.
                  </p>
                  <button
                    type="button"
                    disabled={aiLoading}
                    onClick={handleAIGenerateObjective}
                    className="w-full py-2 bg-violet-600 hover:bg-violet-700 text-white rounded-xl text-xs font-semibold shadow-xs disabled:opacity-50 cursor-pointer flex items-center justify-center space-x-1.5"
                  >
                    <span>Generate Objective</span>
                  </button>
                </div>

                {/* 3. Skill Suggester */}
                <div className="p-4 bg-slate-50 dark:bg-navy-955 rounded-2xl border border-slate-200 dark:border-navy-800 space-y-3.5">
                  <h4 className="font-bold flex items-center space-x-1">
                    <HiSparkles className="text-slate-400" />
                    <span>AI Skill Suggester</span>
                  </h4>
                  <p className="text-[10px] text-slate-500 font-light leading-relaxed">
                    Fetches 10 critical technical competencies matching your job title target. Click suggestions to append to list.
                  </p>
                  
                  <button
                    type="button"
                    disabled={aiLoading}
                    onClick={handleAISuggestSkills}
                    className="w-full py-2 border border-slate-300 dark:border-navy-800 text-slate-700 dark:text-slate-300 rounded-xl text-xs font-semibold hover:bg-slate-100 cursor-pointer"
                  >
                    Suggest Skills List
                  </button>

                  {suggestedSkillsList.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 pt-2">
                      {suggestedSkillsList.map((skill, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => addSuggestedSkill(skill)}
                          className="px-2 py-1 bg-white dark:bg-navy-950 border border-indigo-200 dark:border-indigo-900 text-[10px] rounded hover:bg-indigo-50 dark:hover:bg-indigo-950 font-medium flex items-center space-x-1 cursor-pointer"
                        >
                          <span>+ {skill}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>

              </div>

              <div className="pt-4 border-t border-slate-100 dark:border-navy-800 mt-auto text-center text-[10px] text-slate-400 font-light leading-snug">
                Gemini AI powers summaries and optimization. Keep inputs realistic for best performance output!
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

    </div>
  );
};

export default ResumeBuilder;

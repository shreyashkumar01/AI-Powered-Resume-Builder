import React, { createContext, useState, useEffect, useRef, useContext } from 'react';
import api from '../services/api';
import { toast } from 'react-hot-toast';

const ResumeContext = createContext();

export const ResumeProvider = ({ children }) => {
  const [resume, setResume] = useState(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  
  // Track if changes are being made, to trigger auto-save
  const isInitialLoad = useRef(true);
  const resumeStateRef = useRef(null);

  // Load a specific resume
  const loadResume = async (id) => {
    try {
      setLoading(true);
      isInitialLoad.current = true;
      const res = await api.get(`/resumes/${id}`);
      if (res.data.success) {
        setResume(res.data.data);
        resumeStateRef.current = JSON.stringify(res.data.data);
      }
    } catch (error) {
      console.error('Load Resume Error:', error);
      toast.error('Failed to load resume document');
    } finally {
      setLoading(false);
    }
  };

  // Sync state changes locally
  const updateResumeLocal = (updatedFields) => {
    setResume((prev) => {
      if (!prev) return null;
      
      // Calculate deep updates if object keys exist, otherwise merge
      const newResume = { ...prev };
      
      // Dynamic sections merge
      Object.keys(updatedFields).forEach(key => {
        if (typeof updatedFields[key] === 'object' && updatedFields[key] !== null && !Array.isArray(updatedFields[key])) {
          newResume[key] = { ...prev[key], ...updatedFields[key] };
        } else {
          newResume[key] = updatedFields[key];
        }
      });
      
      return newResume;
    });
  };

  // Auto-Save Effect
  useEffect(() => {
    if (!resume || !resume._id) return;

    // Check if anything actually changed from what is stored on server
    const currentSerialized = JSON.stringify(resume);
    if (isInitialLoad.current) {
      isInitialLoad.current = false;
      return;
    }
    
    if (currentSerialized === resumeStateRef.current) {
      return; // No real changes, skip save
    }

    setSaving(true);
    const delayDebounce = setTimeout(async () => {
      try {
        const res = await api.put(`/resumes/${resume._id}`, resume);
        if (res.data.success) {
          resumeStateRef.current = JSON.stringify(res.data.data);
        }
      } catch (error) {
        console.error('Auto-save error:', error);
        // Silent fail on auto-save to avoid interrupting user typing, but show warning in console
      } finally {
        setSaving(false);
      }
    }, 1500); // Wait 1.5 seconds after typing stops

    return () => clearTimeout(delayDebounce);
  }, [resume]);

  // AI Helpers
  const generateSummary = async (jobTitle, skills) => {
    try {
      const res = await api.post('/ai/generate-summary', { jobTitle, skills });
      return res.data;
    } catch (error) {
      toast.error('Failed to generate summary with AI');
      return { success: false, message: error.message };
    }
  };

  const generateObjective = async (jobTitle) => {
    try {
      const res = await api.post('/ai/generate-objective', { jobTitle });
      return res.data;
    } catch (error) {
      toast.error('Failed to generate career objective');
      return { success: false, message: error.message };
    }
  };

  const improveContent = async (text) => {
    try {
      const res = await api.post('/ai/improve-content', { text });
      return res.data;
    } catch (error) {
      toast.error('Failed to improve content text');
      return { success: false, message: error.message };
    }
  };

  const suggestSkills = async (jobTitle) => {
    try {
      const res = await api.post('/ai/suggest-skills', { jobTitle });
      return res.data;
    } catch (error) {
      toast.error('Failed to retrieve skill suggestions');
      return { success: false, message: error.message };
    }
  };

  // Explicit Save manual triggers
  const saveResumeManual = async () => {
    if (!resume) return;
    try {
      setSaving(true);
      const res = await api.put(`/resumes/${resume._id}`, resume);
      if (res.data.success) {
        setResume(res.data.data);
        resumeStateRef.current = JSON.stringify(res.data.data);
        toast.success('Resume saved successfully');
      }
    } catch (error) {
      console.error('Manual Save Error:', error);
      toast.error('Failed to save changes');
    } finally {
      setSaving(false);
    }
  };

  const value = {
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
  };

  return <ResumeContext.Provider value={value}>{children}</ResumeContext.Provider>;
};

export const useResume = () => {
  const context = useContext(ResumeContext);
  if (!context) {
    throw new Error('useResume must be used within a ResumeProvider');
  }
  return context;
};

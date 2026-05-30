import React, { useState, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { FiUser, FiMail, FiLock, FiCamera, FiSave, FiAlertCircle } from 'react-icons/fi';
import { toast } from 'react-hot-toast';
import { motion } from 'framer-motion';

export const Profile = () => {
  const { user, updateProfile } = useAuth();
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [avatar, setAvatar] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(
    user?.profileImage ? `http://localhost:5000${user.profileImage}` : ''
  );
  const [isUpdating, setIsUpdating] = useState(false);
  const fileInputRef = useRef(null);

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        return toast.error('Image size must be less than 2MB');
      }
      setAvatar(file);
      setAvatarPreview(URL.createObjectURL(file));
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current.click();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !email) {
      return toast.error('Name and email are required');
    }

    if (password && password.length < 6) {
      return toast.error('Password must be at least 6 characters');
    }

    if (password !== confirmPassword) {
      return toast.error('Passwords do not match');
    }

    setIsUpdating(true);
    
    // Create FormData for multipart submission (required for file upload)
    const formData = new FormData();
    formData.append('name', name);
    formData.append('email', email);
    if (password) {
      formData.append('password', password);
    }
    if (avatar) {
      formData.append('profileImage', avatar);
    }

    const result = await updateProfile(formData);
    setIsUpdating(false);

    if (result.success) {
      toast.success('Profile updated successfully!');
      // Clear password inputs
      setPassword('');
      setConfirmPassword('');
    } else {
      toast.error(result.message || 'Failed to update profile');
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-bold font-display text-slate-900 dark:text-white">Account Settings</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 font-light">Update your profile parameters and credentials.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* Left column - avatar upload */}
        <div className="bg-white dark:bg-navy-900 border border-slate-200 dark:border-navy-850 p-6 rounded-2xl shadow-sm flex flex-col items-center justify-center space-y-4">
          <div className="relative group">
            <div className="w-32 h-32 rounded-full overflow-hidden bg-slate-100 dark:bg-navy-800 border-2 border-indigo-500/20 flex items-center justify-center">
              {avatarPreview ? (
                <img src={avatarPreview} alt="User Avatar" className="w-full h-full object-cover" />
              ) : (
                <span className="text-4xl text-indigo-400 font-bold uppercase">{user?.name?.charAt(0)}</span>
              )}
            </div>
            <button
              type="button"
              onClick={triggerFileInput}
              className="absolute inset-0 bg-black/40 text-white rounded-full opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity cursor-pointer"
            >
              <FiCamera className="w-6 h-6" />
            </button>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleAvatarChange}
              accept="image/*"
              className="hidden"
            />
          </div>
          
          <div className="text-center">
            <h3 className="font-bold text-slate-800 dark:text-slate-100">{user?.name}</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 capitalize">{user?.role} Profile</p>
          </div>
          
          <p className="text-[10px] text-slate-400 text-center leading-relaxed font-light max-w-[180px]">
            Accepts JPEG, JPG, PNG, or WEBP formats. Size limit 2MB.
          </p>
        </div>

        {/* Right column - profile fields form */}
        <div className="md:col-span-2 bg-white dark:bg-navy-900 border border-slate-200 dark:border-navy-850 p-6 rounded-2xl shadow-sm">
          <form onSubmit={handleSubmit} className="space-y-6">
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* Full Name */}
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                  Full Name
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <FiUser className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="block w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 dark:bg-navy-950 border border-slate-200 dark:border-navy-800 text-sm focus:border-indigo-500 outline-none transition-all"
                  />
                </div>
              </div>

              {/* Email Address */}
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <FiMail className="w-4 h-4" />
                  </div>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="block w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 dark:bg-navy-950 border border-slate-200 dark:border-navy-800 text-sm focus:border-indigo-500 outline-none transition-all"
                  />
                </div>
              </div>
            </div>

            <hr className="border-slate-100 dark:border-navy-850" />
            
            <div>
              <h3 className="text-sm font-bold text-slate-700 dark:text-slate-300 mb-4 flex items-center space-x-2">
                <FiLock className="w-4 h-4" />
                <span>Change Password (Leave blank to keep current)</span>
              </h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {/* New Password */}
                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                    New Password
                  </label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="At least 6 characters"
                    className="block w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-navy-950 border border-slate-200 dark:border-navy-800 text-sm focus:border-indigo-500 outline-none transition-all"
                  />
                </div>

                {/* Confirm New Password */}
                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                    Confirm New Password
                  </label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Verify password"
                    className="block w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-navy-950 border border-slate-200 dark:border-navy-800 text-sm focus:border-indigo-500 outline-none transition-all"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-4 border-t border-slate-100 dark:border-navy-850">
              <motion.button
                type="submit"
                disabled={isUpdating}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="inline-flex items-center justify-center space-x-2 px-6 py-2.5 rounded-xl text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 shadow-md shadow-indigo-500/10 cursor-pointer disabled:opacity-50"
              >
                <FiSave className="w-4 h-4" />
                <span>{isUpdating ? 'Saving Settings...' : 'Save Settings'}</span>
              </motion.button>
            </div>
          </form>
        </div>

      </div>
    </div>
  );
};

export default Profile;

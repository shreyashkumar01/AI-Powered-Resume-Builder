import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiCpu, FiLayout, FiDownload, FiCheckCircle, FiEdit3, FiSliders } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';

export const LandingPage = () => {
  const { isAuthenticated } = useAuth();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 100, damping: 15 } }
  };

  const features = [
    {
      icon: FiCpu,
      title: 'AI Smart Writing',
      desc: 'Generate professional summaries, improve descriptions, and suggest skills tailored to your job title in one click.'
    },
    {
      icon: FiLayout,
      title: 'Live Interactive Builder',
      desc: 'Type on the left and see changes instantly on the right. Perfect WYSIWYG synchronization.'
    },
    {
      icon: FiSliders,
      title: 'Aesthetic Tailoring',
      desc: 'Customize colors, typography fonts, spacing scales, and layout arrangements to matching your personality.'
    },
    {
      icon: FiCheckCircle,
      title: 'ATS-Friendly Formats',
      desc: 'All templates are engineered to successfully bypass automated applicant tracking screening systems.'
    },
    {
      icon: FiDownload,
      title: 'Pixel-Perfect Export',
      desc: 'Download high-definition multi-page print-ready PDFs without formatting breaking.'
    },
    {
      icon: FiEdit3,
      title: 'Cascading Revision Control',
      desc: 'Auto-saves drafts in the cloud as you type, allowing you to resume on any device at any time.'
    }
  ];

  const templates = [
    { name: 'Modern', style: 'border-t-4 border-indigo-500', desc: 'Sleek split layouts with custom branding highlights' },
    { name: 'ATS-Friendly', style: 'border-t-4 border-slate-700', desc: 'Standard single-column layout optimized for parsers' },
    { name: 'Corporate', style: 'border-t-4 border-blue-600', desc: 'Formal and balanced grids for corporate recruitment' },
    { name: 'Creative', style: 'border-t-4 border-emerald-500', desc: 'Modern blocks and vibrant accents for innovators' },
    { name: 'Minimal', style: 'border-t-4 border-amber-500', desc: 'Clean aesthetics with elegant spacing and typography' }
  ];

  return (
    <div className="bg-navy-950 text-white min-h-screen overflow-x-hidden">
      
      {/* Hero Section */}
      <section className="relative pt-24 pb-20 md:pt-32 md:pb-28 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center flex flex-col items-center">
        {/* Ambient Gradient Background Blobs */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-indigo-500/10 rounded-full blur-[100px] -z-10 pointer-events-none"></div>
        <div className="absolute top-1/3 left-1/4 w-[300px] h-[300px] bg-violet-600/10 rounded-full blur-[80px] -z-10 pointer-events-none"></div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-full bg-indigo-950/50 border border-indigo-500/20 text-indigo-400 text-xs font-semibold uppercase tracking-wider mb-6 backdrop-blur-md"
        >
          <FiCpu className="w-4 h-4 animate-spin-slow" />
          <span>Next-Generation Resume Builder</span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-4xl sm:text-5xl md:text-6xl font-display font-extrabold tracking-tight leading-tight max-w-4xl"
        >
          Craft Your Perfect Resume <br />
          <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
            Powered by Advanced AI
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mt-6 text-md sm:text-lg text-slate-400 max-w-2xl leading-relaxed font-light"
        >
          Create professional, ATS-optimized, beautifully tailored resumes in minutes. Let our AI write summaries, correct syntax, and refine project descriptions for you.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <Link to={isAuthenticated ? '/dashboard' : '/register'}>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="w-full sm:w-auto px-8 h-12 rounded-xl text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 shadow-lg shadow-indigo-500/25 transition-all flex items-center justify-center space-x-2 cursor-pointer"
            >
              <span>Build My Resume Now</span>
            </motion.button>
          </Link>
          <a href="#templates">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="w-full sm:w-auto px-8 h-12 rounded-xl text-sm font-semibold text-slate-200 border border-slate-800 hover:border-slate-700 bg-navy-900/50 hover:bg-navy-900 transition-all flex items-center justify-center space-x-2 cursor-pointer"
            >
              <span>Browse Templates</span>
            </motion.button>
          </a>
        </motion.div>
      </section>

      {/* Feature section */}
      <section id="features" className="py-20 border-t border-slate-900 bg-navy-950/50 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl font-display font-bold">Loaded with Premium Features</h2>
            <p className="mt-4 text-slate-400 font-light">
              We provide tools designed to meet the demands of modern recruiters and candidates.
            </p>
          </div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {features.map((feature, idx) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={idx}
                  variants={itemVariants}
                  className="glass p-8 rounded-2xl hover:border-indigo-500/30 transition-all group flex flex-col items-start text-left"
                >
                  <div className="w-12 h-12 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-400 mb-6 group-hover:scale-110 transition-transform duration-300">
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-semibold font-display mb-3 text-white group-hover:text-indigo-400 transition-colors">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-slate-400 leading-relaxed font-light">
                    {feature.desc}
                  </p>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* Templates showcase */}
      <section id="templates" className="py-20 border-t border-slate-900 bg-navy-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl font-display font-bold">Pick Your Design Strategy</h2>
            <p className="mt-4 text-slate-400 font-light">
              Choose from layouts optimized to showcase your achievements, and customize themes to suit your industry.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
            {templates.map((template, idx) => (
              <motion.div
                key={idx}
                whileHover={{ y: -8 }}
                className={`glass p-6 rounded-2xl flex flex-col justify-between text-left ${template.style}`}
              >
                <div>
                  <h4 className="text-lg font-bold font-display text-white mb-2">{template.name}</h4>
                  <p className="text-xs text-slate-400 leading-relaxed font-light">{template.desc}</p>
                </div>
                <div className="mt-8 pt-4 border-t border-slate-900/50 flex items-center justify-between text-xs text-indigo-400 font-medium">
                  <span>Tailorable</span>
                  <div className="flex space-x-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-indigo-500"></span>
                    <span className="w-2.5 h-2.5 rounded-full bg-violet-500"></span>
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="mt-16 text-center">
            <Link to={isAuthenticated ? '/dashboard' : '/register'}>
              <motion.button
                whileHover={{ scale: 1.05 }}
                className="px-8 h-12 rounded-xl text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 shadow-md shadow-indigo-500/20 cursor-pointer"
              >
                Select Template & Start
              </motion.button>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA section */}
      <section className="py-20 border-t border-slate-900 bg-navy-950/20 relative">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <div className="glass-card p-10 sm:p-14 rounded-3xl relative overflow-hidden border border-indigo-500/10">
            <div className="absolute top-0 right-0 w-[200px] h-[200px] bg-indigo-500/5 rounded-full blur-[40px] pointer-events-none"></div>
            
            <h2 className="text-3xl sm:text-4xl font-display font-bold text-white mb-4">
              Unlock Your Next Career Chapter
            </h2>
            <p className="text-sm text-slate-400 max-w-xl mx-auto leading-relaxed mb-8 font-light">
              Join thousands of job seekers who have leveraged ResumeAI to land interviews at top tech startups and global corporations.
            </p>
            <Link to={isAuthenticated ? '/dashboard' : '/register'}>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 h-12 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-indigo-500 to-violet-600 hover:from-indigo-600 hover:to-violet-700 shadow-lg shadow-indigo-500/20 cursor-pointer"
              >
                Create Your Resume
              </motion.button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;

import React from 'react';

export const CreativeTemplate = ({ data }) => {
  const { personalInfo = {}, education = [], skills = [], experience = [], projects = [], certifications = [], achievements = [], languages = [], theme = {} } = data;

  // Font mapping
  const fontClass = {
    'Inter': 'font-sans',
    'Outfit': 'font-display',
    'Lora': 'font-serif',
    'Playfair Display': 'font-playfair',
    'Fira Code': 'font-mono'
  }[theme.fontFamily] || 'font-sans';

  // Spacing mapping
  const marginClass = {
    'compact': 'mb-4',
    'normal': 'mb-6',
    'loose': 'mb-8'
  }[theme.spacing] || 'mb-6';

  const primaryColor = theme.primaryColor || '#ec4899'; // Default to pink-500 for creative

  return (
    <div 
      className={`w-full min-h-[1120px] bg-slate-50 text-slate-800 p-8 ${fontClass} shadow-lg print:shadow-none`}
      style={{ fontSize: theme.spacing === 'compact' ? '12px' : theme.spacing === 'loose' ? '15px' : '13px' }}
      id="resume-pdf-root"
    >
      {/* Creative Header Card */}
      <div className="bg-white border border-slate-200/60 rounded-3xl p-6 shadow-sm mb-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <span className="inline-flex px-3 py-1 bg-pink-100 dark:bg-pink-900/30 text-pink-600 rounded-full text-[10px] font-bold tracking-widest uppercase mb-2" style={{ color: primaryColor, backgroundColor: `${primaryColor}15` }}>
            Creative Portfolio
          </span>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 capitalize leading-tight">
            {personalInfo.fullName || 'Your Name'}
          </h1>
          <p className="text-sm font-bold tracking-wider mt-1 uppercase text-slate-500">
            {personalInfo.jobTitle || 'Target Professional Role'}
          </p>
        </div>

        {/* Contact info badges */}
        <div className="flex flex-wrap gap-2 text-[10px] text-slate-600">
          {personalInfo.email && <span className="bg-slate-100 border border-slate-200/50 px-2.5 py-1 rounded-xl">📧 {personalInfo.email}</span>}
          {personalInfo.phone && <span className="bg-slate-100 border border-slate-200/50 px-2.5 py-1 rounded-xl">📞 {personalInfo.phone}</span>}
          {personalInfo.location && <span className="bg-slate-100 border border-slate-200/50 px-2.5 py-1 rounded-xl">📍 {personalInfo.location}</span>}
          {personalInfo.website && <span className="bg-slate-100 border border-slate-200/50 px-2.5 py-1 rounded-xl">🔗 <a href={personalInfo.website} target="_blank" rel="noreferrer" className="hover:underline">Portfolio</a></span>}
          {personalInfo.linkedin && <span className="bg-slate-100 border border-slate-200/50 px-2.5 py-1 rounded-xl">💼 <a href={personalInfo.linkedin} target="_blank" rel="noreferrer" className="hover:underline">LinkedIn</a></span>}
          {personalInfo.github && <span className="bg-slate-100 border border-slate-200/50 px-2.5 py-1 rounded-xl">💻 <a href={personalInfo.github} target="_blank" rel="noreferrer" className="hover:underline">GitHub</a></span>}
        </div>
      </div>

      {/* Main Grid: Left major, right minor */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Left Column (Experience & Projects) */}
        <div className="md:col-span-2 space-y-6">
          {/* Summary */}
          {personalInfo.summary && (
            <div className="bg-white border border-slate-200/60 rounded-3xl p-6 shadow-sm">
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">About Me</h2>
              <p className="text-xs text-slate-600 leading-relaxed font-light">
                {personalInfo.summary}
              </p>
            </div>
          )}

          {/* Work Experience */}
          {experience && experience.length > 0 && (
            <div className="bg-white border border-slate-200/60 rounded-3xl p-6 shadow-sm">
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4">Professional Experience</h2>
              <div className="space-y-6">
                {experience.map((exp, idx) => (
                  <div key={idx} className="relative pl-6 border-l border-slate-200">
                    {/* Ring timeline marker */}
                    <div className="absolute top-1 -left-1.5 w-3 h-3 rounded-full border bg-white" style={{ borderColor: primaryColor }}></div>
                    
                    <div className="flex flex-col sm:flex-row justify-between text-xs mb-1.5">
                      <span className="font-bold text-slate-900">{exp.position} <span className="font-light text-slate-400">at</span> {exp.company}</span>
                      <span className="text-[10px] text-slate-400 bg-slate-100 px-2 py-0.5 rounded-md self-start sm:self-center font-medium mt-1 sm:mt-0">
                        {exp.startDate} - {exp.current ? 'Present' : exp.endDate}
                      </span>
                    </div>
                    {exp.location && <p className="text-[10px] text-slate-400 font-light italic mb-1.5">{exp.location}</p>}
                    <p className="text-xs text-slate-600 whitespace-pre-line leading-relaxed font-light">
                      {exp.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Projects */}
          {projects && projects.length > 0 && (
            <div className="bg-white border border-slate-200/60 rounded-3xl p-6 shadow-sm">
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4">Notable Projects</h2>
              <div className="space-y-5">
                {projects.map((proj, idx) => (
                  <div key={idx} className="text-xs border-b border-slate-100 pb-4 last:border-b-0 last:pb-0">
                    <div className="flex justify-between font-bold text-slate-900 mb-1">
                      <span>
                        {proj.name}
                        {proj.link && (
                          <a href={proj.link} target="_blank" rel="noreferrer" className="ml-1 text-[10px] font-normal hover:underline" style={{ color: primaryColor }}>
                            [Project Link]
                          </a>
                        )}
                      </span>
                      {proj.technologies && <span className="text-[9px] text-slate-400 font-medium px-2 py-0.5 bg-slate-50 border rounded-md self-center">{proj.technologies}</span>}
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed font-light mt-1.5 whitespace-pre-line">
                      {proj.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Column (Skills, Education, Languages) */}
        <div className="space-y-6">
          {/* Skills */}
          {skills && skills.length > 0 && (
            <div className="bg-white border border-slate-200/60 rounded-3xl p-6 shadow-sm">
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">Professional Skills</h2>
              <div className="flex flex-wrap gap-1.5">
                {skills.map((skill, idx) => (
                  <span 
                    key={idx} 
                    className="px-2.5 py-1 rounded-xl bg-slate-50 border border-slate-200 text-slate-700 text-xs font-medium hover:scale-105 transition-transform"
                    style={{ borderLeft: `3px solid ${primaryColor}` }}
                  >
                    {skill.name}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Education */}
          {education && education.length > 0 && (
            <div className="bg-white border border-slate-200/60 rounded-3xl p-6 shadow-sm">
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">Academic Experience</h2>
              <div className="space-y-4">
                {education.map((edu, idx) => (
                  <div key={idx} className="text-xs">
                    <p className="font-bold text-slate-900">{edu.degree}</p>
                    <p className="text-slate-500 text-[11px] font-medium leading-tight">{edu.fieldOfStudy}</p>
                    <p className="text-slate-600 font-semibold mt-1">{edu.school}</p>
                    <p className="text-[10px] text-slate-400 font-light mt-0.5">{edu.startDate} - {edu.current ? 'Present' : edu.endDate}</p>
                    {edu.description && <p className="text-[11px] text-slate-500 font-light mt-1 leading-normal whitespace-pre-line">{edu.description}</p>}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Languages */}
          {languages && languages.length > 0 && (
            <div className="bg-white border border-slate-200/60 rounded-3xl p-6 shadow-sm">
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">Languages</h2>
              <ul className="space-y-2 text-xs">
                {languages.map((lang, idx) => (
                  <li key={idx} className="flex justify-between items-center bg-slate-50 border border-slate-100 rounded-xl px-3 py-1.5">
                    <span className="font-semibold text-slate-700">{lang.language}</span>
                    <span className="text-[10px] text-white px-2 py-0.5 rounded-full" style={{ backgroundColor: primaryColor }}>{lang.proficiency}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Certifications */}
          {certifications && certifications.length > 0 && (
            <div className="bg-white border border-slate-200/60 rounded-3xl p-6 shadow-sm">
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">Certifications</h2>
              <ul className="space-y-3 text-xs">
                {certifications.map((cert, idx) => (
                  <li key={idx} className="text-slate-600 font-light leading-snug">
                    <strong className="text-slate-800 font-medium">{cert.name}</strong> <br />
                    <span className="text-[10px] text-slate-400 font-semibold">{cert.issuer} ({cert.date})</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default CreativeTemplate;

import React from 'react';

export const MinimalTemplate = ({ data }) => {
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

  const primaryColor = theme.primaryColor || '#1e293b';

  return (
    <div 
      className={`w-full min-h-[1120px] bg-white text-slate-800 p-12 ${fontClass} shadow-lg print:shadow-none`}
      style={{ fontSize: theme.spacing === 'compact' ? '12px' : theme.spacing === 'loose' ? '15px' : '13px' }}
      id="resume-pdf-root"
    >
      {/* Centered spacious header */}
      <div className="text-center mb-10">
        <h1 className="text-3xl font-light tracking-wide text-slate-900 uppercase">
          {personalInfo.fullName || 'Your Full Name'}
        </h1>
        <p className="text-xs font-semibold tracking-widest text-slate-500 uppercase mt-2.5">
          {personalInfo.jobTitle || 'Target Professional Role'}
        </p>
        
        {/* Contact Links */}
        <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1.5 text-[11px] text-slate-400 mt-4 max-w-xl mx-auto">
          {personalInfo.email && <span>{personalInfo.email}</span>}
          {personalInfo.phone && <span>•</span>}
          {personalInfo.phone && <span>{personalInfo.phone}</span>}
          {personalInfo.location && <span>•</span>}
          {personalInfo.location && <span>{personalInfo.location}</span>}
          {personalInfo.website && <span>•</span>}
          {personalInfo.website && <span><a href={personalInfo.website} target="_blank" rel="noreferrer" className="hover:underline">Portfolio</a></span>}
          {personalInfo.linkedin && <span>•</span>}
          {personalInfo.linkedin && <span><a href={personalInfo.linkedin} target="_blank" rel="noreferrer" className="hover:underline">LinkedIn</a></span>}
          {personalInfo.github && <span>•</span>}
          {personalInfo.github && <span><a href={personalInfo.github} target="_blank" rel="noreferrer" className="hover:underline">GitHub</a></span>}
        </div>
      </div>

      {/* Summary */}
      {personalInfo.summary && (
        <div className={marginClass}>
          <p className="text-xs leading-relaxed text-slate-600 font-light italic max-w-3xl mx-auto text-center">
            "{personalInfo.summary}"
          </p>
        </div>
      )}

      {/* Experience */}
      {experience && experience.length > 0 && (
        <div className={marginClass}>
          <h2 className="text-[11px] font-bold uppercase tracking-widest text-slate-400 border-b border-slate-100 pb-1 mb-4">
            Experience
          </h2>
          <div className="space-y-6 max-w-3xl mx-auto">
            {experience.map((exp, idx) => (
              <div key={idx} className="text-xs">
                <div className="flex justify-between items-baseline mb-1">
                  <h3 className="font-bold text-slate-800">
                    {exp.position} <span className="font-light text-slate-400">—</span> <span className="font-medium text-slate-600">{exp.company}</span>
                  </h3>
                  <span className="text-[10px] text-slate-400 font-medium whitespace-nowrap">{exp.startDate} - {exp.current ? 'Present' : exp.endDate}</span>
                </div>
                {exp.location && <p className="text-[10px] text-slate-400 font-light italic mb-2">{exp.location}</p>}
                <p className="text-slate-600 leading-relaxed font-light whitespace-pre-line">
                  {exp.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Projects */}
      {projects && projects.length > 0 && (
        <div className={marginClass}>
          <h2 className="text-[11px] font-bold uppercase tracking-widest text-slate-400 border-b border-slate-100 pb-1 mb-4">
            Projects
          </h2>
          <div className="space-y-6 max-w-3xl mx-auto">
            {projects.map((proj, idx) => (
              <div key={idx} className="text-xs">
                <div className="flex justify-between items-baseline mb-1">
                  <h3 className="font-bold text-slate-800">
                    {proj.name}
                    {proj.link && <a href={proj.link} target="_blank" rel="noreferrer" className="text-[10px] font-light ml-1.5 hover:underline" style={{ color: primaryColor }}>[Link]</a>}
                  </h3>
                  {proj.technologies && <span className="text-[10px] text-slate-400 font-light italic">{proj.technologies}</span>}
                </div>
                <p className="text-slate-600 leading-relaxed font-light whitespace-pre-line mt-1">
                  {proj.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Education */}
      {education && education.length > 0 && (
        <div className={marginClass}>
          <h2 className="text-[11px] font-bold uppercase tracking-widest text-slate-400 border-b border-slate-100 pb-1 mb-4">
            Education
          </h2>
          <div className="space-y-4 max-w-3xl mx-auto">
            {education.map((edu, idx) => (
              <div key={idx} className="text-xs">
                <div className="flex justify-between items-baseline">
                  <span className="font-bold text-slate-800">{edu.degree} in {edu.fieldOfStudy}</span>
                  <span className="text-[10px] text-slate-400 font-medium whitespace-nowrap">{edu.startDate} - {edu.current ? 'Present' : edu.endDate}</span>
                </div>
                <p className="text-slate-500 font-medium">{edu.school}</p>
                {edu.description && <p className="text-[11px] text-slate-500 font-light mt-1 whitespace-pre-line">{edu.description}</p>}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Skills & Certifications */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-3xl mx-auto pt-2">
        {/* Skills */}
        {skills && skills.length > 0 && (
          <div>
            <h2 className="text-[11px] font-bold uppercase tracking-widest text-slate-400 border-b border-slate-100 pb-1 mb-3">
              Skills
            </h2>
            <div className="flex flex-wrap gap-1.5">
              {skills.map((skill, idx) => (
                <span key={idx} className="text-xs text-slate-600 font-light bg-slate-50 px-2 py-0.5 border border-slate-100 rounded">
                  {skill.name}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Certifications, Achievements & Languages */}
        <div className="space-y-4">
          {certifications && certifications.length > 0 && (
            <div>
              <h2 className="text-[11px] font-bold uppercase tracking-widest text-slate-400 border-b border-slate-100 pb-1 mb-3">
                Certifications
              </h2>
              <ul className="space-y-1 text-xs text-slate-600 font-light list-disc pl-4">
                {certifications.map((cert, idx) => (
                  <li key={idx}>
                    {cert.name} — {cert.issuer}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {languages && languages.length > 0 && (
            <div>
              <h2 className="text-[11px] font-bold uppercase tracking-widest text-slate-400 border-b border-slate-100 pb-1 mb-3">
                Languages
              </h2>
              <p className="text-xs text-slate-600 font-light">
                {languages.map(l => `${l.language} (${l.proficiency})`).join(', ')}
              </p>
            </div>
          )}
        </div>
      </div>

    </div>
  );
};

export default MinimalTemplate;

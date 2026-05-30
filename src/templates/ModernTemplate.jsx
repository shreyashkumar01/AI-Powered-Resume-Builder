import React from 'react';

export const ModernTemplate = ({ data }) => {
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
  const paddingClass = {
    'compact': 'py-1 px-2',
    'normal': 'py-2 px-3',
    'loose': 'py-3.5 px-4'
  }[theme.spacing] || 'py-2 px-3';

  const marginClass = {
    'compact': 'mb-3',
    'normal': 'mb-5',
    'loose': 'mb-7'
  }[theme.spacing] || 'mb-5';

  const primaryColor = theme.primaryColor || '#6366f1';

  return (
    <div 
      className={`w-full min-h-[1120px] bg-white text-slate-800 ${fontClass} flex shadow-lg print:shadow-none`}
      style={{ fontSize: theme.spacing === 'compact' ? '12px' : theme.spacing === 'loose' ? '15px' : '13px' }}
      id="resume-pdf-root"
    >
      {/* Sidebar */}
      <aside className="w-1/3 bg-slate-50 border-r border-slate-100 p-6 flex flex-col justify-between">
        <div className="space-y-6">
          {/* Profile Photo Mock or Placeholder if needed, but standard text is cleaner */}
          
          {/* Contact Details */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">Contact</h3>
            <ul className="space-y-2 text-xs text-slate-600 break-all">
              {personalInfo.email && (
                <li>
                  <p className="font-semibold text-slate-500 text-[10px] uppercase">Email</p>
                  <p>{personalInfo.email}</p>
                </li>
              )}
              {personalInfo.phone && (
                <li>
                  <p className="font-semibold text-slate-500 text-[10px] uppercase">Phone</p>
                  <p>{personalInfo.phone}</p>
                </li>
              )}
              {personalInfo.location && (
                <li>
                  <p className="font-semibold text-slate-500 text-[10px] uppercase">Location</p>
                  <p>{personalInfo.location}</p>
                </li>
              )}
              {personalInfo.website && (
                <li>
                  <p className="font-semibold text-slate-500 text-[10px] uppercase">Portfolio</p>
                  <a href={personalInfo.website} target="_blank" rel="noreferrer" className="hover:underline">{personalInfo.website}</a>
                </li>
              )}
              {personalInfo.linkedin && (
                <li>
                  <p className="font-semibold text-slate-500 text-[10px] uppercase">LinkedIn</p>
                  <a href={personalInfo.linkedin} target="_blank" rel="noreferrer" className="hover:underline">{personalInfo.linkedin}</a>
                </li>
              )}
              {personalInfo.github && (
                <li>
                  <p className="font-semibold text-slate-500 text-[10px] uppercase">GitHub</p>
                  <a href={personalInfo.github} target="_blank" rel="noreferrer" className="hover:underline">{personalInfo.github}</a>
                </li>
              )}
            </ul>
          </div>

          {/* Skills */}
          {skills && skills.length > 0 && (
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">Skills</h3>
              <div className="flex flex-wrap gap-1.5">
                {skills.map((skill, idx) => (
                  <span 
                    key={idx}
                    className="px-2.5 py-1 rounded bg-white border border-slate-200 text-slate-700 text-xs font-medium"
                  >
                    {skill.name}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Languages */}
          {languages && languages.length > 0 && (
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">Languages</h3>
              <ul className="space-y-1.5 text-xs text-slate-600">
                {languages.map((lang, idx) => (
                  <li key={idx} className="flex justify-between">
                    <span className="font-medium text-slate-700">{lang.language}</span>
                    <span className="text-slate-400 font-light italic">{lang.proficiency}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
        
        {/* Attribution / watermark (extremely subtle, nice for SaaS branding) */}
        <div className="pt-8 text-[9px] text-slate-300 text-center font-light">
          Generated via ResumeAI
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8 space-y-6">
        {/* Name and Title */}
        <div className="border-b-2 pb-6" style={{ borderColor: primaryColor }}>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 capitalize leading-tight">
            {personalInfo.fullName || 'Your Name'}
          </h1>
          <p className="text-md font-bold uppercase tracking-wider mt-1" style={{ color: primaryColor }}>
            {personalInfo.jobTitle || 'Target Professional Role'}
          </p>
          {personalInfo.summary && (
            <p className="text-xs leading-relaxed text-slate-600 mt-4 font-light">
              {personalInfo.summary}
            </p>
          )}
        </div>

        {/* Experience Section */}
        {experience && experience.length > 0 && (
          <section className={marginClass}>
            <h2 className="text-sm font-bold uppercase tracking-wider border-b border-slate-100 pb-1.5 mb-3" style={{ color: primaryColor }}>
              Work Experience
            </h2>
            <div className="space-y-4">
              {experience.map((exp, idx) => (
                <div key={idx} className="text-xs">
                  <div className="flex justify-between font-bold text-slate-900">
                    <span>{exp.position} — <span className="font-semibold text-slate-600">{exp.company}</span></span>
                    <span className="text-slate-500 font-medium">{exp.startDate} - {exp.current ? 'Present' : exp.endDate}</span>
                  </div>
                  {exp.location && <p className="text-[10px] text-slate-400 font-light mb-1.5">{exp.location}</p>}
                  <p className="text-slate-600 whitespace-pre-line leading-relaxed font-light">
                    {exp.description}
                  </p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Projects Section */}
        {projects && projects.length > 0 && (
          <section className={marginClass}>
            <h2 className="text-sm font-bold uppercase tracking-wider border-b border-slate-100 pb-1.5 mb-3" style={{ color: primaryColor }}>
              Projects
            </h2>
            <div className="space-y-4">
              {projects.map((proj, idx) => (
                <div key={idx} className="text-xs">
                  <div className="flex justify-between font-bold text-slate-900">
                    <span>
                      {proj.name}
                      {proj.link && (
                        <a href={proj.link} target="_blank" rel="noreferrer" className="ml-1 text-[10px] font-normal hover:underline" style={{ color: primaryColor }}>
                          [Link]
                        </a>
                      )}
                    </span>
                    {proj.technologies && <span className="text-slate-400 font-medium text-[10px]">{proj.technologies}</span>}
                  </div>
                  <p className="text-slate-600 leading-relaxed font-light mt-1 whitespace-pre-line">
                    {proj.description}
                  </p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Education Section */}
        {education && education.length > 0 && (
          <section className={marginClass}>
            <h2 className="text-sm font-bold uppercase tracking-wider border-b border-slate-100 pb-1.5 mb-3" style={{ color: primaryColor }}>
              Education
            </h2>
            <div className="space-y-3.5">
              {education.map((edu, idx) => (
                <div key={idx} className="text-xs">
                  <div className="flex justify-between font-bold text-slate-900">
                    <span>{edu.degree} in {edu.fieldOfStudy}</span>
                    <span className="text-slate-500 font-medium">{edu.startDate} - {edu.current ? 'Present' : edu.endDate}</span>
                  </div>
                  <p className="text-slate-600 font-medium">{edu.school}</p>
                  {edu.description && <p className="text-[11px] text-slate-500 font-light mt-1 whitespace-pre-line">{edu.description}</p>}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Certifications Section */}
        {certifications && certifications.length > 0 && (
          <section className={marginClass}>
            <h2 className="text-sm font-bold uppercase tracking-wider border-b border-slate-100 pb-1.5 mb-2" style={{ color: primaryColor }}>
              Certifications
            </h2>
            <ul className="grid grid-cols-2 gap-2 text-xs">
              {certifications.map((cert, idx) => (
                <li key={idx} className="text-slate-600 font-light">
                  <strong className="text-slate-800 font-medium">{cert.name}</strong> — {cert.issuer} ({cert.date})
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* Achievements Section */}
        {achievements && achievements.length > 0 && (
          <section className={marginClass}>
            <h2 className="text-sm font-bold uppercase tracking-wider border-b border-slate-100 pb-1.5 mb-2" style={{ color: primaryColor }}>
              Achievements
            </h2>
            <ul className="list-disc pl-4 space-y-1 text-xs text-slate-600">
              {achievements.map((ach, idx) => (
                <li key={idx} className="font-light">
                  <strong className="text-slate-800 font-medium">{ach.title}</strong>: {ach.description}
                </li>
              ))}
            </ul>
          </section>
        )}
      </main>
    </div>
  );
};

export default ModernTemplate;

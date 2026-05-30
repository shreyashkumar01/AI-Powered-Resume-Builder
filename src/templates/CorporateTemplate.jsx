import React from 'react';

export const CorporateTemplate = ({ data }) => {
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
    'compact': 'mb-3',
    'normal': 'mb-5',
    'loose': 'mb-7'
  }[theme.spacing] || 'mb-5';

  const primaryColor = theme.primaryColor || '#1e3a8a'; // Default to deep blue for corporate

  return (
    <div 
      className={`w-full min-h-[1120px] bg-white text-slate-800 p-8 ${fontClass} shadow-lg print:shadow-none`}
      style={{ fontSize: theme.spacing === 'compact' ? '12px' : theme.spacing === 'loose' ? '15px' : '13px' }}
      id="resume-pdf-root"
    >
      {/* Formal Top Header Banner */}
      <div className="border-l-4 pl-6 py-4 bg-slate-50 border-indigo-600 mb-6 flex flex-col md:flex-row md:justify-between md:items-center gap-4" style={{ borderColor: primaryColor }}>
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 capitalize leading-none">
            {personalInfo.fullName || 'Your Full Name'}
          </h1>
          <p className="text-sm font-semibold tracking-wider mt-1.5 uppercase" style={{ color: primaryColor }}>
            {personalInfo.jobTitle || 'Target Professional Role'}
          </p>
        </div>
        
        {/* Contact Grid */}
        <div className="grid grid-cols-2 gap-x-6 gap-y-1 text-[11px] text-slate-500 max-w-sm">
          {personalInfo.email && <div><strong>Email:</strong> {personalInfo.email}</div>}
          {personalInfo.phone && <div><strong>Phone:</strong> {personalInfo.phone}</div>}
          {personalInfo.location && <div><strong>Location:</strong> {personalInfo.location}</div>}
          {personalInfo.website && (
            <div className="truncate">
              <strong>Web:</strong> <a href={personalInfo.website} target="_blank" rel="noreferrer" className="hover:underline">{personalInfo.website.replace(/^https?:\/\//, '')}</a>
            </div>
          )}
          {personalInfo.linkedin && (
            <div className="truncate">
              <strong>LI:</strong> <a href={personalInfo.linkedin} target="_blank" rel="noreferrer" className="hover:underline">{personalInfo.linkedin.replace(/^https?:\/\/www.linkedin.com\/in\//, '')}</a>
            </div>
          )}
          {personalInfo.github && (
            <div className="truncate">
              <strong>GH:</strong> <a href={personalInfo.github} target="_blank" rel="noreferrer" className="hover:underline">{personalInfo.github.replace(/^https?:\/\/github.com\//, '')}</a>
            </div>
          )}
        </div>
      </div>

      {/* Summary */}
      {personalInfo.summary && (
        <div className={marginClass}>
          <h2 className="text-xs font-bold uppercase tracking-wider border-b-2 pb-1 mb-2 text-slate-900" style={{ borderColor: primaryColor }}>
            Executive Summary
          </h2>
          <p className="text-xs text-slate-600 leading-relaxed font-light">
            {personalInfo.summary}
          </p>
        </div>
      )}

      {/* Skills */}
      {skills && skills.length > 0 && (
        <div className={marginClass}>
          <h2 className="text-xs font-bold uppercase tracking-wider border-b-2 pb-1 mb-2 text-slate-900" style={{ borderColor: primaryColor }}>
            Key Competencies
          </h2>
          <div className="flex flex-wrap gap-2 text-xs">
            {skills.map((skill, idx) => (
              <span key={idx} className="font-semibold text-slate-800 bg-slate-100 border border-slate-200 px-2 py-0.5 rounded">
                {skill.name} <span className="font-light text-[9px] text-slate-400">({skill.level})</span>
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Experience */}
      {experience && experience.length > 0 && (
        <div className={marginClass}>
          <h2 className="text-xs font-bold uppercase tracking-wider border-b-2 pb-1 mb-3 text-slate-900" style={{ borderColor: primaryColor }}>
            Professional History
          </h2>
          <div className="space-y-4">
            {experience.map((exp, idx) => (
              <div key={idx} className="text-xs">
                <div className="flex justify-between font-bold text-slate-900">
                  <span>{exp.position}   |   <span className="font-semibold text-slate-700">{exp.company}</span></span>
                  <span className="text-slate-500 font-medium">{exp.startDate} - {exp.current ? 'Present' : exp.endDate}</span>
                </div>
                {exp.location && <p className="text-[10px] text-slate-400 font-light mb-1.5">{exp.location}</p>}
                <p className="text-slate-600 whitespace-pre-line leading-relaxed font-light">
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
          <h2 className="text-xs font-bold uppercase tracking-wider border-b-2 pb-1 mb-3 text-slate-900" style={{ borderColor: primaryColor }}>
            Notable Projects
          </h2>
          <div className="space-y-4">
            {projects.map((proj, idx) => (
              <div key={idx} className="text-xs">
                <div className="flex justify-between font-bold text-slate-900">
                  <span>
                    {proj.name}
                    {proj.link && (
                      <a href={proj.link} target="_blank" rel="noreferrer" className="ml-1.5 text-[10px] font-normal hover:underline" style={{ color: primaryColor }}>
                        [External Link]
                      </a>
                    )}
                  </span>
                  {proj.technologies && <span className="text-slate-400 text-[10px] font-medium">{proj.technologies}</span>}
                </div>
                <p className="text-slate-600 leading-relaxed font-light mt-1.5 whitespace-pre-line">
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
          <h2 className="text-xs font-bold uppercase tracking-wider border-b-2 pb-1 mb-2.5 text-slate-900" style={{ borderColor: primaryColor }}>
            Education & Academic Credentials
          </h2>
          <div className="space-y-3">
            {education.map((edu, idx) => (
              <div key={idx} className="text-xs">
                <div className="flex justify-between font-bold text-slate-900">
                  <span>{edu.degree} in {edu.fieldOfStudy}</span>
                  <span className="text-slate-500 font-medium">{edu.startDate} - {edu.current ? 'Present' : edu.endDate}</span>
                </div>
                <p className="text-slate-600 font-semibold">{edu.school}</p>
                {edu.description && <p className="text-[11px] text-slate-500 font-light mt-1 whitespace-pre-line">{edu.description}</p>}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Certifications, Achievements & Languages */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
        {certifications && certifications.length > 0 && (
          <div>
            <h2 className="text-xs font-bold uppercase tracking-wider border-b-2 pb-1 mb-2 text-slate-900" style={{ borderColor: primaryColor }}>
              Certifications
            </h2>
            <ul className="space-y-1.5 text-xs text-slate-600 font-light">
              {certifications.map((cert, idx) => (
                <li key={idx}>
                  <strong>{cert.name}</strong> — {cert.issuer} ({cert.date})
                </li>
              ))}
            </ul>
          </div>
        )}

        {(achievements?.length > 0 || languages?.length > 0) && (
          <div>
            {achievements && achievements.length > 0 && (
              <div className="mb-4">
                <h2 className="text-xs font-bold uppercase tracking-wider border-b-2 pb-1 mb-2 text-slate-900" style={{ borderColor: primaryColor }}>
                  Achievements
                </h2>
                <ul className="list-disc pl-4 space-y-1 text-xs text-slate-600 font-light">
                  {achievements.map((ach, idx) => (
                    <li key={idx}>
                      <strong>{ach.title}</strong>: {ach.description}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {languages && languages.length > 0 && (
              <div>
                <h2 className="text-xs font-bold uppercase tracking-wider border-b-2 pb-1 mb-2 text-slate-900" style={{ borderColor: primaryColor }}>
                  Languages
                </h2>
                <ul className="space-y-1.5 text-xs text-slate-600">
                  {languages.map((lang, idx) => (
                    <li key={idx} className="flex justify-between">
                      <span className="font-semibold text-slate-700">{lang.language}</span>
                      <span className="text-slate-400 font-light italic">{lang.proficiency}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default CorporateTemplate;

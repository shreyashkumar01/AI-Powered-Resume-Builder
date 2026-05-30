import React from 'react';

export const AtsTemplate = ({ data }) => {
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
    'normal': 'mb-4.5',
    'loose': 'mb-6'
  }[theme.spacing] || 'mb-4.5';

  // Construct contact row
  const contactDetails = [];
  if (personalInfo.email) contactDetails.push(personalInfo.email);
  if (personalInfo.phone) contactDetails.push(personalInfo.phone);
  if (personalInfo.location) contactDetails.push(personalInfo.location);
  if (personalInfo.website) contactDetails.push(personalInfo.website);
  if (personalInfo.linkedin) contactDetails.push(personalInfo.linkedin);
  if (personalInfo.github) contactDetails.push(personalInfo.github);

  return (
    <div 
      className={`w-full min-h-[1120px] bg-white text-black p-10 ${fontClass} shadow-lg print:shadow-none`}
      style={{ fontSize: theme.spacing === 'compact' ? '12px' : theme.spacing === 'loose' ? '15px' : '13px' }}
      id="resume-pdf-root"
    >
      {/* Centered Name and contact */}
      <div className="text-center border-b border-black pb-4 mb-5">
        <h1 className="text-2xl font-bold uppercase tracking-tight text-black">
          {personalInfo.fullName || 'Your Full Name'}
        </h1>
        <p className="text-xs font-bold uppercase tracking-widest text-slate-700 mt-1">
          {personalInfo.jobTitle || 'Target Role'}
        </p>
        <p className="text-[11px] text-slate-600 mt-2.5 font-light leading-relaxed max-w-2xl mx-auto">
          {contactDetails.join('   |   ')}
        </p>
      </div>

      {/* Summary */}
      {personalInfo.summary && (
        <div className={marginClass}>
          <h2 className="text-xs font-bold uppercase tracking-wider border-b border-slate-300 pb-0.5 mb-1.5">
            Professional Summary
          </h2>
          <p className="text-xs text-slate-800 leading-relaxed font-light">
            {personalInfo.summary}
          </p>
        </div>
      )}

      {/* Skills */}
      {skills && skills.length > 0 && (
        <div className={marginClass}>
          <h2 className="text-xs font-bold uppercase tracking-wider border-b border-slate-300 pb-0.5 mb-1.5">
            Core Competencies
          </h2>
          <p className="text-xs text-slate-800 leading-relaxed font-light">
            {skills.map(s => s.name).join(', ')}
          </p>
        </div>
      )}

      {/* Experience */}
      {experience && experience.length > 0 && (
        <div className={marginClass}>
          <h2 className="text-xs font-bold uppercase tracking-wider border-b border-slate-300 pb-0.5 mb-2.5">
            Professional Experience
          </h2>
          <div className="space-y-3">
            {experience.map((exp, idx) => (
              <div key={idx}>
                <div className="flex justify-between items-baseline font-bold text-slate-900 text-xs">
                  <span>{exp.position}   |   <span className="font-semibold text-slate-700">{exp.company}</span></span>
                  <span className="text-[11px] text-slate-500 font-medium">{exp.startDate} - {exp.current ? 'Present' : exp.endDate}</span>
                </div>
                {exp.location && <p className="text-[10px] text-slate-400 font-light italic mb-1">{exp.location}</p>}
                <p className="text-xs text-slate-800 leading-relaxed font-light whitespace-pre-line">
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
          <h2 className="text-xs font-bold uppercase tracking-wider border-b border-slate-300 pb-0.5 mb-2.5">
            Key Projects
          </h2>
          <div className="space-y-3">
            {projects.map((proj, idx) => (
              <div key={idx}>
                <div className="flex justify-between items-baseline font-bold text-slate-900 text-xs">
                  <span>
                    {proj.name}
                    {proj.link && <span className="font-light text-[10px] text-slate-500 font-normal ml-1">({proj.link})</span>}
                  </span>
                  {proj.technologies && <span className="text-[10px] text-slate-500 font-medium italic">{proj.technologies}</span>}
                </div>
                <p className="text-xs text-slate-800 leading-relaxed font-light mt-0.5 whitespace-pre-line">
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
          <h2 className="text-xs font-bold uppercase tracking-wider border-b border-slate-300 pb-0.5 mb-2">
            Education
          </h2>
          <div className="space-y-2">
            {education.map((edu, idx) => (
              <div key={idx} className="flex justify-between items-baseline">
                <div className="text-xs">
                  <span className="font-bold text-slate-900">{edu.degree} in {edu.fieldOfStudy}</span>   |   <span className="text-slate-700">{edu.school}</span>
                  {edu.description && <p className="text-[10px] text-slate-500 mt-0.5 font-light">{edu.description}</p>}
                </div>
                <span className="text-[11px] text-slate-500 font-medium whitespace-nowrap">{edu.startDate} - {edu.current ? 'Present' : edu.endDate}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Certifications & Achievements */}
      {(certifications?.length > 0 || achievements?.length > 0 || languages?.length > 0) && (
        <div className="grid grid-cols-1 gap-4 pt-1.5">
          {certifications && certifications.length > 0 && (
            <div>
              <h2 className="text-xs font-bold uppercase tracking-wider border-b border-slate-300 pb-0.5 mb-1.5">
                Certifications
              </h2>
              <ul className="list-disc pl-4 space-y-0.5 text-xs text-slate-800 font-light">
                {certifications.map((cert, idx) => (
                  <li key={idx}>
                    {cert.name} — {cert.issuer} ({cert.date}) {cert.link && `[${cert.link}]`}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {achievements && achievements.length > 0 && (
            <div>
              <h2 className="text-xs font-bold uppercase tracking-wider border-b border-slate-300 pb-0.5 mb-1.5">
                Achievements & Honors
              </h2>
              <ul className="list-disc pl-4 space-y-0.5 text-xs text-slate-800 font-light">
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
              <h2 className="text-xs font-bold uppercase tracking-wider border-b border-slate-300 pb-0.5 mb-1.5">
                Languages
              </h2>
              <p className="text-xs text-slate-800 leading-relaxed font-light">
                {languages.map(l => `${l.language} (${l.proficiency})`).join(', ')}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AtsTemplate;

import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize Gemini API client if key is present
const getGeminiClient = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === 'YOUR_GEMINI_API_KEY' || apiKey.trim() === '') {
    return null;
  }
  return new GoogleGenerativeAI(apiKey);
};

// ==========================================
// FALLBACK ENGINES (If Gemini API is absent)
// ==========================================

const fallbackSummary = (jobTitle, skills) => {
  const title = jobTitle || 'Professional';
  const skillsList = skills ? skills.join(', ') : '';
  const skillsSentence = skillsList ? ` specializing in ${skillsList}` : '';
  
  return `Results-driven and highly skilled ${title}${skillsSentence}. Adept at designing, building, and implementing scalable solutions, optimizing user interfaces, and collaborating on cross-functional development teams. Possesses strong analytical and problem-solving capabilities, with a proven track record of delivering clean, efficient, and production-ready code.`;
};

const fallbackObjective = (jobTitle) => {
  const title = jobTitle || 'Professional';
  return `Dedicated and forward-thinking ${title} seeking an opportunity to apply technical expertise, creative problem-solving skills, and passion for innovation in a dynamic, growth-oriented environment. Goal-oriented team player committed to delivering high-quality results, learning new technologies, and driving organizational success.`;
};

const fallbackImprove = (text) => {
  if (!text || text.trim() === '') return 'Please provide some text to improve.';
  
  // Custom heuristics for typical phrases
  const lower = text.toLowerCase();
  if (lower.includes('worked on') || lower.includes('made a') || lower.includes('built a')) {
    return `Designed, developed, and deployed an interactive application, implementing modern coding practices to enhance scalability, streamline responsiveness, and optimize overall system efficiency.`;
  }
  if (lower.includes('fast') || lower.includes('speed') || lower.includes('performance')) {
    return `Engineered performance optimizations, refactoring key workflows and database queries to significantly reduce latency, increase throughput, and deliver a seamless user experience.`;
  }
  if (lower.includes('fixed') || lower.includes('bugs') || lower.includes('problems')) {
    return `Identified, diagnosed, and resolved critical system bottlenecks and software defects, substantially improving codebase stability, error handling, and runtime reliability.`;
  }
  
  // Standard generic professional rewrite
  return `Successfully spearheaded the optimization of user workflows by developing clean, modular, and reusable codebase patterns. Boosted productivity and maintained high standards of code quality and coverage.`;
};

const fallbackSkills = (jobTitle) => {
  const title = (jobTitle || '').toLowerCase();
  if (title.includes('developer') || title.includes('engineer') || title.includes('programmer')) {
    if (title.includes('frontend') || title.includes('react') || title.includes('web')) {
      return ['React.js', 'JavaScript (ES6+)', 'TypeScript', 'Tailwind CSS', 'Redux Toolkit', 'HTML5 & CSS3', 'Git/GitHub', 'REST APIs', 'Webpack/Vite', 'Unit Testing'];
    }
    if (title.includes('backend') || title.includes('node')) {
      return ['Node.js', 'Express.js', 'MongoDB', 'REST APIs', 'SQL / PostgreSQL', 'GraphQL', 'JWT Authentication', 'Git/GitHub', 'Docker', 'AWS basics'];
    }
    // Fullstack
    return ['React.js', 'Node.js', 'Express.js', 'MongoDB', 'JavaScript (ES6+)', 'TypeScript', 'Tailwind CSS', 'RESTful APIs', 'Git/GitHub', 'System Design'];
  }
  if (title.includes('designer') || title.includes('ui') || title.includes('ux')) {
    return ['UI/UX Design', 'Figma', 'Adobe XD', 'Wireframing', 'Prototyping', 'User Research', 'Design Systems', 'Responsive Design', 'Visual Hierarchy', 'Information Architecture'];
  }
  if (title.includes('manager') || title.includes('product') || title.includes('project')) {
    return ['Project Management', 'Agile/Scrum', 'Product Strategy', 'Roadmapping', 'User Persona Development', 'Data Analytics', 'Cross-functional Leadership', 'Jira/Confluence', 'Market Research', 'Stakeholder Communication'];
  }
  
  // Generic
  return ['Leadership', 'Problem Solving', 'Strategic Planning', 'Data Analysis', 'Project Management', 'Effective Communication', 'Collaboration', 'Time Management', 'Critical Thinking', 'Adaptability'];
};

// ==========================================
// CONTROLLERS
// ==========================================

// @desc    Generate summary using AI
// @route   POST /api/ai/generate-summary
// @access  Private
export const generateSummary = async (req, res) => {
  const { jobTitle, skills } = req.body;

  if (!jobTitle) {
    return res.status(400).json({ success: false, message: 'Job title is required to generate a summary' });
  }

  const client = getGeminiClient();

  if (!client) {
    // Return fallback summary
    const summary = fallbackSummary(jobTitle, skills);
    return res.json({ success: true, data: summary, source: 'fallback' });
  }

  try {
    const model = client.getGenerativeModel({ model: 'gemini-1.5-flash' });
    const skillsText = skills && skills.length > 0 ? `with skills in: ${skills.join(', ')}` : '';
    const prompt = `Write a professional, impactful resume profile summary (3-4 sentences, about 70-100 words) for a "${jobTitle}" ${skillsText}. Write in first or third person (traditional resume style, e.g. "Results-driven Developer..."). Avoid overly cliché buzzwords but make it sound premium and highly technical. Do not output anything other than the summary text.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const summary = response.text().trim().replace(/^"|"$/g, ''); // strip outer quotes if any

    res.json({ success: true, data: summary, source: 'gemini-ai' });
  } catch (error) {
    console.error('Gemini AI Summary Error:', error.message);
    const summary = fallbackSummary(jobTitle, skills);
    res.json({ success: true, data: summary, source: 'fallback (after error)' });
  }
};

// @desc    Generate career objective using AI
// @route   POST /api/ai/generate-objective
// @access  Private
export const generateObjective = async (req, res) => {
  const { jobTitle } = req.body;

  if (!jobTitle) {
    return res.status(400).json({ success: false, message: 'Job title is required to generate a career objective' });
  }

  const client = getGeminiClient();

  if (!client) {
    const objective = fallbackObjective(jobTitle);
    return res.json({ success: true, data: objective, source: 'fallback' });
  }

  try {
    const model = client.getGenerativeModel({ model: 'gemini-1.5-flash' });
    const prompt = `Write a highly professional and tailored career objective (2 sentences, about 40-60 words) for a resume of a "${jobTitle}" looking to secure a job. Focus on the value they can offer the employer. Do not output anything other than the objective text.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const objective = response.text().trim().replace(/^"|"$/g, '');

    res.json({ success: true, data: objective, source: 'gemini-ai' });
  } catch (error) {
    console.error('Gemini AI Objective Error:', error.message);
    const objective = fallbackObjective(jobTitle);
    res.json({ success: true, data: objective, source: 'fallback (after error)' });
  }
};

// @desc    Improve and rewrite content professionally
// @route   POST /api/ai/improve-content
// @access  Private
export const improveContent = async (req, res) => {
  const { text } = req.body;

  if (!text) {
    return res.status(400).json({ success: false, message: 'Text content is required' });
  }

  const client = getGeminiClient();

  if (!client) {
    const improved = fallbackImprove(text);
    return res.json({ success: true, data: improved, source: 'fallback' });
  }

  try {
    const model = client.getGenerativeModel({ model: 'gemini-1.5-flash' });
    const prompt = `Rewrite the following resume description to sound extremely professional, action-oriented (using strong action verbs like spearheads, refactored, optimized, engineered), and grammatically correct. Keep a similar length, but make the impact stand out. Do not write introductory text, just output the rewritten description. Here is the text: "${text}"`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const improved = response.text().trim().replace(/^"|"$/g, '');

    res.json({ success: true, data: improved, source: 'gemini-ai' });
  } catch (error) {
    console.error('Gemini AI Improve Error:', error.message);
    const improved = fallbackImprove(text);
    res.json({ success: true, data: improved, source: 'fallback (after error)' });
  }
};

// @desc    Suggest key skills based on job title
// @route   POST /api/ai/suggest-skills
// @access  Private
export const suggestSkills = async (req, res) => {
  const { jobTitle } = req.body;

  if (!jobTitle) {
    return res.status(400).json({ success: false, message: 'Job title is required to suggest skills' });
  }

  const client = getGeminiClient();

  if (!client) {
    const skills = fallbackSkills(jobTitle);
    return res.json({ success: true, data: skills, source: 'fallback' });
  }

  try {
    const model = client.getGenerativeModel({ model: 'gemini-1.5-flash' });
    const prompt = `Based on the job title "${jobTitle}", list the top 10 relevant technical or professional skills. Respond only with a comma-separated list, e.g. "React.js, Node.js, Git". Do not include numbers, explanation, or introductions.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const textOutput = response.text().trim();
    
    // Parse comma-separated list
    const skills = textOutput
      .split(',')
      .map(s => s.trim())
      .filter(s => s.length > 0)
      .slice(0, 12); // Limit to 12 skills max

    res.json({ success: true, data: skills, source: 'gemini-ai' });
  } catch (error) {
    console.error('Gemini AI Skills Error:', error.message);
    const skills = fallbackSkills(jobTitle);
    res.json({ success: true, data: skills, source: 'fallback (after error)' });
  }
};

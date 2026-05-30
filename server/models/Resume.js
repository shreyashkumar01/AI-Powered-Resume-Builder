import mongoose from 'mongoose';

const resumeSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    title: {
      type: String,
      default: 'Untitled Resume',
    },
    personalInfo: {
      fullName: { type: String, default: '' },
      email: { type: String, default: '' },
      phone: { type: String, default: '' },
      location: { type: String, default: '' },
      website: { type: String, default: '' },
      github: { type: String, default: '' },
      linkedin: { type: String, default: '' },
      jobTitle: { type: String, default: '' },
      summary: { type: String, default: '' },
    },
    education: [
      {
        school: { type: String, default: '' },
        degree: { type: String, default: '' },
        fieldOfStudy: { type: String, default: '' },
        startDate: { type: String, default: '' },
        endDate: { type: String, default: '' },
        description: { type: String, default: '' },
        current: { type: Boolean, default: false },
      },
    ],
    skills: [
      {
        name: { type: String, default: '' },
        level: { type: String, default: 'Intermediate' }, // 'Beginner', 'Intermediate', 'Expert'
      },
    ],
    experience: [
      {
        company: { type: String, default: '' },
        position: { type: String, default: '' },
        location: { type: String, default: '' },
        startDate: { type: String, default: '' },
        endDate: { type: String, default: '' },
        description: { type: String, default: '' },
        current: { type: Boolean, default: false },
      },
    ],
    projects: [
      {
        name: { type: String, default: '' },
        description: { type: String, default: '' },
        technologies: { type: String, default: '' }, // comma separated or text
        link: { type: String, default: '' },
      },
    ],
    certifications: [
      {
        name: { type: String, default: '' },
        issuer: { type: String, default: '' },
        date: { type: String, default: '' },
        link: { type: String, default: '' },
      },
    ],
    achievements: [
      {
        title: { type: String, default: '' },
        description: { type: String, default: '' },
      },
    ],
    languages: [
      {
        language: { type: String, default: '' },
        proficiency: { type: String, default: 'Professional' }, // 'Elementary', 'Limited', 'Professional', 'Full Professional', 'Native'
      },
    ],
    template: {
      type: String,
      enum: ['modern', 'ats', 'corporate', 'creative', 'minimal'],
      default: 'modern',
    },
    theme: {
      primaryColor: { type: String, default: '#6366f1' }, // Indigo-500
      fontFamily: { type: String, default: 'Inter' },
      spacing: { type: String, default: 'normal' }, // compact, normal, loose
    },
  },
  {
    timestamps: true,
  }
);

const Resume = mongoose.model('Resume', resumeSchema);
export default Resume;

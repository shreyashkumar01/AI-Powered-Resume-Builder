import Resume from '../models/Resume.js';

// @desc    Create a new empty resume draft
// @route   POST /api/resumes
// @access  Private
export const createResume = async (req, res) => {
  const { title, template } = req.body;

  try {
    const resume = await Resume.create({
      userId: req.user._id,
      title: title || 'My Resume',
      template: template || 'modern',
      personalInfo: {
        fullName: req.user.name,
        email: req.user.email,
        phone: '',
        location: '',
        website: '',
        github: '',
        linkedin: '',
        jobTitle: '',
        summary: '',
      },
      education: [],
      skills: [],
      experience: [],
      projects: [],
      certifications: [],
      achievements: [],
      languages: [],
      theme: {
        primaryColor: '#6366f1',
        fontFamily: 'Inter',
        spacing: 'normal',
      },
    });

    res.status(201).json({ success: true, data: resume });
  } catch (error) {
    console.error('Create Resume Error:', error.message);
    res.status(500).json({ success: false, message: 'Server error, failed to create resume' });
  }
};

// @desc    Get all resumes of logged in user
// @route   GET /api/resumes/my-resumes
// @access  Private
export const getMyResumes = async (req, res) => {
  try {
    const resumes = await Resume.find({ userId: req.user._id }).sort({ updatedAt: -1 });
    res.json({ success: true, count: resumes.length, data: resumes });
  } catch (error) {
    console.error('Get Resumes Error:', error.message);
    res.status(500).json({ success: false, message: 'Server error, failed to fetch resumes' });
  }
};

// @desc    Get single resume by ID
// @route   GET /api/resumes/:id
// @access  Private
export const getResumeById = async (req, res) => {
  try {
    const resume = await Resume.findById(req.params.id);

    if (!resume) {
      return res.status(404).json({ success: false, message: 'Resume not found' });
    }

    // Verify ownership
    if (resume.userId.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized to view this resume' });
    }

    res.json({ success: true, data: resume });
  } catch (error) {
    console.error('Get Resume By ID Error:', error.message);
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ success: false, message: 'Resume not found' });
    }
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// @desc    Update single resume
// @route   PUT /api/resumes/:id
// @access  Private
export const updateResume = async (req, res) => {
  try {
    let resume = await Resume.findById(req.params.id);

    if (!resume) {
      return res.status(404).json({ success: false, message: 'Resume not found' });
    }

    // Verify ownership
    if (resume.userId.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized to edit this resume' });
    }

    // Update resume in database
    resume = await Resume.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.json({ success: true, data: resume });
  } catch (error) {
    console.error('Update Resume Error:', error.message);
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ success: false, message: 'Resume not found' });
    }
    res.status(500).json({ success: false, message: 'Server error, failed to update' });
  }
};

// @desc    Delete single resume
// @route   DELETE /api/resumes/:id
// @access  Private
export const deleteResume = async (req, res) => {
  try {
    const resume = await Resume.findById(req.params.id);

    if (!resume) {
      return res.status(404).json({ success: false, message: 'Resume not found' });
    }

    // Verify ownership
    if (resume.userId.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized to delete this resume' });
    }

    await Resume.findByIdAndDelete(req.params.id);

    res.json({ success: true, message: 'Resume deleted successfully' });
  } catch (error) {
    console.error('Delete Resume Error:', error.message);
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ success: false, message: 'Resume not found' });
    }
    res.status(500).json({ success: false, message: 'Server error, failed to delete' });
  }
};

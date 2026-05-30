import User from '../models/User.js';
import Resume from '../models/Resume.js';

// @desc    Get all users (admin-only)
// @route   GET /api/admin/users
// @access  Private/Admin
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({}).select('-password').sort({ createdAt: -1 });
    res.json({ success: true, count: users.length, data: users });
  } catch (error) {
    console.error('Admin Get Users Error:', error.message);
    res.status(500).json({ success: false, message: 'Server error, failed to retrieve users' });
  }
};

// @desc    Delete user and their resumes (admin-only)
// @route   DELETE /api/admin/users/:id
// @access  Private/Admin
export const deleteUser = async (req, res) => {
  try {
    const userId = req.params.id;

    // Prevent self-deletion
    if (req.user._id.toString() === userId) {
      return res.status(400).json({ success: false, message: 'Admins cannot delete their own account' });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // Cascade delete: delete all resumes belonging to this user
    await Resume.deleteMany({ userId });
    
    // Delete the user
    await User.findByIdAndDelete(userId);

    res.json({ success: true, message: 'User and all associated resumes deleted successfully' });
  } catch (error) {
    console.error('Admin Delete User Error:', error.message);
    res.status(500).json({ success: false, message: 'Server error, failed to delete user' });
  }
};

// @desc    Get analytics dashboard data (admin-only)
// @route   GET /api/admin/analytics
// @access  Private/Admin
export const getAnalytics = async (req, res) => {
  try {
    // 1. Total users and resumes
    const totalUsers = await User.countDocuments({});
    const totalResumes = await Resume.countDocuments({});

    // 2. Templates breakdown
    const templatesBreakdown = await Resume.aggregate([
      {
        $group: {
          _id: '$template',
          count: { $sum: 1 },
        },
      },
      {
        $project: {
          templateName: '$_id',
          count: 1,
          _id: 0,
        },
      },
    ]);

    // Ensure all 5 templates are represented in the breakdown (even with count 0)
    const availableTemplates = ['modern', 'ats', 'corporate', 'creative', 'minimal'];
    const formattedTemplates = availableTemplates.map(t => {
      const found = templatesBreakdown.find(item => item.templateName === t);
      return {
        template: t.charAt(0).toUpperCase() + t.slice(1),
        count: found ? found.count : 0,
      };
    });

    // 3. User growth history (last 6 months, grouped by month)
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 5);
    sixMonthsAgo.setDate(1); // Set to start of month
    sixMonthsAgo.setHours(0, 0, 0, 0);

    const userGrowth = await User.aggregate([
      {
        $match: {
          createdAt: { $gte: sixMonthsAgo },
        },
      },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' },
          },
          count: { $sum: 1 },
        },
      },
      {
        $sort: { '_id.year': 1, '_id.month': 1 },
      },
    ]);

    // Format month labels for growth chart
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    
    // Generate structure for last 6 months
    const growthChartData = [];
    for (let i = 5; i >= 0; i--) {
      const d = new Date();
      d.setMonth(d.getMonth() - i);
      const year = d.getFullYear();
      const month = d.getMonth() + 1; // 1-indexed

      const found = userGrowth.find(item => item._id.year === year && item._id.month === month);
      
      growthChartData.push({
        name: `${monthNames[month - 1]} ${year}`,
        users: found ? found.count : 0,
      });
    }

    // 4. Resume creation density (recently created)
    const recentResumes = await Resume.find({})
      .populate('userId', 'name email')
      .sort({ createdAt: -1 })
      .limit(5);

    const formattedRecentResumes = recentResumes.map(r => ({
      _id: r._id,
      title: r.title,
      userName: r.userId ? r.userId.name : 'Unknown User',
      userEmail: r.userId ? r.userId.email : 'N/A',
      template: r.template,
      updatedAt: r.updatedAt,
    }));

    res.json({
      success: true,
      data: {
        totals: {
          users: totalUsers,
          resumes: totalResumes,
        },
        templates: formattedTemplates,
        growth: growthChartData,
        recentActivity: formattedRecentResumes,
      },
    });
  } catch (error) {
    console.error('Admin Analytics Error:', error.message);
    res.status(500).json({ success: false, message: 'Server error, failed to compile analytics' });
  }
};

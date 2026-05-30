import express from 'express';
import {
  createResume,
  getMyResumes,
  getResumeById,
  updateResume,
  deleteResume,
} from '../controllers/resumeController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// Apply auth middleware to all resume routes
router.use(protect);

router.post('/', createResume);
router.get('/my-resumes', getMyResumes);
router.get('/:id', getResumeById);
router.put('/:id', updateResume);
router.delete('/:id', deleteResume);

export default router;

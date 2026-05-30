import express from 'express';
import {
  generateSummary,
  generateObjective,
  improveContent,
  suggestSkills,
} from '../controllers/aiController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// Apply auth middleware to all AI routes
router.use(protect);

router.post('/generate-summary', generateSummary);
router.post('/generate-objective', generateObjective);
router.post('/improve-content', improveContent);
router.post('/suggest-skills', suggestSkills);

export default router;

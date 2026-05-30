import express from 'express';
import {
  getAllUsers,
  deleteUser,
  getAnalytics,
} from '../controllers/adminController.js';
import { protect, admin } from '../middleware/auth.js';

const router = express.Router();

// Apply auth protection & admin authorization to all admin routes
router.use(protect);
router.use(admin);

router.get('/users', getAllUsers);
router.get('/analytics', getAnalytics);
router.delete('/users/:id', deleteUser);

export default router;

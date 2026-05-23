import express from 'express';
import { createLeaveRequest, getLeaveRequests, updateLeaveStatus } from '../controllers/leaveController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
  .get(protect, getLeaveRequests)
  .post(protect, createLeaveRequest);

router.route('/:id')
  .put(protect, authorize('manager'), updateLeaveStatus);

export default router;

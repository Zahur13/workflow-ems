import express from 'express';
import { createTask, getTasks, updateTaskStatus } from '../controllers/taskController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
  .get(protect, getTasks)
  .post(protect, authorize('manager'), createTask);

router.route('/:id')
  .put(protect, updateTaskStatus);

export default router;

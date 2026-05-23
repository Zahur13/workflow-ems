import asyncHandler from 'express-async-handler';
import Task from '../models/Task.js';
import User from '../models/User.js';

// @desc    Create a new task
// @route   POST /api/tasks
// @access  Private (Manager only)
export const createTask = asyncHandler(async (req, res) => {
  const { title, description, priority, assignedTo, deadline } = req.body;

  const task = await Task.create({
    title,
    description,
    priority,
    assignedTo,
    deadline,
    createdBy: req.user._id
  });

  res.status(201).json(task);
});

// @desc    Get all tasks for a user or all tasks if manager
// @route   GET /api/tasks
// @access  Private
export const getTasks = asyncHandler(async (req, res) => {
  let tasks;
  if (req.user.role === 'manager') {
    tasks = await Task.find({}).populate('assignedTo', 'name email').populate('createdBy', 'name');
  } else {
    tasks = await Task.find({ assignedTo: req.user._id }).populate('createdBy', 'name');
  }
  res.json(tasks);
});

// @desc    Update task status
// @route   PUT /api/tasks/:id
// @access  Private
export const updateTaskStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;
  const task = await Task.findById(req.params.id);

  if (task) {
    task.status = status;
    const updatedTask = await task.save();
    res.json(updatedTask);
  } else {
    res.status(404);
    throw new Error('Task not found');
  }
});

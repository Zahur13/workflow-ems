import asyncHandler from 'express-async-handler';
import LeaveRequest from '../models/LeaveRequest.js';

// @desc    Create a new leave request
// @route   POST /api/leave
// @access  Private
export const createLeaveRequest = asyncHandler(async (req, res) => {
  const { type, startDate, endDate, reason } = req.body;

  const leaveRequest = await LeaveRequest.create({
    user: req.user._id,
    type,
    startDate,
    endDate,
    reason
  });

  res.status(201).json(leaveRequest);
});

// @desc    Get all leave requests for a user or all if manager
// @route   GET /api/leave
// @access  Private
export const getLeaveRequests = asyncHandler(async (req, res) => {
  let leaveRequests;
  if (req.user.role === 'manager') {
    leaveRequests = await LeaveRequest.find({}).populate('user', 'name email department');
  } else {
    leaveRequests = await LeaveRequest.find({ user: req.user._id });
  }
  res.json(leaveRequests);
});

// @desc    Update leave request status (Approve/Reject)
// @route   PUT /api/leave/:id
// @access  Private (Manager only)
export const updateLeaveStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;
  const leaveRequest = await LeaveRequest.findById(req.params.id);

  if (leaveRequest) {
    leaveRequest.status = status;
    leaveRequest.approvedBy = req.user._id;
    const updatedLeave = await leaveRequest.save();
    res.json(updatedLeave);
  } else {
    res.status(404);
    throw new Error('Leave request not found');
  }
});

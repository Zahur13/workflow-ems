import asyncHandler from 'express-async-handler';
import User from '../models/User.js';
import jwt from 'jsonwebtoken';

const generateToken = (id) => jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '7d' });

export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user || !(await user.matchPassword(password))) {
    res.status(401).json({ message: 'Invalid credentials' });
    return;
  }
  res.json({ token: generateToken(user._id), user: { id: user._id, name: user.name, email: user.email, role: user.role } });
});

export const register = asyncHandler(async (req, res) => {
  const { name, email, password, role = 'employee' } = req.body;
  const userExists = await User.findOne({ email });
  if (userExists) { res.status(400).json({ message: 'User already exists' }); return; }
  const user = await User.create({ name, email, password, role });
  res.status(201).json({ token: generateToken(user._id), user: { id: user._id, name: user.name, email: user.email, role: user.role } });
});

export const getEmployees = asyncHandler(async (req, res) => {
  const employees = await User.find({ role: 'employee' }).select('name email department');
  res.json(employees);
});
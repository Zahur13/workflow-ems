import express from "express";
import {
  login,
  register,
  getEmployees,
} from "../controllers/authController.js";
import { protect, authorize } from "../middleware/authMiddleware.js";

const router = express.Router();
router.post("/login", login);
router.post("/register", register);
router.get("/employees", protect, authorize("manager"), getEmployees);
export default router;

import express from "express";
import { protect } from "../middlewares/auth.middleware.js";
import { requireTeacher } from "../middlewares/role.middleware.js";
import {
  createClass,
  addStudentToClass,
  getClassById,
} from "../controllers/class.controller.js";

const router = express.Router();

// POST /class
router.post("/", protect, requireTeacher, createClass);

// POST /class/:id/add-student
router.post("/:id/add-student", protect, requireTeacher, addStudentToClass);

// GET /class/:id
router.get("/:id", protect, getClassById);

export default router;

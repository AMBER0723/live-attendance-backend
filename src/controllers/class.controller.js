import Class from "../models/class.js";
import { createClassSchema, addStudentSchema } from "../validators/class.validator.js";

export const createClass = async (req, res) => {
  const parsed = createClassSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json(parsed.error);
  }

  const newClass = await Class.create({
    className: parsed.data.className,
    teacherId: req.user.userId,
    studentIds: [],
  });

  res.status(201).json({
    success: true,
    data: newClass,
  });
};


export const addStudentToClass = async (req, res) => {
  const parsed = addStudentSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json(parsed.error);
  }

  const classData = await Class.findById(req.params.id);

  if (!classData) {
    return res.status(404).json({ message: "Class not found" });
  }

  // 🔒 Ownership check
  if (classData.teacherId.toString() !== req.user.userId) {
    return res.status(403).json({ message: "Not your class" });
  }

  // Avoid duplicates
  if (classData.studentIds.includes(parsed.data.studentId)) {
    return res.status(400).json({ message: "Student already added" });
  }

  classData.studentIds.push(parsed.data.studentId);
  await classData.save();

  res.json({
    success: true,
    data: classData,
  });
};


export const getClassById = async (req, res) => {
  const classData = await Class.findById(req.params.id);

  if (!classData) {
    return res.status(404).json({ message: "Class not found" });
  }

  const userId = req.user.userId;

  const isTeacher = classData.teacherId.toString() === userId;
  const isStudent = classData.studentIds.some(
    (id) => id.toString() === userId
  );

  if (!isTeacher && !isStudent) {
    return res.status(403).json({ message: "Access denied" });
  }

  res.json({
    success: true,
    data: classData,
  });
};



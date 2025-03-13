import express from 'express';
import {
  getEmployees,
  addEmployee,
  updateEmployee,
  deleteEmployee,
  recordAttendance,
  getEmployeesWithAttendance,
  deleteAttendance,
  updateAttendance,
} from '../controllers/employeeController';
import { authenticate } from '../middleware/auth';

const router = express.Router();

router.get('/', authenticate, getEmployees);
router.post('/', authenticate, addEmployee);
router.post('/attendance', authenticate, recordAttendance); // Record attendance
router.get('/attendance', authenticate, getEmployeesWithAttendance); // Fetch employees with attendance
router.put('/attendance', authenticate, updateAttendance); // Update attendance
router.delete('/attendance', authenticate, deleteAttendance);
router.put('/:id', authenticate, updateEmployee); // Update employee
router.delete('/:id', authenticate, deleteEmployee); // Delete employee



export default router;
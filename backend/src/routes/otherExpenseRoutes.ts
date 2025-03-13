import express from 'express';
import {
  addOtherExpense,
  getOtherExpenses,
  updateOtherExpense,
  deleteOtherExpense,
} from '../controllers/otherExpenseController';
import { authenticate } from '../middleware/auth';

const router = express.Router();

router.post('/', authenticate, addOtherExpense); // Add other expense
router.get('/', authenticate, getOtherExpenses); // Fetch all other expenses
router.put('/:id', authenticate, updateOtherExpense); // Update other expense
router.delete('/:id', authenticate, deleteOtherExpense); // Delete other expense

export default router;
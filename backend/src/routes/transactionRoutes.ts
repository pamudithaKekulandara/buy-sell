import express from 'express';
import { addTransaction, getDailySummary, getMonthlyReport } from '../controllers/transactionController';
import { authenticate } from '../middleware/auth';

const router = express.Router();

router.post('/', authenticate, addTransaction);
router.get('/daily', authenticate, getDailySummary);
router.get('/monthly', authenticate, getMonthlyReport);

export default router;
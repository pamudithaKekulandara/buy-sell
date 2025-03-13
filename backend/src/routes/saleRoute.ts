import express from 'express';
import { recordSale, getSales, updateSale, deleteSale } from '../controllers/saleController';
import { authenticate } from '../middleware/auth';

const router = express.Router();

router.post('/', authenticate, recordSale);
router.get('/', authenticate, getSales); // Optional: Fetch all sales
router.put('/:id', authenticate, updateSale);
router.delete('/:id', authenticate, deleteSale);

export default router;
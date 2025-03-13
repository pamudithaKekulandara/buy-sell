import express from 'express';
import { getProducts, addProduct, updateProduct, deleteProduct } from '../controllers/productController';
import { authenticate } from '../middleware/auth';

const router = express.Router();

router.get('/', authenticate, getProducts);
router.post('/', authenticate, addProduct);
router.put('/:id', authenticate, updateProduct);
router.delete('/:id', authenticate, deleteProduct);

export default router;
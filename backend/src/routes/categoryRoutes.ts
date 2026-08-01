import { Router } from 'express';
import {
  getAllCategorys,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory
} from '../controllers/categoryController';
import { authenticateToken } from '../middleware/authMiddleware';

const router = Router();

router.get('/', getAllCategorys);
router.get('/:id', getCategoryById);
router.post('/', authenticateToken, createCategory);
router.put('/:id', authenticateToken, updateCategory);
router.delete('/:id', authenticateToken, deleteCategory);

export default router;
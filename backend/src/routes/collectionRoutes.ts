import { Router } from 'express';
import {
  getAllCollections,
  getCollectionById,
  createCollection,
  updateCollection,
  deleteCollection
} from '../controllers/collectionController';
import { authenticateToken } from '../middleware/authMiddleware';

const router = Router();

router.get('/', getAllCollections);
router.get('/:id', getCollectionById);
router.post('/', authenticateToken, createCollection);
router.put('/:id', authenticateToken, updateCollection);
router.delete('/:id', authenticateToken, deleteCollection);

export default router;
import { Router } from 'express';
import {
  getAllServiceRequests,
  getServiceRequestById,
  createServiceRequest,
  updateServiceRequest,
  deleteServiceRequest,
  processPendingRequests
} from '../controllers/serviceRequestController';
import { authenticateToken } from '../middleware/authMiddleware';

const router = Router();

router.get('/', getAllServiceRequests);
router.post('/process-pending', processPendingRequests);
router.get('/:id', getServiceRequestById);
router.post('/', createServiceRequest);
router.put('/:id', authenticateToken, updateServiceRequest);
router.delete('/:id', authenticateToken, deleteServiceRequest);

export default router;
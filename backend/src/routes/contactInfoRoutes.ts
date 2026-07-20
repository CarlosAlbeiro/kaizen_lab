import { Router } from 'express';
import {
  getAllContactInfos,
  getContactInfoById,
  createContactInfo,
  updateContactInfo,
  deleteContactInfo
} from '../controllers/contactInfoController';

const router = Router();

router.get('/', getAllContactInfos);
router.get('/:id', getContactInfoById);
router.post('/', createContactInfo);
router.put('/:id', updateContactInfo);
router.delete('/:id', deleteContactInfo);

export default router;
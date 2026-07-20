import { Router } from 'express';
import {
  getAllSiteSections,
  getSiteSectionById,
  createSiteSection,
  updateSiteSection,
  deleteSiteSection
} from '../controllers/siteSectionController';

const router = Router();

router.get('/', getAllSiteSections);
router.get('/:id', getSiteSectionById);
router.post('/', createSiteSection);
router.put('/:id', updateSiteSection);
router.delete('/:id', deleteSiteSection);

export default router;
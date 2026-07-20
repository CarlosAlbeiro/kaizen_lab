import { Router } from 'express';
import { getProfile, getContactInfo, getCollections, getProducts, getBrands } from '../controllers/catalogController';

const router = Router();

router.get('/profile', getProfile);
router.get('/contact', getContactInfo);
router.get('/collections', getCollections);
router.get('/products', getProducts);
router.get('/brands', getBrands);

export default router;

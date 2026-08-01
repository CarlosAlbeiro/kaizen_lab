import { Router } from 'express';
import { upload, handleImageUpload } from '../controllers/uploadController';

const router = Router();

router.post('/', upload.single('image'), handleImageUpload);

export default router;

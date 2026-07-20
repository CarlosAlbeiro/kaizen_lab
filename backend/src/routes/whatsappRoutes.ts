import { Router } from 'express';
import {
  getWhatsAppConfig,
  getWhatsAppStatus,
  sendWhatsAppMessage,
  testWhatsAppMessage,
  updateWhatsAppConfig,
} from '../controllers/whatsappController';

const router = Router();

router.get('/status', getWhatsAppStatus);
router.get('/config', getWhatsAppConfig);
router.put('/config', updateWhatsAppConfig);
router.post('/send', sendWhatsAppMessage);
router.post('/test', testWhatsAppMessage);

export default router;

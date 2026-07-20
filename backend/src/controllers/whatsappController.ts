import { Request, Response } from 'express';
import { whatsappBot } from '../services/whatsappBot';

export const sendWhatsAppMessage = async (req: Request, res: Response) => {
  try {
    const { to, message } = req.body;

    if (!to || !message) {
      return res.status(400).json({ error: 'Se requieren los campos to y message' });
    }

    const result = await whatsappBot.sendText(to, message);
    res.json({ success: true, ...result });
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
};

export const getWhatsAppStatus = (_req: Request, res: Response) => {
  res.json(whatsappBot.getConfig());
};

export const getWhatsAppConfig = (_req: Request, res: Response) => {
  res.json(whatsappBot.getConfig());
};

export const updateWhatsAppConfig = (req: Request, res: Response) => {
  const { autoResponseActive, waMsgAdvice, waMsgProduct } = req.body;

  const patch: Partial<{ autoResponseActive: boolean; waMsgAdvice: string; waMsgProduct: string }> = {};
  if (typeof autoResponseActive === 'boolean') patch.autoResponseActive = autoResponseActive;
  if (typeof waMsgAdvice === 'string') patch.waMsgAdvice = waMsgAdvice;
  if (typeof waMsgProduct === 'string') patch.waMsgProduct = waMsgProduct;

  res.json(whatsappBot.updateConfig(patch));
};

export const testWhatsAppMessage = async (req: Request, res: Response) => {
  try {
    const { to, message } = req.body;
    if (!to || !message) {
      return res.status(400).json({ error: 'Se requieren los campos to y message' });
    }

    const result = await whatsappBot.sendText(to, message);
    res.json({ success: true, ...result });
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
};

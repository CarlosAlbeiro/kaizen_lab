import { Client, LocalAuth, MessageMedia } from 'whatsapp-web.js';
import qrcodeTerminal from 'qrcode-terminal';
import QRCode from 'qrcode';
import fs from 'fs';
import path from 'path';

type BotConfig = {
  sessionName?: string;
  onReady?: () => void;
};

type BotRuntimeConfig = {
  autoResponseActive: boolean;
  waMsgAdvice: string;
  waMsgProduct: string;
};

class WhatsAppBotService {
  private client: Client | null = null;
  private ready = false;
  private qrCodeDataUrl: string | null = null;
  private sessionName = 'kaizenlab';
  private isResetting = false;

  private config: BotRuntimeConfig = {
    autoResponseActive: true,
    waMsgAdvice: 'Hola 👋 Gracias por escribir a KAIZEN LAB. ¿Buscas un poster metálico, cuadro premium o diseño a medida?',
    waMsgProduct: 'Hola 👋 Me interesa este producto: {product}',
  };

  private cleanSessionFolder() {
    try {
      const authDir = path.join(process.cwd(), '.wwebjs_auth');
      if (fs.existsSync(authDir)) {
        fs.rmSync(authDir, { recursive: true, force: true });
        console.log('🔄 Sesión previa de WhatsApp eliminada por error de protocolo o autenticación.');
      }
    } catch (err) {
      console.error('Error al limpiar la carpeta de sesión de WhatsApp:', err);
    }
  }

  /**
   * Formatea un número telefónico asegurando el código de país para Colombia (57) si tiene 10 dígitos.
   */
  private formatPhoneNumber(rawPhone: string): string {
    let cleaned = rawPhone.replace(/[^0-9]/g, '');
    if (cleaned.length === 10 && cleaned.startsWith('3')) {
      cleaned = `57${cleaned}`;
    }
    return cleaned;
  }

  /**
   * Obtiene el JID / LID válido registrado en WhatsApp para evitar el error 'No LID for user'
   */
  private async getValidChatId(rawPhone: string): Promise<string> {
    const formatted = this.formatPhoneNumber(rawPhone);
    if (!formatted) throw new Error('Número de teléfono inválido');

    if (this.client && this.ready) {
      try {
        const numberId = await this.client.getNumberId(formatted);
        if (numberId && numberId._serialized) {
          return numberId._serialized;
        }
      } catch (err) {
        console.warn(`No se pudo verificar getNumberId para ${formatted}, usando fallback ${formatted}@c.us`);
      }
    }
    return `${formatted}@c.us`;
  }

  async destroyAndResetSession() {
    if (this.isResetting) return;
    this.isResetting = true;
    this.ready = false;
    this.qrCodeDataUrl = null;

    console.warn('⚠️ Reiniciando sesión de WhatsApp por fallo o desconexión...');

    if (this.client) {
      try {
        await this.client.destroy();
      } catch (err) {
        console.error('Error al destruir cliente previo de Puppeteer:', err);
      }
      this.client = null;
    }

    this.cleanSessionFolder();

    setTimeout(() => {
      this.isResetting = false;
      this.init({ sessionName: this.sessionName });
    }, 1500);
  }

  init({ sessionName = 'kaizenlab', onReady }: BotConfig = {}) {
    if (this.client) return this.client;

    this.sessionName = sessionName;
    const executablePath = process.env.PUPPETEER_EXECUTABLE_PATH || undefined;

    this.client = new Client({
      authStrategy: new LocalAuth({ clientId: sessionName }),
      puppeteer: {
        headless: true,
        executablePath: executablePath || undefined,
        args: [
          '--no-sandbox',
          '--disable-setuid-sandbox',
          '--disable-dev-shm-usage',
          '--disable-accelerated-2d-canvas',
          '--no-first-run',
          '--no-zygote',
          '--disable-gpu',
        ],
      },
    });

    this.client.on('qr', async (qr) => {
      this.ready = false;
      this.qrCodeDataUrl = await QRCode.toDataURL(qr);
      console.log('📲 Escanea este nuevo QR para vincular WhatsApp:', qr);
      qrcodeTerminal.generate(qr, { small: true });
    });

    this.client.on('ready', () => {
      this.ready = true;
      this.qrCodeDataUrl = null;
      console.log('✅ Cliente de WhatsApp listo y vinculado');
      onReady?.();
    });

    this.client.on('auth_failure', async (msg) => {
      console.error('❌ Fallo de autenticación en WhatsApp:', msg);
      await this.destroyAndResetSession();
    });

    this.client.on('disconnected', async (reason) => {
      console.warn('⚠️ Cliente de WhatsApp desconectado:', reason);
      await this.destroyAndResetSession();
    });

    this.client.on('message', async (msg) => {
      if (!this.config.autoResponseActive) return;

      const text = msg.body.trim().toLowerCase();
      if (text.includes('hola') || text.includes('ayuda') || text.includes('cotizar') || text.includes('precio')) {
        await msg.reply(this.config.waMsgAdvice);
      } else if (text.includes('producto')) {
        const productLabel = msg.body.trim() || 'este producto';
        await msg.reply(this.config.waMsgProduct.replace('{product}', productLabel));
      }
    });

    this.client.initialize().catch(async (err) => {
      console.error('❌ Error de Puppeteer / WhatsApp initialization:', err.message);
      await this.destroyAndResetSession();
    });

    return this.client;
  }

  async sendText(to: string, message: string) {
    if (!this.client) this.init();
    if (!this.ready) {
      throw new Error('El bot de WhatsApp no está listo. Escanea el nuevo código QR en el panel.');
    }

    const chatId = await this.getValidChatId(to);

    try {
      await this.client!.sendMessage(chatId, message);
      return { ok: true };
    } catch (err: any) {
      if (err.message && err.message.includes('No LID for user')) {
        console.error(`⚠️ El número ${to} (JID: ${chatId}) no tiene cuenta activa en WhatsApp.`);
        throw new Error(`El número ${to} no está registrado en WhatsApp o carece de cuenta activa.`);
      }
      throw err;
    }
  }

  async sendMedia(to: string, filePath: string, caption?: string) {
    if (!this.client) this.init();
    if (!this.ready) {
      throw new Error('El bot de WhatsApp no está listo. Escanea el nuevo código QR en el panel.');
    }

    const chatId = await this.getValidChatId(to);
    const media = MessageMedia.fromFilePath(filePath);

    try {
      await this.client!.sendMessage(chatId, media, { caption });
      return { ok: true };
    } catch (err: any) {
      if (err.message && err.message.includes('No LID for user')) {
        console.error(`⚠️ El número ${to} (JID: ${chatId}) no tiene cuenta activa en WhatsApp.`);
        throw new Error(`El número ${to} no está registrado en WhatsApp.`);
      }
      throw err;
    }
  }

  /**
   * Envía la imagen del cuadro solicitado (archivo local o URL remota) junto con el texto de cotización
   */
  async sendMediaFromUrl(to: string, imageUrl: string, caption?: string) {
    if (!this.client) this.init();
    if (!this.ready) {
      throw new Error('El bot de WhatsApp no está listo. Escanea el nuevo código QR en el panel.');
    }

    const chatId = await this.getValidChatId(to);
    let media: MessageMedia | null = null;
    const cleanedUrl = imageUrl.trim();

    try {
      // 1. Si es un archivo guardado localmente en /uploads/
      if (cleanedUrl.startsWith('/uploads/') || cleanedUrl.startsWith('uploads/')) {
        const relativePath = cleanedUrl.startsWith('/') ? cleanedUrl.slice(1) : cleanedUrl;
        const localPath = path.join(process.cwd(), relativePath);
        if (fs.existsSync(localPath)) {
          media = MessageMedia.fromFilePath(localPath);
        }
      }

      // 2. Si es una URL externa (http:// o https://)
      if (!media && (cleanedUrl.startsWith('http://') || cleanedUrl.startsWith('https://'))) {
        try {
          media = await MessageMedia.fromUrl(cleanedUrl, { unsafeMime: true });
        } catch (urlErr) {
          console.warn(`⚠️ No se pudo descargar la imagen remota desde ${cleanedUrl}:`, urlErr);
        }
      }

      if (media) {
        await this.client!.sendMessage(chatId, media, { caption });
        return { ok: true, mediaSent: true };
      } else {
        // Fallback: Enviar texto con enlace de la foto
        const fallbackText = caption ? `${caption}\n\n🖼️ *Foto del cuadro:* ${cleanedUrl}` : `🖼️ *Foto del cuadro:* ${cleanedUrl}`;
        await this.client!.sendMessage(chatId, fallbackText);
        return { ok: true, mediaSent: false };
      }
    } catch (err: any) {
      if (err.message && err.message.includes('No LID for user')) {
        console.error(`⚠️ El número ${to} (JID: ${chatId}) no tiene cuenta activa en WhatsApp.`);
        throw new Error(`El número ${to} no está registrado en WhatsApp.`);
      }
      throw err;
    }
  }

  isReady() {
    return this.ready;
  }

  getConfig() {
    return {
      ready: this.ready,
      status: this.ready ? 'connected' : 'disconnected',
      qrCodeDataUrl: this.qrCodeDataUrl,
      ...this.config,
    };
  }

  updateConfig(patch: Partial<BotRuntimeConfig>) {
    this.config = {
      ...this.config,
      ...patch,
    };
    return this.getConfig();
  }
}

export const whatsappBot = new WhatsAppBotService();

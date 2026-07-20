import { Client, LocalAuth, MessageMedia } from 'whatsapp-web.js';
import qrcodeTerminal from 'qrcode-terminal';
import QRCode from 'qrcode';

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
  private config: BotRuntimeConfig = {
    autoResponseActive: true,
    waMsgAdvice: 'Hola 👋 Gracias por escribir a KAIZEN LAB. ¿Buscas un poster metálico, cuadro premium o diseño a medida?',
    waMsgProduct: 'Hola 👋 Me interesa este producto: {product}',
  };

  init({ sessionName = 'kaizenlab', onReady }: BotConfig = {}) {
    if (this.client) return this.client;

    this.client = new Client({
      authStrategy: new LocalAuth({ clientId: sessionName }),
      puppeteer: {
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox'],
      },
    });

    this.client.on('qr', async (qr) => {
      this.qrCodeDataUrl = await QRCode.toDataURL(qr);
      console.log('QR para WhatsApp:', qr);
      qrcodeTerminal.generate(qr, { small: true });
    });

    this.client.on('ready', () => {
      this.ready = true;
      console.log('WhatsApp client ready');
      onReady?.();
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

    this.client.initialize();
    return this.client;
  }

  async sendText(to: string, message: string) {
    if (!this.client) this.init();
    if (!this.ready) {
      throw new Error('El bot de WhatsApp aún no está listo. Espera un momento o revisa el QR.');
    }

    const normalized = to.replace(/[^0-9]/g, '');
    if (!normalized) throw new Error('Número de WhatsApp inválido');

    await this.client!.sendMessage(`${normalized}@c.us`, message);
    return { ok: true };
  }

  async sendMedia(to: string, filePath: string, caption?: string) {
    if (!this.client) this.init();
    if (!this.ready) {
      throw new Error('El bot de WhatsApp aún no está listo. Espera un momento o revisa el QR.');
    }

    const normalized = to.replace(/[^0-9]/g, '');
    if (!normalized) throw new Error('Número de WhatsApp inválido');

    const media = MessageMedia.fromFilePath(filePath);
    await this.client!.sendMessage(`${normalized}@c.us`, media, { caption });
    return { ok: true };
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

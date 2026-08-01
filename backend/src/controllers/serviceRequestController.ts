import { Request, Response } from 'express';
import { pool } from '../config/db';
import { whatsappBot } from '../services/whatsappBot';

export const getAllServiceRequests = async (req: Request, res: Response) => {
  try {
    const result = await pool.query('SELECT * FROM service_requests ORDER BY id DESC');
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
};

export const getServiceRequestById = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const result = await pool.query('SELECT * FROM service_requests WHERE id = $1', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'ServiceRequest not found' });
    }
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
};

export const createServiceRequest = async (req: Request, res: Response) => {
  const data = req.body;
  const validKeys = Object.keys(data).filter((k) => /^[a-zA-Z0-9_]+$/.test(k));
  if (validKeys.length === 0) {
    return res.status(400).json({ error: 'Datos no válidos' });
  }

  const values = validKeys.map((k) => data[k]);
  const placeholders = values.map((_, i) => '$' + (i + 1)).join(', ');

  try {
    const result = await pool.query(
      'INSERT INTO service_requests (' + validKeys.join(', ') + ') VALUES (' + placeholders + ') RETURNING *',
      values
    );

    const created = result.rows[0];

    // Auto-respuesta inmediata enviando todas las fotos si el bot está listo
    if (whatsappBot.isReady() && created.phone) {
      const phone = created.phone.trim();
      const productInfo = created.product_info || 'Cuadros de Aluminio KAIZEN LAB';
      const locationInfo = created.location || 'Armenia, Quindío';

      const autoMessage =
        `¡Hola! 👋 Gracias por contactar a *KAIZEN LAB* (Armenia, Quindío).\n\n` +
        `Hemos recibido tu solicitud:\n` +
        `📌 *Detalle:* ${productInfo}\n` +
        `📍 *Ubicación:* ${locationInfo}\n\n` +
        `En breves minutos un asesor revisará tu pedido para brindarte asesoría con medidas y envíos a tu ciudad.`;

      const rawImage = (created.product_image || '').trim();
      const images = rawImage ? rawImage.split(',').map((img: string) => img.trim()).filter(Boolean) : [];

      if (images.length > 0) {
        whatsappBot.sendMediaFromUrl(phone, images[0], autoMessage).then(async () => {
          for (let i = 1; i < images.length; i++) {
            await new Promise((resolve) => setTimeout(resolve, 1000));
            await whatsappBot.sendMediaFromUrl(phone, images[i], `🖼️ Cuadro #${i + 1} de tu selección`).catch(console.error);
          }
        }).catch((err) => {
          console.error('Error enviando foto e información de WhatsApp:', err);
        });
      } else {
        whatsappBot.sendText(phone, autoMessage).catch((err) => {
          console.error('Error enviando auto-respuesta de WhatsApp:', err);
        });
      }
    }

    res.status(201).json(created);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
};

export const updateServiceRequest = async (req: Request, res: Response) => {
  const { id } = req.params;
  const data = req.body;
  delete data.id;
  delete data.created_at;

  const validKeys = Object.keys(data).filter((k) => /^[a-zA-Z0-9_]+$/.test(k));
  if (validKeys.length === 0) {
    return res.status(400).json({ error: 'No hay campos válidos para actualizar' });
  }

  const values = validKeys.map((k) => data[k]);
  const setString = validKeys.map((key, i) => key + ' = $' + (i + 1)).join(', ');
  values.push(id);

  try {
    const result = await pool.query(
      'UPDATE service_requests SET ' + setString + ' WHERE id = $' + values.length + ' RETURNING *',
      values
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'ServiceRequest not found' });
    }
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
};

export const deleteServiceRequest = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const result = await pool.query('DELETE FROM service_requests WHERE id = $1 RETURNING *', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'ServiceRequest not found' });
    }
    res.json({ message: 'ServiceRequest deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
};

/**
 * Lógica pura de procesamiento de solicitudes pendientes (utilizada por HTTP y Cron).
 */
export const processPendingRequestsCore = async () => {
  const pending = await pool.query(
    "SELECT * FROM service_requests WHERE LOWER(status) = 'pendiente' ORDER BY id ASC"
  );

  if (pending.rows.length === 0) {
    return {
      message: 'No hay solicitudes pendientes por procesar.',
      processedCount: 0,
      failedCount: 0,
      processed: [],
      failed: [],
    };
  }

  const processed = [];
  const failed = [];
  const isBotReady = whatsappBot.isReady();

  for (const item of pending.rows) {
    try {
      const phone = item.phone?.trim();
      if (!phone) {
        failed.push({ id: item.id, reason: 'Número de teléfono faltante' });
        continue;
      }

      const productInfo = item.product_info || 'Cuadros de Aluminio KAIZEN LAB';
      const locationInfo = item.location || 'Armenia, Quindío';
      const rawImage = (item.product_image || '').trim();
      const images = rawImage ? rawImage.split(',').map((img: string) => img.trim()).filter(Boolean) : [];

      const messageText =
        `¡Hola! 👋 Te contactamos de *KAIZEN LAB* (Armenia, Quindío).\n\n` +
        `Estamos procesando tu solicitud de cotización:\n` +
        `📌 *Detalle:* ${productInfo}\n` +
        `📍 *Ubicación:* ${locationInfo}\n\n` +
        `Tu cotización ha sido procesada. Un asesor especializado te brindará información sobre tamaños y métodos de envío a tu ciudad.\n\n` +
        `¿Tienes alguna duda adicional sobre tus cuadros metálicos HD?`;

      let newStatus = 'procesado';

      if (isBotReady) {
        if (images.length > 0) {
          await whatsappBot.sendMediaFromUrl(phone, images[0], messageText);

          for (let i = 1; i < images.length; i++) {
            await new Promise((resolve) => setTimeout(resolve, 1000));
            await whatsappBot.sendMediaFromUrl(phone, images[i], `🖼️ Cuadro #${i + 1} de tu selección`).catch(console.error);
          }
        } else {
          await whatsappBot.sendText(phone, messageText);
        }
        newStatus = 'contactado';
      }

      const updated = await pool.query(
        "UPDATE service_requests SET status = $1 WHERE id = $2 RETURNING *",
        [newStatus, item.id]
      );

      processed.push(updated.rows[0]);
    } catch (itemError) {
      console.error(`Error procesando solicitud ID ${item.id}:`, itemError);
      failed.push({ id: item.id, reason: (itemError as Error).message });
    }
  }

  return {
    message: `Se procesaron exitosamente ${processed.length} de ${pending.rows.length} solicitudes pendientes con el envío de todas sus imágenes.`,
    processedCount: processed.length,
    failedCount: failed.length,
    whatsappConnected: isBotReady,
    processed,
    failed,
  };
};

/**
 * Handler HTTP para procesar pendientes bajo demanda.
 */
export const processPendingRequests = async (req: Request, res: Response) => {
  try {
    const result = await processPendingRequestsCore();
    return res.json(result);
  } catch (error) {
    console.error('Error general en processPendingRequests:', error);
    return res.status(500).json({ error: (error as Error).message });
  }
};
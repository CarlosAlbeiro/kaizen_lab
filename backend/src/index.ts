import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';

import userRoutes from './routes/userRoutes';
import categoryRoutes from './routes/categoryRoutes';
import serviceRoutes from './routes/serviceRoutes';
import serviceRequestRoutes from './routes/serviceRequestRoutes';
import portfolioProjectRoutes from './routes/portfolioProjectRoutes';
import testimonialRoutes from './routes/testimonialRoutes';
import catalogRoutes from './routes/catalogRoutes';
import whatsappRoutes from './routes/whatsappRoutes';
import siteSectionRoutes from './routes/siteSectionRoutes';
import profileRoutes from './routes/profileRoutes';
import contactInfoRoutes from './routes/contactInfoRoutes';
import brandRoutes from './routes/brandRoutes';
import collectionRoutes from './routes/collectionRoutes';
import productRoutes from './routes/productRoutes';
import clientRoutes from './routes/clientRoutes';
import uploadRoutes from './routes/uploadRoutes';
import { whatsappBot } from './services/whatsappBot';
import { processPendingRequestsCore } from './controllers/serviceRequestController';

dotenv.config();

const app = express();
const port = process.env.PORT || 3055;

app.use(cors());
app.use(express.json());

// Serve uploads folder static files
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

// Register API routes
app.use('/api/users', userRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api/service-requests', serviceRequestRoutes);
app.use('/api/portfolio-projects', portfolioProjectRoutes);
app.use('/api/testimonials', testimonialRoutes);
app.use('/api/catalog', catalogRoutes);
app.use('/api/whatsapp', whatsappRoutes);
app.use('/api/site-sections', siteSectionRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/contact-info', contactInfoRoutes);
app.use('/api/brands', brandRoutes);
app.use('/api/collections', collectionRoutes);
app.use('/api/products', productRoutes);
app.use('/api/clients', clientRoutes);
app.use('/api/upload', uploadRoutes);

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Backend is running' });
});

/**
 * Ciclo automático en segundo plano para procesar solicitudes pendientes en PostgreSQL
 */
function startAutoRequestProcessor(intervalMs = 30000) {
  console.log(`⏱️ Ciclo automático de solicitudes activado (frecuencia: cada ${intervalMs / 1000}s)`);
  setInterval(async () => {
    try {
      if (!whatsappBot.isReady()) return;
      const result = await processPendingRequestsCore();
      if (result.processedCount > 0) {
        console.log(`🤖 [Ciclo Automático] Procesadas exitosamente ${result.processedCount} solicitudes pendientes.`);
      }
    } catch (err) {
      console.error('Error en ciclo automático de procesamiento:', err);
    }
  }, intervalMs);
}

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
  try {
    whatsappBot.init();
    startAutoRequestProcessor(30000);
  } catch (err) {
    console.error('Error starting WhatsApp bot or auto processor:', err);
  }
});

import { useEffect } from "react";
import { motion } from "framer-motion";
import { ShieldCheck, Lock, FileText, CheckCircle2, PhoneCall } from "lucide-react";
import { SiteLayout } from "@/components/site/SiteLayout";

export default function LegalPage() {
  useEffect(() => {
    document.title = "Marco Legal y Políticas — KAIZEN LAB";
  }, []);

  return (
    <SiteLayout>
      <section className="relative overflow-hidden pt-24 md:pt-32 pb-20">
        <div className="absolute inset-0 -z-10 bg-[var(--gradient-hero)] opacity-50" aria-hidden />

        <div className="mx-auto max-w-4xl px-4 sm:px-6">
          <div className="text-center">
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 text-xs text-primary mb-3"
            >
              <ShieldCheck className="h-4 w-4" />
              <span>Transparencia y Seguridad</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-3xl sm:text-5xl font-extrabold gradient-text text-glow-neon"
            >
              Marco Legal y Términos del Servicio
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="mt-4 text-base sm:text-lg text-muted-foreground"
            >
              Políticas de privacidad, tratamiento de datos personales (Habeas Data) y atención a solicitudes de KAIZEN LAB.
            </motion.p>
          </div>

          <div className="mt-12 space-y-8">
            {/* Seccion 1 */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="rounded-3xl border border-white/10 bg-card/40 p-6 sm:p-8 backdrop-blur-md shadow-card"
            >
              <div className="flex items-center gap-3 text-primary font-bold text-lg mb-3">
                <Lock className="h-5 w-5" />
                <h2>1. Política de Tratamiento de Datos Personales (Habeas Data)</h2>
              </div>
              <div className="text-sm text-muted-foreground space-y-3 leading-relaxed">
                <p>
                  En cumplimiento de la Ley 1581 de 2012 de Protección de Datos Personales en Colombia, en **KAIZEN LAB** garantizamos la confidencialidad, seguridad y correcto tratamiento de la información proporcionada por nuestros clientes al solicitar información o cotizaciones en nuestro sitio web.
                </p>
                <p>
                  Al ingresar tu número telefónico en nuestro formulario de cotización, tus datos son registrados de forma totalmente segura en nuestro sistema interno de atención al cliente.
                </p>
                <ul className="space-y-2 pl-4">
                  {[
                    "Un asesor comercial procesará tu solicitud y te enviará la información detallada del cuadro en un lapso estimado de 5 a 15 minutos.",
                    "Tus datos serán utilizados únicamente para brindarte asesoría personalizada, cotización y soporte de envío.",
                    "En ningún caso tus datos serán vendidos o transferidos a terceros sin tu consentimiento previo.",
                  ].map((item, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-white/90">
                      <CheckCircle2 className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>

            {/* Seccion 2 */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="rounded-3xl border border-white/10 bg-card/40 p-6 sm:p-8 backdrop-blur-md shadow-card"
            >
              <div className="flex items-center gap-3 text-primary font-bold text-lg mb-3">
                <PhoneCall className="h-5 w-5" />
                <h2>2. Proceso de Cotización y Atención Telefónica</h2>
              </div>
              <div className="text-sm text-muted-foreground space-y-3 leading-relaxed">
                <p>
                  Al solicitar una cotización desde cualquier ficha de producto o botón de atención, la solicitud quedará agendada en nuestro panel de control (`service_requests`). Uno de nuestros agentes se comunicará directamente vía llamada o mensaje de texto/WhatsApp al número registrado para asesorarte con dimensiones, tipos de acabado metálico y tiempos de entrega.
                </p>
              </div>
            </motion.div>

            {/* Seccion 3 */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="rounded-3xl border border-white/10 bg-card/40 p-6 sm:p-8 backdrop-blur-md shadow-card"
            >
              <div className="flex items-center gap-3 text-primary font-bold text-lg mb-3">
                <FileText className="h-5 w-5" />
                <h2>3. Garantía de Productos de Aluminio</h2>
              </div>
              <div className="text-sm text-muted-foreground space-y-3 leading-relaxed">
                <p>
                  Nuestras obras y posters de aluminio son elaborados con materiales de alta durabilidad e impresiones en sublimación HD con resistencia al agua y rayos UV. Todos los envíos nacionales incluyen empaque reforzado anti-golpes.
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}

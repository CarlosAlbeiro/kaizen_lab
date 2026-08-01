import { Link } from "react-router-dom";
import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, CheckCircle2, MessageCircle, Sparkles } from "lucide-react";
import { SiteLayout } from "@/components/site/SiteLayout";
import { SEO } from "@/components/site/SEO";
import { CuadrosCarousel } from "@/components/site/CuadrosCarousel";
import { QuoteModal } from "@/components/site/QuoteModal";
import { Button } from "@/components/ui/button";
import { SITE } from "@/lib/site";
import samurai from "@/assets/samurai.png";

export default function HomePage() {
  const [isQuoteOpen, setIsQuoteOpen] = useState(false);

  return (
    <SiteLayout>
      <SEO
        title="Cuadros de Aluminio en Armenia Quindío | KAIZEN LAB — Posters Metálicos HD"
        description="Venta de cuadros de aluminio de alta calidad y posters metálicos sublimados en HD en Armenia, Quindío. Diseños exclusivos para paredes, gaming setup y oficinas en todo Colombia."
        keywords="cuadros de aluminio armenia, cuadros metalicos quindio, posters metalicos armenia, cuadros sublimados armenia, decoracion de pared armenia, kaizen lab"
        canonical="https://kaizenlab.co/"
      />

      {/* 1. Carrusel Destacado Principal en la Parte Superior del Todo */}
      <section className="pt-20">
        <CuadrosCarousel />
      </section>

      {/* 2. Hero Section con información de la marca */}
      <section className="relative overflow-hidden py-16 sm:py-20 flex flex-col justify-center">
        <div
          className="absolute inset-0 -z-10"
          style={{ background: "var(--gradient-hero)" }}
          aria-hidden
        />
        <div className="absolute inset-0 -z-10 bg-grid opacity-40" aria-hidden />

        <div className="mx-auto grid max-w-7xl lg:grid-cols-2 items-center gap-8 px-4 pb-10 sm:px-6 w-full">
          {/* Columna Izquierda: Texto */}
          <div className="flex flex-col items-start text-left">
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-muted-foreground backdrop-blur"
            >
              <Sparkles className="h-3.5 w-3.5 text-accent" />
              <span>Cuadros de Aluminio de Alta Calidad en Armenia, Quindío</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.05 }}
              className="mt-6 text-4xl font-bold leading-tight sm:text-5xl md:text-6xl"
            >
              Posters metálicos y cuadros de aluminio para{" "}
              <span className="text-primary drop-shadow-[0_0_15px_rgba(220,38,38,0.8)]">
                espacios con personalidad
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.15 }}
              className="mt-5 max-w-xl text-base text-muted-foreground sm:text-lg"
            >
              Ubicados en Armenia, Quindío. Diseñamos y fabricamos cuadros metálicos con sublimación HD inalterable. Transforma cualquier pared con acabados de alta definición.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.25 }}
              className="mt-8 flex flex-col items-start gap-3 sm:flex-row"
            >
              <Button
                onClick={() => setIsQuoteOpen(true)}
                size="lg"
                className="h-12 gap-2 bg-[var(--gradient-primary)] text-primary-foreground shadow-glow hover:opacity-95"
              >
                <MessageCircle className="h-5 w-5" /> Pedir mi diseño
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="h-12 gap-2 border-white/15 bg-white/5 px-6 text-foreground hover:bg-white/10"
              >
                <Link to="/catalogo">
                  Ver catálogo completo <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </motion.div>
          </div>

          {/* Columna Derecha: Poster Neon */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, x: 20 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="relative flex justify-center lg:justify-end mt-10 lg:mt-0"
          >
            <div className="relative w-[280px] sm:w-[350px] aspect-[2/3] rounded-lg bg-black border-2 border-primary/80 shadow-[0_0_60px_rgba(220,38,38,0.7)] overflow-hidden z-10 mr-4 sm:mr-24">
              <img
                src={samurai}
                alt="Cuadro metálico de aluminio KAIZEN LAB Armenia Quindío"
                className="w-full h-full object-cover opacity-90"
              />
              <div className="absolute inset-0 shadow-[inset_0_0_40px_rgba(220,38,38,0.5)] pointer-events-none" />
            </div>

            <div className="absolute right-12 top-1/2 -translate-y-1/2 flex flex-col gap-5 sm:gap-8 bg-black/90 border border-white/10 rounded-full py-6 sm:py-8 px-3 sm:px-4 backdrop-blur-md z-20 shadow-xl">
              {[
                { label: "ALUMINIO\nPREMIUM" },
                { label: "IMPRESIÓN\nHD" },
                { label: "ARMENIA\nQUINDÍO" },
                { label: "ENVÍOS\nCOLOMBIA" },
              ].map((item, idx) => (
                <div key={idx} className="flex flex-col items-center gap-1.5 sm:gap-2">
                  <CheckCircle2 className="w-5 h-5 sm:w-6 sm:h-6 text-primary drop-shadow-[0_0_5px_rgba(220,38,38,0.8)]" />
                  <span className="text-[7px] sm:text-[8px] text-center text-white/70 whitespace-pre-line font-bold uppercase tracking-wider">
                    {item.label}
                  </span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Modal de Cotización */}
      <QuoteModal
        isOpen={isQuoteOpen}
        onClose={() => setIsQuoteOpen(false)}
        product={null}
      />
    </SiteLayout>
  );
}

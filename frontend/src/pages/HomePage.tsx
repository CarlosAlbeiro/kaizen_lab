import { Link } from "react-router-dom";
import { useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowRight, CheckCircle2, MessageCircle, Sparkles } from "lucide-react";
import { SiteLayout } from "@/components/site/SiteLayout";
import { ServiceIcon } from "@/components/site/ServiceIcon";
import { CuadrosCarousel } from "@/components/site/CuadrosCarousel";
import { Button } from "@/components/ui/button";
import { useServices } from "@/lib/admin-store";
import { useCatalogCollections, useCatalogProducts } from "@/lib/catalog";
import { SITE, waLink } from "@/lib/site";
import samurai from "@/assets/samurai.png";

export default function HomePage() {
  const services = useServices()
    .filter((s) => s.active)
    .slice(0, 6);
  const collections = useCatalogCollections().slice(0, 3);
  const products = useCatalogProducts();

  useEffect(() => {
    document.title = "KAIZEN LAB — Posters metálicos y cuadros premium";
  }, []);

  return (
    <SiteLayout>
      <section className="relative overflow-hidden min-h-[90vh] flex flex-col justify-center">
        <div
          className="absolute inset-0 -z-10"
          style={{ background: "var(--gradient-hero)" }}
          aria-hidden
        />
        <div className="absolute inset-0 -z-10 bg-grid opacity-40" aria-hidden />
        <div
          className="absolute left-1/2 top-0 -z-10 h-[600px] w-[900px] -translate-x-1/2 rounded-full bg-primary/10 blur-3xl"
          aria-hidden
        />

        <div className="mx-auto grid max-w-7xl lg:grid-cols-2 items-center gap-8 px-4 pb-10 pt-24 sm:px-6 md:pt-12 w-full">
          {/* Columna Izquierda: Texto */}
          <div className="flex flex-col items-start text-left">
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-muted-foreground backdrop-blur"
            >
              <Sparkles className="h-3.5 w-3.5 text-accent" />
              <span>Decoración premium en {SITE.city}</span>
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
              {SITE.subtitle}. Diseño exclusivo, montaje impecable y una estética que transforma
              cualquier pared.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.25 }}
              className="mt-8 flex flex-col items-start gap-3 sm:flex-row"
            >
              <Button
                asChild
                size="lg"
                className="h-12 gap-2 bg-transparent border border-primary text-primary hover:bg-primary/10 transition-all shadow-[0_0_15px_rgba(220,38,38,0.3)] hover:shadow-[0_0_25px_rgba(220,38,38,0.5)]"
              >
                <a href={waLink()} target="_blank" rel="noopener noreferrer">
                  <MessageCircle className="h-5 w-5" /> Pedir mi diseño
                </a>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="h-12 gap-2 border-white/15 bg-white/5 px-6 text-foreground hover:bg-white/10"
              >
                <Link to="/servicios">
                  Ver colecciones <ArrowRight className="h-4 w-4" />
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
            {/* Poster gigante */}
            <div className="relative w-[280px] sm:w-[350px] aspect-[2/3] rounded-lg bg-black border-2 border-primary/80 shadow-[0_0_60px_rgba(220,38,38,0.7)] overflow-hidden z-10 mr-4 sm:mr-24">
              <img
                src={samurai}
                alt="KAIZEN LAB"
                className="w-full h-full object-cover opacity-90"
                onError={(e) => {
                  // Si no encuentra la imagen, usa el placeholder
                  e.currentTarget.style.display = "none";
                  e.currentTarget.nextElementSibling?.classList.remove("hidden");
                }}
              />
              <div className="hidden w-full h-full bg-black flex flex-col items-center justify-center p-6 text-center">
                <Sparkles className="w-16 h-16 text-primary mb-4 drop-shadow-[0_0_10px_rgba(220,38,38,0.8)]" />
                <span className="text-white font-bold text-xl tracking-widest uppercase">
                  KAIZEN LAB
                </span>
                <span className="text-primary text-sm mt-2">
                  Coloca samurai-poster.jpg en public/
                </span>
              </div>
              {/* Resplandor interno */}
              <div className="absolute inset-0 shadow-[inset_0_0_40px_rgba(220,38,38,0.5)] pointer-events-none" />
            </div>

            {/* Píldora lateral derecha (beneficios) */}
            <div className="absolute right-12 top-1/2 -translate-y-1/2 flex flex-col gap-5 sm:gap-8 bg-black/90 border border-white/10 rounded-full py-6 sm:py-8 px-3 sm:px-4 backdrop-blur-md z-20 shadow-xl">
              {[
                { icon: "Layers", label: "ALUMINIO\nPREMIUM" },
                { icon: "Crosshair", label: "IMPRESIÓN\nHD" },
                { icon: "Maximize", label: "MONTAJE\nLIMPIO" },
                { icon: "Star", label: "DISEÑOS\nEXCLUSIVOS" },
              ].map((item, idx) => (
                <div
                  key={idx}
                  className="flex flex-col items-center gap-1.5 sm:gap-2 group cursor-default"
                >
                  <div className="text-primary group-hover:scale-110 transition-transform">
                    {/* Usamos iconos de lucide directamente ya que ServiceIcon a veces no tiene estos precisos o los buscamos */}
                    <ServiceIcon
                      name="CheckCircle"
                      className="w-5 h-5 sm:w-6 sm:h-6 drop-shadow-[0_0_5px_rgba(220,38,38,0.8)]"
                    />
                  </div>
                  <span className="text-[7px] sm:text-[8px] text-center text-white/70 whitespace-pre-line font-bold uppercase tracking-wider">
                    {item.label}
                  </span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Barra Inferior Estadísticas */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.5 }}
          className="mx-auto w-full max-w-5xl px-4 z-10 mt-8 mb-12"
        >
          <div className="glass relative overflow-hidden rounded-3xl p-5 sm:p-6 md:p-8 shadow-card flex flex-col sm:flex-row flex-wrap sm:flex-nowrap justify-between items-center gap-6 sm:gap-4 text-center sm:text-left">
            <div className="absolute -left-10 top-0 h-40 w-40 rounded-full bg-primary/20 blur-3xl" />
            <div className="absolute -right-10 bottom-0 h-40 w-40 rounded-full bg-accent/10 blur-3xl" />
            {[
              { k: "100%", l: "material premium", icon: "Gem" },
              { k: "24 h", l: "respuesta rápida", icon: "Zap" },
              { k: "Personal", l: "diseño a medida", icon: "User" },
              { k: "Envío", l: "nacional", icon: "Truck" },
            ].map((s, idx) => (
              <div
                key={idx}
                className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4 border-b sm:border-b-0 sm:border-r border-white/10 last:border-0 pb-4 sm:pb-0 pr-0 sm:pr-6 md:pr-8 last:pr-0 w-full sm:w-auto justify-center sm:justify-start"
              >
                <div className="text-primary drop-shadow-[0_0_8px_rgba(220,38,38,0.6)]">
                  <ServiceIcon name="CheckCircle" className="w-6 h-6 sm:w-8 sm:h-8" />
                </div>
                <div>
                  <div className="text-lg sm:text-xl font-bold text-primary drop-shadow-[0_0_5px_rgba(220,38,38,0.5)] leading-none">
                    {s.k}
                  </div>
                  <div className="text-xs text-muted-foreground mt-1 sm:mt-1.5">{s.l}</div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
        <div className="mb-10 flex flex-col items-center text-center">
          <span className="text-xs uppercase tracking-[0.2em] text-primary">Colecciones</span>
          <h2 className="mt-2 text-3xl font-bold sm:text-4xl">Diseños pensados para destacar</h2>
          <p className="mt-3 max-w-xl text-sm text-muted-foreground">
            Desde posters metálicos hasta cuadros premium con acabados impecables para gamers,
            oficinas y setups.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {collections.length > 0
            ? collections.map((collection, i) => (
                <motion.div
                  key={collection.id}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.4, delay: i * 0.05 }}
                  className="group relative overflow-hidden rounded-2xl border border-white/10 bg-card/60 p-6 backdrop-blur transition-all hover:-translate-y-1 hover:border-primary/40 hover:shadow-glow"
                >
                  <div className="mb-4 inline-grid h-12 w-12 place-items-center rounded-xl bg-[var(--gradient-primary)] shadow-glow">
                    <Sparkles className="h-6 w-6 text-primary-foreground" />
                  </div>
                  <h3 className="text-lg font-semibold">{collection.name}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">
                    {collection.description || "Colección disponible para pedidos personalizados."}
                  </p>
                  <Link
                    to="/servicios"
                    className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-primary hover:gap-2 transition-all"
                  >
                    Ver detalle <ArrowRight className="h-4 w-4" />
                  </Link>
                </motion.div>
              ))
            : services.map((s, i) => (
                <motion.div
                  key={s.id}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.4, delay: i * 0.05 }}
                  className="group relative overflow-hidden rounded-2xl border border-white/10 bg-card/60 p-6 backdrop-blur transition-all hover:-translate-y-1 hover:border-primary/40 hover:shadow-glow"
                >
                  <div className="mb-4 inline-grid h-12 w-12 place-items-center rounded-xl bg-[var(--gradient-primary)] shadow-glow">
                    <ServiceIcon name={s.icon} className="h-6 w-6 text-primary-foreground" />
                  </div>
                  <h3 className="text-lg font-semibold">{s.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{s.description}</p>
                  <Link
                    to="/servicios"
                    className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-primary hover:gap-2 transition-all"
                  >
                    Ver detalle <ArrowRight className="h-4 w-4" />
                  </Link>
                </motion.div>
              ))}
        </div>
      </section>

      {/* Carrusel de Productos / Cuadros Metálicos Destacados */}
      <CuadrosCarousel />

      <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
        <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-card/60 p-8 backdrop-blur shadow-card sm:p-12">
          <div className="absolute -right-20 -top-20 h-80 w-80 rounded-full bg-primary/20 blur-3xl" />
          <div className="absolute -bottom-20 -left-20 h-80 w-80 rounded-full bg-accent/15 blur-3xl" />
          <div className="relative grid gap-10 md:grid-cols-2 md:items-center">
            <div>
              <span className="text-xs uppercase tracking-[0.2em] text-accent">
                Propuesta destacada
              </span>
              <h3 className="mt-2 text-3xl font-bold sm:text-4xl">
                Decoración premium para tu espacio
              </h3>
              <p className="mt-3 text-muted-foreground">
                Creamos posters metálicos y cuadros de aluminio con acabados de alto impacto para
                gaming, oficinas, motos, anime y ambientes modernos.
              </p>
              <ul className="mt-6 space-y-2.5">
                {[
                  "Diseños a medida",
                  "Material de aluminio premium",
                  "Montaje limpio y seguro",
                  "Asesoría rápida por WhatsApp",
                ].map((b) => (
                  <li key={b} className="flex items-start gap-2 text-sm">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 text-accent" />
                    <span>{b}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-7 flex flex-wrap gap-3">
                <Button
                  asChild
                  className="bg-[var(--gradient-primary)] text-primary-foreground shadow-glow"
                >
                  <a
                    href={waLink("Hola, me interesa un poster o cuadro de aluminio personalizado.")}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Solicitar cotización
                  </a>
                </Button>
                <Button asChild variant="outline" className="border-white/15 bg-white/5">
                  <Link to="/paquetes">Ver opciones</Link>
                </Button>
              </div>
            </div>
            <div className="relative">
              <div className="glass rounded-2xl p-6">
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl font-bold gradient-text">Desde</span>
                </div>
                <div className="mt-1 text-5xl font-bold text-glow">Desde $120.000</div>
                <p className="mt-2 text-xs text-muted-foreground">
                  COP · Diseño y producción según tamaño
                </p>
                <div className="mt-6 grid grid-cols-3 gap-3 text-center">
                  {["Metal", "Personalizado", "Montaje"].map((t) => (
                    <div
                      key={t}
                      className="rounded-lg border border-white/10 bg-white/5 px-2 py-3 text-xs"
                    >
                      {t}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-10 sm:px-6">
        <div className="relative overflow-hidden rounded-2xl border border-primary/30 bg-[var(--gradient-primary)] p-8 text-center shadow-glow">
          <h3 className="text-2xl font-bold text-primary-foreground sm:text-3xl">
            ¿Listo para transformar tu pared?
          </h3>
          <p className="mt-2 text-primary-foreground/80">
            Escríbenos por WhatsApp y diseñamos tu poster o cuadro de aluminio ideal.
          </p>
          <Button
            asChild
            size="lg"
            className="mt-5 h-12 gap-2 bg-background text-foreground hover:bg-background/90"
          >
            <a href={waLink()} target="_blank" rel="noopener noreferrer">
              <MessageCircle className="h-5 w-5" /> Hablar por WhatsApp
            </a>
          </Button>
        </div>
      </section>
    </SiteLayout>
  );
}

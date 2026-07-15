import { Link } from "react-router-dom";
import { useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowRight, CheckCircle2, MessageCircle, Sparkles } from "lucide-react";
import { SiteLayout } from "@/components/site/SiteLayout";
import { ServiceIcon } from "@/components/site/ServiceIcon";
import { Button } from "@/components/ui/button";
import { useServices } from "@/lib/admin-store";
import { SITE, waLink } from "@/lib/site";

export default function HomePage() {
  const services = useServices().filter((s) => s.active).slice(0, 6);

  useEffect(() => {
    document.title = "KAIZEN LAB — Posters metálicos y cuadros premium";
  }, []);

  return (
    <SiteLayout>
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 -z-10" style={{ background: "var(--gradient-hero)" }} aria-hidden />
        <div className="absolute inset-0 -z-10 bg-grid opacity-40" aria-hidden />
        <div className="absolute left-1/2 top-0 -z-10 h-[600px] w-[900px] -translate-x-1/2 rounded-full bg-primary/10 blur-3xl" aria-hidden />

        <div className="mx-auto flex max-w-6xl flex-col items-center px-4 pb-20 pt-16 text-center sm:px-6 sm:pt-24 md:pt-32">
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-muted-foreground backdrop-blur">
            <Sparkles className="h-3.5 w-3.5 text-accent" />
            <span>Decoración premium en {SITE.city}</span>
          </motion.div>

          <motion.h1 initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.05 }}
            className="mt-6 max-w-3xl text-4xl font-bold leading-tight sm:text-5xl md:text-6xl">
            Posters metálicos y cuadros de aluminio para{" "}
            <span className="gradient-text text-glow-neon">espacios con personalidad</span>
          </motion.h1>

          <motion.p initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.15 }}
            className="mt-5 max-w-2xl text-base text-muted-foreground sm:text-lg">
            {SITE.subtitle}. Diseño exclusivo, montaje impecable y una estética que transforma cualquier pared.
          </motion.p>

          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.25 }}
            className="mt-8 flex flex-col items-center gap-3 sm:flex-row">
            <Button asChild size="lg" className="h-12 gap-2 bg-[var(--gradient-primary)] px-6 text-primary-foreground shadow-glow hover:opacity-95">
              <a href={waLink()} target="_blank" rel="noopener noreferrer">
                <MessageCircle className="h-5 w-5" /> Pedir mi diseño
              </a>
            </Button>
            <Button asChild size="lg" variant="outline" className="h-12 gap-2 border-white/15 bg-white/5 px-6 text-foreground hover:bg-white/10">
              <Link to="/servicios">Ver colecciones <ArrowRight className="h-4 w-4" /></Link>
            </Button>
          </motion.div>

          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.7, delay: 0.35 }}
            className="relative mt-16 w-full max-w-3xl">
            <div className="glass relative overflow-hidden rounded-2xl p-6 shadow-card">
              <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-primary/30 blur-3xl" />
              <div className="absolute -bottom-10 -left-10 h-40 w-40 rounded-full bg-accent/20 blur-3xl" />
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                {[
                  { k: "100%", l: "material premium" },
                  { k: "24 h", l: "respuesta rápida" },
                  { k: "Personal", l: "diseño a medida" },
                  { k: "Envío", l: "nacional" },
                ].map((s) => (
                  <div key={s.l} className="text-left">
                    <div className="text-2xl font-bold text-primary text-glow">{s.k}</div>
                    <div className="text-xs text-muted-foreground">{s.l}</div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
        <div className="mb-10 flex flex-col items-center text-center">
          <span className="text-xs uppercase tracking-[0.2em] text-primary">Colecciones</span>
          <h2 className="mt-2 text-3xl font-bold sm:text-4xl">Diseños pensados para destacar</h2>
          <p className="mt-3 max-w-xl text-sm text-muted-foreground">Desde posters metálicos hasta cuadros premium con acabados impecables para gamers, oficinas y setups.</p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((s, i) => (
            <motion.div key={s.id} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }} transition={{ duration: 0.4, delay: i * 0.05 }}
              className="group relative overflow-hidden rounded-2xl border border-white/10 bg-card/60 p-6 backdrop-blur transition-all hover:-translate-y-1 hover:border-primary/40 hover:shadow-glow">
              <div className="mb-4 inline-grid h-12 w-12 place-items-center rounded-xl bg-[var(--gradient-primary)] shadow-glow">
                <ServiceIcon name={s.icon} className="h-6 w-6 text-primary-foreground" />
              </div>
              <h3 className="text-lg font-semibold">{s.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{s.description}</p>
              <Link to="/servicios" className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-primary hover:gap-2 transition-all">
                Ver detalle <ArrowRight className="h-4 w-4" />
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
        <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-card/60 p-8 backdrop-blur shadow-card sm:p-12">
          <div className="absolute -right-20 -top-20 h-80 w-80 rounded-full bg-primary/20 blur-3xl" />
          <div className="absolute -bottom-20 -left-20 h-80 w-80 rounded-full bg-accent/15 blur-3xl" />
          <div className="relative grid gap-10 md:grid-cols-2 md:items-center">
            <div>
              <span className="text-xs uppercase tracking-[0.2em] text-accent">Propuesta destacada</span>
              <h3 className="mt-2 text-3xl font-bold sm:text-4xl">Decoración premium para tu espacio</h3>
              <p className="mt-3 text-muted-foreground">
                Creamos posters metálicos y cuadros de aluminio con acabados de alto impacto para gaming, oficinas, motos, anime y ambientes modernos.
              </p>
              <ul className="mt-6 space-y-2.5">
                {["Diseños a medida","Material de aluminio premium","Montaje limpio y seguro","Asesoría rápida por WhatsApp"].map((b) => (
                  <li key={b} className="flex items-start gap-2 text-sm">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 text-accent" /><span>{b}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-7 flex flex-wrap gap-3">
                <Button asChild className="bg-[var(--gradient-primary)] text-primary-foreground shadow-glow">
                  <a href={waLink("Hola, me interesa un poster o cuadro de aluminio personalizado.")} target="_blank" rel="noopener noreferrer">Solicitar cotización</a>
                </Button>
                <Button asChild variant="outline" className="border-white/15 bg-white/5">
                  <Link to="/paquetes">Ver opciones</Link>
                </Button>
              </div>
            </div>
            <div className="relative">
              <div className="glass rounded-2xl p-6">
                <div className="flex items-baseline gap-2"><span className="text-4xl font-bold gradient-text">Desde</span></div>
                <div className="mt-1 text-5xl font-bold text-glow">Desde $120.000</div>
                <p className="mt-2 text-xs text-muted-foreground">COP · Diseño y producción según tamaño</p>
                <div className="mt-6 grid grid-cols-3 gap-3 text-center">
                  {["Metal", "Personalizado", "Montaje"].map((t) => (
                    <div key={t} className="rounded-lg border border-white/10 bg-white/5 px-2 py-3 text-xs">{t}</div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-10 sm:px-6">
        <div className="relative overflow-hidden rounded-2xl border border-primary/30 bg-[var(--gradient-primary)] p-8 text-center shadow-glow">
          <h3 className="text-2xl font-bold text-primary-foreground sm:text-3xl">¿Listo para transformar tu pared?</h3>
          <p className="mt-2 text-primary-foreground/80">Escríbenos por WhatsApp y diseñamos tu poster o cuadro de aluminio ideal.</p>
          <Button asChild size="lg" className="mt-5 h-12 gap-2 bg-background text-foreground hover:bg-background/90">
            <a href={waLink()} target="_blank" rel="noopener noreferrer">
              <MessageCircle className="h-5 w-5" /> Hablar por WhatsApp
            </a>
          </Button>
        </div>
      </section>
    </SiteLayout>
  );
}

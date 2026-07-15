import { useEffect } from "react";
import { Frame, HeartHandshake, Sparkles, Star } from "lucide-react";
import { SiteLayout } from "@/components/site/SiteLayout";
import { SITE } from "@/lib/site";

const VALUES = [
  { icon: Sparkles, title: "Diseño premium", text: "Cada pieza se diseña para sentirse exclusiva, limpia y con alto impacto visual." },
  { icon: Star, title: "Calidad superior", text: "Trabajamos con materiales resistentes y acabados cuidadosamente seleccionados." },
  { icon: HeartHandshake, title: "Atención cercana", text: "Te acompañamos desde la idea hasta el montaje para que el resultado sea perfecto." },
];

export default function AboutPage() {
  useEffect(() => { document.title = "Nosotros — KAIZEN LAB"; }, []);
  return (
    <SiteLayout>
      <section className="mx-auto max-w-6xl px-4 pb-10 pt-12 sm:px-6 sm:pt-20">
        <div className="grid items-center gap-10 md:grid-cols-2">
          <div>
            <span className="text-xs uppercase tracking-[0.2em] text-primary">Sobre nosotros</span>
            <h1 className="mt-2 text-4xl font-bold sm:text-5xl">
              Decoración <span className="gradient-text">premium</span> con identidad propia
            </h1>
            <p className="mt-4 text-muted-foreground">
              {SITE.name} nace para llevar diseños de alto impacto a espacios cotidianos. Creamos posters metálicos y cuadros de aluminio que combinan estética, calidad y personalidad.
            </p>
            <p className="mt-3 text-muted-foreground">Atendemos pedidos personalizados y {SITE.coverage.toLowerCase()}.</p>
          </div>
          <div className="relative">
            <div className="absolute -inset-6 -z-10 rounded-3xl bg-[var(--gradient-primary)] opacity-30 blur-2xl" />
            <div className="glass relative flex aspect-square items-center justify-center rounded-3xl">
              <div className="absolute inset-0 bg-grid opacity-30 rounded-3xl" />
              <div className="relative grid h-32 w-32 place-items-center rounded-2xl bg-[var(--gradient-primary)] shadow-glow animate-pulse-glow">
                <Frame className="h-16 w-16 text-primary-foreground" />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <h2 className="text-center text-3xl font-bold">Cómo trabajamos</h2>
        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {VALUES.map((v) => (
            <div key={v.title} className="rounded-2xl border border-white/10 bg-card/60 p-6 backdrop-blur transition-all hover:border-primary/40 hover:shadow-glow">
              <div className="grid h-11 w-11 place-items-center rounded-xl bg-[var(--gradient-primary)] shadow-glow">
                <v.icon className="h-5 w-5 text-primary-foreground" />
              </div>
              <h3 className="mt-4 text-lg font-semibold">{v.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{v.text}</p>
            </div>
          ))}
        </div>
      </section>
    </SiteLayout>
  );
}

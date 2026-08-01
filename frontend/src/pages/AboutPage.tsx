import { Frame, HeartHandshake, Sparkles, Star, MapPin } from "lucide-react";
import { SiteLayout } from "@/components/site/SiteLayout";
import { SEO } from "@/components/site/SEO";
import { useCatalogProfile } from "@/lib/catalog";
import { SITE } from "@/lib/site";

const VALUES = [
  {
    icon: Sparkles,
    title: "Diseño premium",
    text: "Cada pieza se diseña para sentirse exclusiva, limpia y con alto impacto visual.",
  },
  {
    icon: Star,
    title: "Calidad superior en aluminio",
    text: "Trabajamos con láminas de aluminio de alta densidad e impresiones HD sublimadas inalterables.",
  },
  {
    icon: HeartHandshake,
    title: "Atención directa en Armenia",
    text: "Te acompañamos desde la idea hasta el despacho para que tu experiencia sea perfecta.",
  },
];

export default function AboutPage() {
  const profile = useCatalogProfile();

  return (
    <SiteLayout>
      <SEO
        title="Sobre KAIZEN LAB | Cuadros de Aluminio en Armenia Quindío"
        description="Conoce más sobre KAIZEN LAB, empresa líder en producción de cuadros de aluminio y posters metálicos en Armenia, Quindío. Calidad HD y envíos a todo Colombia."
        keywords="empresa cuadros de aluminio armenia, sobre kaizen lab quindio, fabrica de posters metalicos armenia, arte metalico eje cafetero"
        canonical="https://kaizenlab.co/nosotros"
      />

      <section className="mx-auto max-w-6xl px-4 pb-10 pt-24 sm:px-6 sm:pt-28">
        <div className="grid items-center gap-10 md:grid-cols-2">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs uppercase tracking-[0.2em] text-primary mb-2">
              <MapPin className="h-3.5 w-3.5" /> Ubiados en Armenia, Quindío
            </div>
            <h1 className="text-4xl font-extrabold sm:text-5xl leading-tight">
              Cuadros de aluminio y posters metálicos con <span className="gradient-text">identidad propia</span>
            </h1>
            <p className="mt-4 text-muted-foreground leading-relaxed">
              {profile?.bio ||
                `En KAIZEN LAB nos dedicamos a transformar paredes con cuadros de aluminio de alta definición y posters metálicos. Diseñamos y producimos desde Armenia, Quindío para clientes exigentes en todo Colombia.`}
            </p>
            <p className="mt-3 text-muted-foreground">
              Atendemos pedidos personalizados en Armenia, el Eje Cafetero y con envíos seguros a todo el país.
            </p>
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
        <h2 className="text-center text-3xl font-bold">Por qué elegir nuestros cuadros metálicos en Armenia</h2>
        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {VALUES.map((v) => (
            <div
              key={v.title}
              className="rounded-2xl border border-white/10 bg-card/60 p-6 backdrop-blur transition-all hover:border-primary/40 hover:shadow-glow"
            >
              <div className="grid h-11 w-11 place-items-center rounded-xl bg-[var(--gradient-primary)] shadow-glow">
                <v.icon className="h-5 w-5 text-primary-foreground" />
              </div>
              <h3 className="mt-4 text-lg font-semibold">{v.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{v.text}</p>
            </div>
          ))}
        </div>
      </section>
    </SiteLayout>
  );
}

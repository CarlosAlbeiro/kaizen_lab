import { useEffect } from "react";
import { CheckCircle2, MessageCircle, Sparkles } from "lucide-react";
import { SiteLayout } from "@/components/site/SiteLayout";
import { Button } from "@/components/ui/button";
import { waLink } from "@/lib/site";

const PACKAGES = [
  {
    id: "premium",
    name: "Poster Metálico Premium",
    tag: "Más pedido",
    price: "Desde $120.000",
    description: "Diseño exclusivo para una pieza que se ve y se siente premium.",
    features: [
      "Impresión de alta calidad",
      "Acabado en aluminio",
      "Envío nacional",
      "Asesoría de diseño",
    ],
    highlight: true,
  },
  {
    id: "setup",
    name: "Cuadro para Setup",
    price: "Desde $180.000",
    description: "Ideal para gamers, oficinas y espacios con estética moderna.",
    features: [
      "Formato personalizado",
      "Montaje limpio",
      "Estilo minimalista o agresivo",
      "Entrega rápida",
    ],
    highlight: false,
  },
  {
    id: "custom",
    name: "Diseño a Medida",
    price: "Cotización especial",
    description: "Creamos una pieza única según tu idea, marca o referencia.",
    features: [
      "Concepto personalizado",
      "Ajuste de colores y tamaño",
      "Opciones premium",
      "Soporte por WhatsApp",
    ],
    highlight: false,
  },
];

export default function PackagesPage() {
  useEffect(() => {
    document.title = "Paquetes — KAIZEN LAB";
  }, []);
  return (
    <SiteLayout>
      <section className="mx-auto max-w-6xl px-4 pb-10 pt-12 sm:px-6 sm:pt-20">
        <div className="text-center">
          <span className="text-xs uppercase tracking-[0.2em] text-primary">Paquetes</span>
          <h1 className="mt-2 text-4xl font-bold sm:text-5xl">Opciones pensadas para tu estilo</h1>
          <p className="mx-auto mt-3 max-w-xl text-sm text-muted-foreground">
            Elige la propuesta que mejor se adapte a tu espacio, gusto y presupuesto.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-20 sm:px-6">
        <div className="grid gap-6 md:grid-cols-3">
          {PACKAGES.map((p) => (
            <div
              key={p.id}
              className={
                "relative flex flex-col overflow-hidden rounded-2xl border p-6 backdrop-blur transition-all " +
                (p.highlight
                  ? "border-primary/50 bg-card/80 shadow-glow"
                  : "border-white/10 bg-card/60 hover:border-primary/30")
              }
            >
              {p.tag && (
                <span className="absolute right-4 top-4 inline-flex items-center gap-1 rounded-full bg-[var(--gradient-neon)] px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-[var(--neon-foreground)] shadow-glow-neon">
                  <Sparkles className="h-3 w-3" /> {p.tag}
                </span>
              )}
              <h3 className="text-xl font-bold">{p.name}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{p.description}</p>
              <div className="my-5">
                <div className="text-4xl font-bold gradient-text">{p.price}</div>
                <div className="text-xs text-muted-foreground">COP</div>
              </div>
              <ul className="space-y-2.5">
                {p.features.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-sm">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 text-accent" />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
              <Button
                asChild
                className={
                  "mt-6 gap-2 " +
                  (p.highlight
                    ? "bg-[var(--gradient-primary)] text-primary-foreground shadow-glow"
                    : "border border-white/15 bg-white/5 text-foreground hover:bg-white/10")
                }
                variant={p.highlight ? "default" : "outline"}
              >
                <a
                  href={waLink(`Hola, me interesa ${p.name}.`)}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <MessageCircle className="h-4 w-4" /> Solicitar
                </a>
              </Button>
            </div>
          ))}
        </div>
      </section>
    </SiteLayout>
  );
}

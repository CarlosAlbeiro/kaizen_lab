import { Link } from "react-router-dom";
import { Activity, ArrowUpRight, MessageCircle, TrendingUp, Wrench } from "lucide-react";
import { useServices } from "@/lib/admin-store";
import { Button } from "@/components/ui/button";
import { ServiceIcon } from "@/components/site/ServiceIcon";

export default function DashboardPage() {
  const services = useServices();
  const active = services.filter((s) => s.active).length;
  const inactive = services.length - active;

  const stats = [
    { label: "Servicios totales", value: services.length, icon: Wrench, accent: "primary" },
    { label: "Activos", value: active, icon: Activity, accent: "neon" },
    { label: "Inactivos", value: inactive, icon: TrendingUp, accent: "muted" },
    { label: "Mensajes WA (demo)", value: 12, icon: MessageCircle, accent: "primary" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold sm:text-3xl">Dashboard</h1>
        <p className="text-sm text-muted-foreground">Resumen rápido del estado de tu sitio.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((s) => (
          <div
            key={s.label}
            className="relative overflow-hidden rounded-2xl border border-white/10 bg-card/60 p-5 backdrop-blur"
          >
            <div className="flex items-start justify-between">
              <div>
                <div className="text-xs uppercase tracking-wider text-muted-foreground">
                  {s.label}
                </div>
                <div className="mt-2 text-3xl font-bold">{s.value}</div>
              </div>
              <div
                className={
                  "grid h-10 w-10 place-items-center rounded-xl " +
                  (s.accent === "neon"
                    ? "bg-[var(--gradient-neon)] text-[var(--neon-foreground)] shadow-glow-neon"
                    : "bg-[var(--gradient-primary)] text-primary-foreground shadow-glow")
                }
              >
                <s.icon className="h-5 w-5" />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="rounded-2xl border border-white/10 bg-card/60 p-5 backdrop-blur lg:col-span-2">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Servicios recientes</h2>
            <Button asChild size="sm" variant="outline" className="border-white/10 bg-white/5">
              <Link to="/admin/servicios" className="gap-1">
                Gestionar <ArrowUpRight className="h-3.5 w-3.5" />
              </Link>
            </Button>
          </div>
          <ul className="mt-4 divide-y divide-white/5">
            {services.slice(0, 5).map((s) => (
              <li key={s.id} className="flex items-center gap-3 py-3">
                <div className="grid h-9 w-9 place-items-center rounded-lg bg-white/5">
                  <ServiceIcon name={s.icon} className="h-4 w-4 text-primary" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="truncate text-sm font-medium">{s.title}</div>
                  <div className="truncate text-xs text-muted-foreground">{s.description}</div>
                </div>
                <span
                  className={
                    "rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase " +
                    (s.active ? "bg-accent/15 text-accent" : "bg-muted text-muted-foreground")
                  }
                >
                  {s.active ? "Activo" : "Inactivo"}
                </span>
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-2xl border border-primary/30 bg-[var(--gradient-primary)] p-5 text-primary-foreground shadow-glow">
          <h2 className="text-lg font-semibold">Atajos</h2>
          <p className="mt-1 text-sm opacity-80">Acciones frecuentes</p>
          <div className="mt-4 space-y-2">
            <Button
              asChild
              variant="secondary"
              className="w-full justify-start bg-background/90 text-foreground hover:bg-background"
            >
              <Link to="/admin/servicios">+ Nuevo servicio</Link>
            </Button>
            <Button
              asChild
              variant="secondary"
              className="w-full justify-start bg-background/90 text-foreground hover:bg-background"
            >
              <Link to="/admin/ajustes">Editar contenido</Link>
            </Button>
            <Button
              asChild
              variant="secondary"
              className="w-full justify-start bg-background/90 text-foreground hover:bg-background"
            >
              <Link to="/">Ver sitio público</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

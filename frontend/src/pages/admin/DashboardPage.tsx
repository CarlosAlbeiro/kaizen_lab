import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Inbox,
  Package,
  Folder,
  MessageSquare,
  Send,
  ArrowUpRight,
  Sparkles,
  CheckCircle2,
  Clock,
  ExternalLink,
  Plus,
  Layers,
  ShoppingBag,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  useServiceRequests,
  processPendingServiceRequests,
  useWhatsAppStatus,
} from "@/lib/admin-api";
import {
  useCatalogProducts,
  useCatalogCollections,
  useCatalogBrands,
} from "@/lib/catalog";

export default function DashboardPage() {
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [processing, setProcessing] = useState(false);

  const requests = useServiceRequests(refreshTrigger);
  const products = useCatalogProducts();
  const collections = useCatalogCollections();
  const brands = useCatalogBrands();
  const waStatus = useWhatsAppStatus();

  const pendingRequests = requests.filter((r) => r.status === "pendiente");
  const contactedRequests = requests.filter((r) => r.status === "contactado");
  const processedRequests = requests.filter((r) => r.status === "procesado");

  const handleProcessPending = async () => {
    setProcessing(true);
    try {
      const res = await processPendingServiceRequests();
      toast.success(res.message || "Solicitudes procesadas con éxito", {
        description: res.whatsappConnected
          ? "Se enviaron los mensajes de confirmación e imágenes por WhatsApp."
          : "Las solicitudes cambiaron su estado a procesado.",
      });
      setRefreshTrigger((r) => r + 1);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Error al procesar solicitudes");
    } finally {
      setProcessing(false);
    }
  };

  const statCards = [
    {
      title: "Solicitudes de Cotización",
      value: requests.length,
      subtitle: `${pendingRequests.length} pendientes por procesar`,
      icon: Inbox,
      gradient: "from-blue-600/20 to-indigo-600/10 border-blue-500/30 text-blue-400",
    },
    {
      title: "Pendientes por WhatsApp",
      value: pendingRequests.length,
      subtitle: pendingRequests.length > 0 ? "¡Requieren atención o auto-proceso!" : "Todo al día",
      icon: Clock,
      gradient:
        pendingRequests.length > 0
          ? "from-amber-600/25 to-yellow-600/15 border-amber-500/40 text-amber-300 shadow-[0_0_20px_rgba(245,158,11,0.2)]"
          : "from-emerald-600/20 to-teal-600/10 border-emerald-500/30 text-emerald-400",
    },
    {
      title: "Catálogo de Cuadros HD",
      value: products.length,
      subtitle: `${collections.length} colecciones | ${brands.length} marcas`,
      icon: Package,
      gradient: "from-purple-600/20 to-pink-600/10 border-purple-500/30 text-purple-400",
    },
    {
      title: "Estado Bot WhatsApp",
      value: waStatus.ready ? "Conectado" : "Desconectado",
      subtitle: waStatus.ready ? "Enviando cotizaciones en vivo" : "Escanea el código QR en la sección WhatsApp",
      icon: MessageSquare,
      gradient: waStatus.ready
        ? "from-emerald-600/25 to-green-600/15 border-emerald-500/40 text-emerald-400"
        : "from-red-600/25 to-rose-600/15 border-red-500/40 text-red-400",
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header con Bienvenida y Estado en Vivo */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-white/10 pb-6">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold sm:text-3xl text-white">KAIZEN LAB Dashboard</h1>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-400">
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
              Sincronizado en tiempo real
            </span>
          </div>
          <p className="text-sm text-muted-foreground mt-1">
            Panel ejecutivo de control, cotizaciones metálicas HD y automatización de WhatsApp.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {pendingRequests.length > 0 && (
            <Button
              onClick={handleProcessPending}
              disabled={processing}
              className="gap-2 bg-[var(--gradient-primary)] text-primary-foreground shadow-glow font-bold animate-bounce"
            >
              <Send className="h-4 w-4" />
              {processing ? "Procesando..." : `Procesar (${pendingRequests.length}) Pendientes`}
            </Button>
          )}

          <Button asChild variant="outline" className="gap-2 border-white/15 bg-white/5 hover:bg-white/10 text-white">
            <Link to="/" target="_blank">
              Ver Tienda Pública <ExternalLink className="h-3.5 w-3.5" />
            </Link>
          </Button>
        </div>
      </div>

      {/* Tarjetas de Estadísticas Clave */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {statCards.map((card) => (
          <div
            key={card.title}
            className={`relative overflow-hidden rounded-2xl border bg-card/70 p-5 backdrop-blur-xl transition-all hover:scale-[1.01] ${card.gradient}`}
          >
            <div className="flex items-start justify-between">
              <div>
                <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  {card.title}
                </div>
                <div className="mt-2 text-3xl font-extrabold text-white">{card.value}</div>
                <div className="mt-1 text-xs text-muted-foreground truncate">{card.subtitle}</div>
              </div>
              <div className="grid h-11 w-11 place-items-center rounded-xl bg-white/10 border border-white/10 shrink-0">
                <card.icon className="h-5 w-5" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Grid Principal: Solicitudes Recientes + Atajos de Gestión */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Tabla de Solicitudes Recientes (2 columnas) */}
        <div className="rounded-2xl border border-white/10 bg-card/60 p-6 backdrop-blur-xl lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Inbox className="h-5 w-5 text-primary" />
              <h2 className="text-lg font-bold text-white">Solicitudes Recientes de Cotización</h2>
            </div>
            <Button asChild size="sm" variant="outline" className="border-white/10 bg-white/5 text-xs">
              <Link to="/admin/solicitudes" className="gap-1">
                Ver Todas ({requests.length}) <ArrowUpRight className="h-3.5 w-3.5" />
              </Link>
            </Button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-white/10 text-muted-foreground uppercase tracking-wider">
                  <th className="py-2.5 px-3">Cliente / Teléfono</th>
                  <th className="py-2.5 px-3">Detalle / Cuadro</th>
                  <th className="py-2.5 px-3">Ubicación</th>
                  <th className="py-2.5 px-3 text-right">Estado</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {requests.slice(0, 6).map((req: any) => (
                  <tr key={req.id} className="hover:bg-white/5 transition-colors">
                    <td className="py-3 px-3 font-semibold text-white truncate max-w-[140px]">
                      {req.phone || "Sin teléfono"}
                    </td>
                    <td className="py-3 px-3 text-muted-foreground truncate max-w-[200px]" title={req.product_info}>
                      {req.product_info || "Consulta general"}
                    </td>
                    <td className="py-3 px-3 text-muted-foreground truncate max-w-[120px]">
                      {req.location || "Armenia"}
                    </td>
                    <td className="py-3 px-3 text-right">
                      <span
                        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-medium ${
                          req.status === "pendiente"
                            ? "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                            : req.status === "contactado"
                            ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                            : req.status === "procesado"
                            ? "bg-blue-500/20 text-blue-300 border border-blue-500/30"
                            : "bg-white/10 text-white/80"
                        }`}
                      >
                        {req.status || "pendiente"}
                      </span>
                    </td>
                  </tr>
                ))}
                {requests.length === 0 && (
                  <tr>
                    <td colSpan={4} className="py-8 text-center text-muted-foreground">
                      No hay solicitudes registradas aún.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Panel Lateral de Atajos Ejecutivos y Resumen de Colecciones */}
        <div className="space-y-6">
          {/* Tarjeta de Atajos Rápidos */}
          <div className="rounded-2xl border border-white/10 bg-card/60 p-5 backdrop-blur-xl space-y-3">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-primary" /> Acciones Frecuentes
            </h2>
            <div className="space-y-2 pt-1">
              <Button
                asChild
                variant="outline"
                className="w-full justify-start gap-2 border-white/10 bg-white/5 hover:bg-white/10 text-white text-xs h-10"
              >
                <Link to="/admin/productos">
                  <Plus className="h-4 w-4 text-primary" /> Crear Nuevo Cuadro
                </Link>
              </Button>

              <Button
                asChild
                variant="outline"
                className="w-full justify-start gap-2 border-white/10 bg-white/5 hover:bg-white/10 text-white text-xs h-10"
              >
                <Link to="/admin/colecciones">
                  <Folder className="h-4 w-4 text-primary" /> Gestionar Colecciones
                </Link>
              </Button>

              <Button
                asChild
                variant="outline"
                className="w-full justify-start gap-2 border-white/10 bg-white/5 hover:bg-white/10 text-white text-xs h-10"
              >
                <Link to="/admin/whatsapp">
                  <MessageSquare className="h-4 w-4 text-emerald-400" /> Configurar Bot de WhatsApp
                </Link>
              </Button>

              <Button
                asChild
                variant="outline"
                className="w-full justify-start gap-2 border-white/10 bg-white/5 hover:bg-white/10 text-white text-xs h-10"
              >
                <Link to="/admin/secciones">
                  <Layers className="h-4 w-4 text-primary" /> Personalizar Secciones Web
                </Link>
              </Button>
            </div>
          </div>

          {/* Resumen de Colecciones */}
          <div className="rounded-2xl border border-white/10 bg-card/60 p-5 backdrop-blur-xl space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <ShoppingBag className="h-4 w-4 text-primary" /> Colecciones Activas
              </h3>
              <span className="text-xs text-muted-foreground">{collections.length} en total</span>
            </div>

            <div className="space-y-2 pt-1">
              {collections.slice(0, 4).map((c: any) => (
                <div
                  key={c.id}
                  className="flex items-center justify-between rounded-lg border border-white/5 bg-white/5 px-3 py-2 text-xs"
                >
                  <span className="font-semibold text-white truncate max-w-[150px]">{c.name}</span>
                  <span className="text-muted-foreground text-[11px]">{c.slug || "Colección"}</span>
                </div>
              ))}
              {collections.length === 0 && (
                <p className="text-xs text-muted-foreground">No hay colecciones configuradas.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

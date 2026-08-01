import { useState } from "react";
import { Send } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { AdminGenericCrudPage } from "./AdminGenericCrudPage";
import {
  useServiceRequests,
  createServiceRequest,
  updateServiceRequest,
  deleteServiceRequest,
  processPendingServiceRequests,
} from "@/lib/admin-api";

export default function AdminRequestsPage() {
  const [processing, setProcessing] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleProcessPending = async () => {
    setProcessing(true);
    try {
      const res = await processPendingServiceRequests();
      toast.success(res.message || "Solicitudes procesadas con éxito", {
        description: res.whatsappConnected
          ? "Se enviaron los mensajes de confirmación por WhatsApp con la foto del cuadro."
          : "Las solicitudes cambiaron su estado a procesado.",
      });
      setRefreshTrigger((r) => r + 1);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Error al procesar solicitudes");
    } finally {
      setProcessing(false);
    }
  };

  return (
    <AdminGenericCrudPage
      title="Solicitudes"
      description="Gestión de solicitudes de contacto y asesoría recibidas vía web."
      columns={["Teléfono / Origen", "Estado", "Ubicación", "Acciones"]}
      useDataHook={(r) => useServiceRequests(r + refreshTrigger)}
      createFn={createServiceRequest}
      updateFn={updateServiceRequest}
      deleteFn={deleteServiceRequest}
      customAction={
        <Button
          onClick={handleProcessPending}
          disabled={processing}
          variant="outline"
          className="gap-2 border-emerald-500/40 bg-emerald-500/10 text-emerald-300 hover:bg-emerald-500/20 font-semibold"
        >
          {processing ? (
            "Procesando..."
          ) : (
            <>
              <Send className="h-4 w-4" /> Procesar Pendientes
            </>
          )}
        </Button>
      }
      fields={[
        { id: "phone", label: "Teléfono / WhatsApp *", type: "text" },
        {
          id: "status",
          label: "Estado de la Solicitud",
          type: "select",
          options: [
            { value: "pendiente", label: "Pendiente" },
            { value: "contactado", label: "Contactado" },
            { value: "procesado", label: "Procesado" },
            { value: "fallido", label: "Fallido" },
          ],
        },
        { id: "location", label: "Ubicación / Ciudad", type: "text" },
        { id: "product_info", label: "Producto o Detalle de Cotización", type: "text" },
      ]}
    />
  );
}

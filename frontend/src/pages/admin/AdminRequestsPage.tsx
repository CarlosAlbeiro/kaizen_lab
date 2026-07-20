import { AdminGenericCrudPage } from "./AdminGenericCrudPage";
import { useServiceRequests, createServiceRequest, updateServiceRequest, deleteServiceRequest } from "@/lib/admin-api";

export default function AdminRequestsPage() {
  return (
    <AdminGenericCrudPage
      title="Solicitudes"
      description="Gestión de solicitudes de contacto y asesoría (ej. recibidas vía web)."
      columns={['Teléfono / Origen', 'Estado', '', 'Acciones']}
      useDataHook={useServiceRequests}
      createFn={createServiceRequest}
      updateFn={updateServiceRequest}
      deleteFn={deleteServiceRequest}
      fields={[
        { id: 'phone', label: 'Teléfono *', type: 'text' },
        { id: 'status', label: 'Estado (pendiente, contactado)', type: 'text' },
        { id: 'location', label: 'Ubicación / Ciudad', type: 'text' },
        { id: 'product_info', label: 'Producto de interés', type: 'text' }
      ]}
    />
  );
}

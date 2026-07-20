import { AdminGenericCrudPage } from "./AdminGenericCrudPage";
import { useClients, createClient, updateClient, deleteClient } from "@/lib/admin-api";

export default function AdminClientsPage() {
  return (
    <AdminGenericCrudPage
      title="Clientes"
      description="Base de datos de tus clientes consolidados."
      columns={['Nombre', 'Teléfono', '', 'Acciones']}
      useDataHook={useClients}
      createFn={createClient}
      updateFn={updateClient}
      deleteFn={deleteClient}
      fields={[
        { id: 'name', label: 'Nombre Completo *', type: 'text' },
        { id: 'phone', label: 'Teléfono', type: 'text' },
        { id: 'email', label: 'Email', type: 'email' },
        { id: 'city', label: 'Ciudad', type: 'text' }
      ]}
    />
  );
}

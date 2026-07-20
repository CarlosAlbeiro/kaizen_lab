import { AdminGenericCrudPage } from "./AdminGenericCrudPage";
import { useSections, createSection, updateSection, deleteSection } from "@/lib/admin-api";

export default function AdminSectionsPage() {
  return (
    <AdminGenericCrudPage
      title="Secciones"
      description="Activa o desactiva secciones enteras de la web pública."
      columns={['Nombre de la Sección', '', 'Estado', 'Acciones']}
      useDataHook={useSections}
      createFn={createSection}
      updateFn={updateSection}
      deleteFn={deleteSection}
      fields={[
        { id: 'section_name', label: 'Nombre de la Sección *', type: 'text' }
      ]}
    />
  );
}

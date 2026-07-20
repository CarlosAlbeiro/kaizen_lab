import { AdminGenericCrudPage } from "./AdminGenericCrudPage";
import { useCategories, createCategory, updateCategory, deleteCategory } from "@/lib/admin-api";

export default function AdminCategoriesPage() {
  return (
    <AdminGenericCrudPage
      title="Categorías"
      description="Administra las categorías de productos y servicios."
      columns={['Nombre', 'Tipo (service/product)', 'Estado', 'Acciones']}
      useDataHook={useCategories}
      createFn={createCategory}
      updateFn={updateCategory}
      deleteFn={deleteCategory}
      fields={[
        { id: 'name', label: 'Nombre *', type: 'text' },
        { id: 'type', label: 'Tipo (service/product)', type: 'text' },
        { id: 'icon', label: 'Ícono', type: 'text' }
      ]}
    />
  );
}

import { AdminGenericCrudPage } from "./AdminGenericCrudPage";
import { useUsers, createUser, updateUser, deleteUser } from "@/lib/admin-api";

export default function AdminUsersPage() {
  return (
    <AdminGenericCrudPage
      title="Usuarios"
      description="Administra los usuarios con acceso al panel."
      columns={['Usuario', '', 'Estado', 'Acciones']}
      useDataHook={useUsers}
      createFn={createUser}
      updateFn={updateUser}
      deleteFn={deleteUser}
      fields={[
        { id: 'username', label: 'Usuario *', type: 'text' },
        { id: 'password', label: 'Contraseña (solo al crear/cambiar) *', type: 'password' }
      ]}
    />
  );
}

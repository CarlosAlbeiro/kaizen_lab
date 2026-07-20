import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { Toaster } from "@/components/ui/sonner";
import HomePage from "@/pages/HomePage";
import ServicesPage from "@/pages/ServicesPage";
import PackagesPage from "@/pages/PackagesPage";
import AboutPage from "@/pages/AboutPage";
import ContactPage from "@/pages/ContactPage";
import CatalogPage from "@/pages/CatalogPage";
import NotFoundPage from "@/pages/NotFoundPage";
import LoginPage from "@/pages/admin/LoginPage";
import AdminLayout from "@/pages/admin/AdminLayout";
import DashboardPage from "@/pages/admin/DashboardPage";
import AdminServicesPage from "@/pages/admin/AdminServicesPage";
import AdminProductsPage from "@/pages/admin/AdminProductsPage";
import AdminCollectionsPage from "@/pages/admin/AdminCollectionsPage";
import AdminBrandsPage from "@/pages/admin/AdminBrandsPage";
import AjustesPage from "@/pages/admin/AjustesPage";
import AdminCategoriesPage from "@/pages/admin/AdminCategoriesPage";
import AdminUsersPage from "@/pages/admin/AdminUsersPage";
import AdminSectionsPage from "@/pages/admin/AdminSectionsPage";
import AdminRequestsPage from "@/pages/admin/AdminRequestsPage";
import AdminClientsPage from "@/pages/admin/AdminClientsPage";
import AdminProfilePage from "@/pages/admin/AdminProfilePage";
import AdminContactPage from "@/pages/admin/AdminContactPage";
import { isAuthed } from "@/lib/admin-store";
import { ErrorBoundary } from "@/components/ui/ErrorBoundary";

function ProtectedAdmin({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  if (!isAuthed()) {
    return <Navigate to="/admin/login" replace state={{ from: location }} />;
  }
  return <>{children}</>;
}

export default function App() {
  return (
    <ErrorBoundary>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/catalogo" element={<CatalogPage />} />
        <Route path="/servicios" element={<ServicesPage />} />
        <Route path="/paquetes" element={<PackagesPage />} />
        <Route path="/nosotros" element={<AboutPage />} />
        <Route path="/contacto" element={<ContactPage />} />

        <Route path="/admin/login" element={<LoginPage />} />
        <Route
          path="/admin"
          element={
            <ProtectedAdmin>
              <AdminLayout />
            </ProtectedAdmin>
          }
        >
          <Route index element={<DashboardPage />} />
          <Route path="servicios" element={<AdminServicesPage />} />
          <Route path="productos" element={<AdminProductsPage />} />
          <Route path="colecciones" element={<AdminCollectionsPage />} />
          <Route path="marcas" element={<AdminBrandsPage />} />
          <Route path="categorias" element={<AdminCategoriesPage />} />
          <Route path="usuarios" element={<AdminUsersPage />} />
          <Route path="secciones" element={<AdminSectionsPage />} />
          <Route path="perfil" element={<AdminProfilePage />} />
          <Route path="contacto" element={<AdminContactPage />} />
          <Route path="solicitudes" element={<AdminRequestsPage />} />
          <Route path="clientes" element={<AdminClientsPage />} />
          <Route path="whatsapp" element={<AjustesPage />} />
          <Route path="ajustes" element={<AjustesPage />} />
        </Route>

        <Route path="*" element={<NotFoundPage />} />
      </Routes>
      <Toaster richColors position="top-right" theme="dark" />
    </ErrorBoundary>
  );
}

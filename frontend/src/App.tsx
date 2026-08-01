import { lazy, Suspense } from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { Toaster } from "@/components/ui/sonner";
import { KaizenLoader } from "@/components/ui/KaizenLoader";
import HomePage from "@/pages/HomePage";
import { useAuth } from "@/lib/admin-store";
import { ErrorBoundary } from "@/components/ui/ErrorBoundary";

// Lazy-loaded pages for fast initial bundle load
const AboutPage = lazy(() => import("@/pages/AboutPage"));
const CatalogPage = lazy(() => import("@/pages/CatalogPage"));
const LegalPage = lazy(() => import("@/pages/LegalPage"));
const NotFoundPage = lazy(() => import("@/pages/NotFoundPage"));
const LoginPage = lazy(() => import("@/pages/admin/LoginPage"));
const AdminLayout = lazy(() => import("@/pages/admin/AdminLayout"));
const DashboardPage = lazy(() => import("@/pages/admin/DashboardPage"));
const AdminServicesPage = lazy(() => import("@/pages/admin/AdminServicesPage"));
const AdminProductsPage = lazy(() => import("@/pages/admin/AdminProductsPage"));
const AdminCollectionsPage = lazy(() => import("@/pages/admin/AdminCollectionsPage"));
const AdminBrandsPage = lazy(() => import("@/pages/admin/AdminBrandsPage"));
const AjustesPage = lazy(() => import("@/pages/admin/AjustesPage"));
const AdminCategoriesPage = lazy(() => import("@/pages/admin/AdminCategoriesPage"));
const AdminUsersPage = lazy(() => import("@/pages/admin/AdminUsersPage"));
const AdminSectionsPage = lazy(() => import("@/pages/admin/AdminSectionsPage"));
const AdminRequestsPage = lazy(() => import("@/pages/admin/AdminRequestsPage"));
const AdminClientsPage = lazy(() => import("@/pages/admin/AdminClientsPage"));
const AdminProfilePage = lazy(() => import("@/pages/admin/AdminProfilePage"));
const AdminContactPage = lazy(() => import("@/pages/admin/AdminContactPage"));

function ProtectedAdmin({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const authed = useAuth();
  if (!authed) {
    return <Navigate to="/admin/login" replace state={{ from: location }} />;
  }
  return <>{children}</>;
}

export default function App() {
  return (
    <ErrorBoundary>
      <Suspense fallback={<KaizenLoader fullScreen text="Cargando KAIZEN LAB..." subtext="Iniciando experiencia de alta definición" />}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/catalogo" element={<CatalogPage />} />
          <Route path="/legal" element={<LegalPage />} />
          <Route path="/nosotros" element={<AboutPage />} />

          {/* Redirecciones de rutas deshabilitadas */}
          <Route path="/contacto" element={<Navigate to="/catalogo" replace />} />
          <Route path="/servicios" element={<Navigate to="/catalogo" replace />} />
          <Route path="/paquetes" element={<Navigate to="/catalogo" replace />} />

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
      </Suspense>
      <Toaster richColors position="top-right" theme="dark" />
    </ErrorBoundary>
  );
}

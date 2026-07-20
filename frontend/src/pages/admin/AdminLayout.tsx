import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";
import {
  BarChart3,
  Cpu,
  LogOut,
  Settings,
  Wrench,
  Users,
  Layout,
  UserCircle,
  Phone,
  Tag,
  Tags,
  Folder,
  Package,
  Inbox,
  Briefcase,
  MessageSquare,
} from "lucide-react";
import { logout } from "@/lib/admin-store";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export default function AdminLayout() {
  const nav = useNavigate();
  const onLogout = () => {
    logout();
    toast.success("Sesión cerrada");
    nav("/admin/login");
  };

  const navItems = [
    { to: "/admin", label: "Dashboard", icon: BarChart3, exact: true },
    { to: "/admin/usuarios", label: "Usuarios", icon: Users, exact: false },
    { to: "/admin/secciones", label: "Secciones", icon: Layout, exact: false },
    { to: "/admin/perfil", label: "Perfil", icon: UserCircle, exact: false },
    { to: "/admin/contacto", label: "Contacto", icon: Phone, exact: false },
    { to: "/admin/marcas", label: "Marcas", icon: Tag, exact: false },
    { to: "/admin/categorias", label: "Categorías", icon: Tags, exact: false },
    { to: "/admin/colecciones", label: "Colecciones", icon: Folder, exact: false },
    { to: "/admin/servicios", label: "Servicios", icon: Wrench, exact: false },
    { to: "/admin/productos", label: "Productos", icon: Package, exact: false },
    { to: "/admin/solicitudes", label: "Solicitudes", icon: Inbox, exact: false },
    { to: "/admin/clientes", label: "Clientes", icon: Briefcase, exact: false },
    { to: "/admin/whatsapp", label: "WhatsApp", icon: MessageSquare, exact: false },
    { to: "/admin/ajustes", label: "Ajustes", icon: Settings, exact: false },
  ] as const;

  return (
    <div className="relative min-h-screen bg-background">
      <div className="absolute inset-0 -z-10 bg-grid opacity-30" aria-hidden />
      <div className="absolute left-1/3 top-0 -z-10 h-96 w-96 rounded-full bg-primary/10 blur-3xl" />

      <div className="mx-auto flex min-h-screen max-w-[1400px]">
        <aside className="hidden w-64 shrink-0 border-r border-white/10 bg-sidebar/60 backdrop-blur-xl md:flex md:flex-col">
          <Link to="/admin" className="flex items-center gap-2 px-5 py-5">
            <span className="grid h-9 w-9 place-items-center rounded-lg bg-[var(--gradient-primary)] shadow-glow">
              <Cpu className="h-5 w-5 text-primary-foreground" />
            </span>
            <div>
              <div className="text-sm font-semibold">KAIZEN LAB Admin</div>
              <div className="text-[11px] text-muted-foreground">Panel de control</div>
            </div>
          </Link>

          <nav className="flex-1 space-y-1 px-3 overflow-y-auto custom-scrollbar">
            {navItems.map((n) => (
              <NavLink
                key={n.to}
                to={n.to}
                end={n.exact}
                className={({ isActive }) =>
                  cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors",
                    isActive
                      ? "bg-[var(--gradient-primary)] text-primary-foreground shadow-glow hover:opacity-95"
                      : "text-muted-foreground hover:bg-white/5 hover:text-foreground",
                  )
                }
              >
                <n.icon className="h-4 w-4" />
                {n.label}
              </NavLink>
            ))}
          </nav>

          <div className="border-t border-white/10 p-3">
            <Button
              variant="outline"
              className="w-full justify-start gap-2 border-white/10 bg-white/5"
              onClick={onLogout}
            >
              <LogOut className="h-4 w-4" /> Cerrar sesión
            </Button>
          </div>
        </aside>

        <div className="flex min-w-0 flex-1 flex-col">
          <header className="sticky top-0 z-30 flex items-center justify-between gap-2 border-b border-white/10 bg-background/70 px-4 py-3 backdrop-blur md:hidden">
            <Link to="/admin" className="flex items-center gap-2">
              <span className="grid h-8 w-8 place-items-center rounded-lg bg-[var(--gradient-primary)]">
                <Cpu className="h-4 w-4 text-primary-foreground" />
              </span>
              <span className="text-sm font-semibold">KAIZEN LAB Admin</span>
            </Link>
            <Button
              size="sm"
              variant="outline"
              className="border-white/10 bg-white/5"
              onClick={onLogout}
            >
              <LogOut className="h-4 w-4" />
            </Button>
          </header>

          <nav className="flex gap-1 overflow-x-auto border-b border-white/10 bg-background/40 px-3 py-2 md:hidden">
            {navItems.map((n) => (
              <NavLink
                key={n.to}
                to={n.to}
                end={n.exact}
                className={({ isActive }) =>
                  cn(
                    "shrink-0 rounded-lg px-3 py-2 text-xs",
                    isActive
                      ? "bg-[var(--gradient-primary)] text-primary-foreground"
                      : "text-muted-foreground",
                  )
                }
              >
                {n.label}
              </NavLink>
            ))}
          </nav>

          <main className="flex-1 p-4 sm:p-6 lg:p-8">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
}

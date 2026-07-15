import { Link, NavLink } from "react-router-dom";
import { useEffect, useState } from "react";
import { Menu, Sparkles, X } from "lucide-react";
import { cn } from "@/lib/utils";
import profileImage from "@/assets/logo.png";

const links = [
  { to: "/", label: "Inicio" },
  { to: "/servicios", label: "Colecciones" },
  { to: "/paquetes", label: "Paquetes" },
  { to: "/nosotros", label: "Nosotros" },
  { to: "/contacto", label: "Contacto" },
] as const;

export function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed left-0 right-0 top-0 z-40 transition-all duration-300",
        scrolled ? "border-b border-white/10 bg-background/70 backdrop-blur-xl" : "bg-transparent",
      )}
    >
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link to="/" className="flex items-center gap-2 font-semibold tracking-tight">
          <img src={profileImage} alt="KAIZEN LAB" className="h-16 w-16 object-contain drop-shadow-md" />
          <span className="text-base sm:text-lg">
            KAIZEN <span className="text-primary">LAB</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              end={l.to === "/"}
              className={({ isActive }) =>
                cn(
                  "rounded-md px-3 py-2 text-sm transition-colors",
                  isActive ? "bg-white/5 text-foreground" : "text-muted-foreground hover:text-foreground",
                )
              }
            >
              {l.label}
            </NavLink>
          ))}
        </nav>

        <button
          type="button"
          aria-label="Abrir menú"
          onClick={() => setOpen((v) => !v)}
          className="grid h-10 w-10 place-items-center rounded-md border border-white/10 md:hidden"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {open && (
        <div className="border-t border-white/10 bg-background/95 backdrop-blur-xl md:hidden">
          <nav className="mx-auto flex max-w-6xl flex-col px-4 py-3">
            {links.map((l) => (
              <NavLink
                key={l.to}
                to={l.to}
                onClick={() => setOpen(false)}
                end={l.to === "/"}
                className={({ isActive }) =>
                  cn("rounded-md px-3 py-3 text-sm", isActive ? "bg-white/5 text-foreground" : "text-muted-foreground")
                }
              >
                {l.label}
              </NavLink>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}

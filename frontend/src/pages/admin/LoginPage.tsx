import { useEffect, useState, type FormEvent } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Cpu, Eye, EyeOff, Lock, User } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { isAuthed, login } from "@/lib/admin-store";

export default function LoginPage() {
  const nav = useNavigate();
  const [user, setUser] = useState("");
  const [pass, setPass] = useState("");
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    document.title = "Admin · Iniciar sesión — KAIZEN LAB";
    if (isAuthed()) nav("/admin", { replace: true });
  }, [nav]);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const ok = await login(user, pass);
      setLoading(false);
      if (ok) {
        toast.success("Bienvenido al panel");
        nav("/admin");
      } else {
        toast.error("Credenciales incorrectas");
      }
    } catch (error) {
      setLoading(false);
      toast.error("Error al conectar con el servidor");
    }
  };

  return (
    <div className="relative grid min-h-screen place-items-center overflow-hidden px-4">
      <div className="absolute inset-0 -z-10" style={{ background: "var(--gradient-hero)" }} />
      <div className="absolute inset-0 -z-10 bg-grid opacity-40" />
      <div className="absolute left-1/2 top-1/3 -z-10 h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-primary/15 blur-3xl" />

      <div className="w-full max-w-md">
        <div className="mb-6 flex items-center justify-center gap-2">
          <span className="grid h-11 w-11 place-items-center rounded-xl bg-[var(--gradient-primary)] shadow-glow animate-pulse-glow">
            <Cpu className="h-6 w-6 text-primary-foreground" />
          </span>
          <span className="text-xl font-bold">
            KAIZEN <span className="text-primary">LAB</span>
          </span>
        </div>

        <div className="glass rounded-2xl p-7 shadow-card">
          <h1 className="text-2xl font-bold">Acceder al panel</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Ingresa tus credenciales de administrador.
          </p>

          <form onSubmit={onSubmit} className="mt-6 space-y-4">
            <div>
              <Label htmlFor="user">Usuario</Label>
              <div className="relative mt-1.5">
                <User className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="user"
                  value={user}
                  onChange={(e) => setUser(e.target.value)}
                  placeholder="cabadmin"
                  className="h-11 bg-background/50 pl-9"
                  autoComplete="username"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="pass">Contraseña</Label>
              <div className="relative mt-1.5">
                <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="pass"
                  type={show ? "text" : "password"}
                  value={pass}
                  onChange={(e) => setPass(e.target.value)}
                  placeholder="••••••••"
                  className="h-11 bg-background/50 pl-9 pr-10"
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShow((v) => !v)}
                  className="absolute right-2 top-1/2 grid h-8 w-8 -translate-y-1/2 place-items-center rounded text-muted-foreground hover:text-foreground"
                  aria-label="Mostrar/ocultar contraseña"
                >
                  {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="h-11 w-full bg-[var(--gradient-primary)] text-primary-foreground shadow-glow"
            >
              {loading ? "Verificando…" : "Iniciar sesión"}
            </Button>

            <Button
              asChild
              variant="outline"
              className="h-11 w-full border-white/10 bg-white/5 text-foreground hover:bg-white/10"
            >
              <Link to="/">Ver página</Link>
            </Button>
          </form>
        </div>

        <p className="mt-4 text-center text-xs text-muted-foreground">
          Acceso restringido a administradores de KAIZEN LAB.
        </p>
      </div>
    </div>
  );
}

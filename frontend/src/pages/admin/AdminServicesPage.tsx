import { useState } from "react";
import { Pencil, Plus, RotateCcw, Trash2 } from "lucide-react";
import { toast } from "sonner";
import {
  createService,
  deleteService,
  resetServices,
  updateService,
  useServices,
  type ServiceItem,
} from "@/lib/admin-store";
import { ICON_NAMES, ServiceIcon } from "@/components/site/ServiceIcon";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

type Draft = { id?: string; title: string; description: string; icon: string; active: boolean };
const empty: Draft = { title: "", description: "", icon: "Cpu", active: true };

export default function AdminServicesPage() {
  const services = useServices();
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState<Draft>(empty);
  const [toDelete, setToDelete] = useState<ServiceItem | null>(null);

  const openNew = () => {
    setDraft(empty);
    setOpen(true);
  };
  const openEdit = (s: ServiceItem) => {
    setDraft({ ...s });
    setOpen(true);
  };

  const save = async () => {
    if (!draft.title.trim() || !draft.description.trim()) {
      toast.error("Completa título y descripción.");
      return;
    }
    try {
      if (draft.id) {
        await updateService(draft.id, {
          title: draft.title,
          description: draft.description,
          icon: draft.icon,
          active: draft.active,
        });
        toast.success("Servicio actualizado");
      } else {
        await createService({
          title: draft.title,
          description: draft.description,
          icon: draft.icon,
          active: draft.active,
        });
        toast.success("Servicio creado");
      }
      setOpen(false);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Error al guardar el servicio");
    }
  };

  const confirmDelete = async () => {
    if (!toDelete) return;
    try {
      await deleteService(toDelete.id);
      toast.success(`"${toDelete.title}" eliminado`);
      setToDelete(null);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Error al eliminar el servicio");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold sm:text-3xl">Servicios</h1>
          <p className="text-sm text-muted-foreground">
            Administra los servicios visibles en el sitio.
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            className="gap-2 border-white/10 bg-white/5"
            onClick={() => {
              resetServices();
              toast.success("Restaurado a valores por defecto");
            }}
          >
            <RotateCcw className="h-4 w-4" /> Restaurar
          </Button>
          <Button
            onClick={openNew}
            className="gap-2 bg-[var(--gradient-primary)] text-primary-foreground shadow-glow"
          >
            <Plus className="h-4 w-4" /> Nuevo servicio
          </Button>
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl border border-white/10 bg-card/60 backdrop-blur">
        <div className="hidden grid-cols-12 gap-3 border-b border-white/10 px-4 py-3 text-xs font-medium uppercase tracking-wider text-muted-foreground md:grid">
          <div className="col-span-1">Ícono</div>
          <div className="col-span-4">Título</div>
          <div className="col-span-5">Descripción</div>
          <div className="col-span-1 text-center">Estado</div>
          <div className="col-span-1 text-right">Acciones</div>
        </div>

        <ul className="divide-y divide-white/5">
          {services.map((s) => (
            <li
              key={s.id}
              className="grid grid-cols-1 gap-3 px-4 py-4 md:grid-cols-12 md:items-center"
            >
              <div className="md:col-span-1">
                <div className="grid h-10 w-10 place-items-center rounded-xl bg-[var(--gradient-primary)] shadow-glow">
                  <ServiceIcon name={s.icon} className="h-5 w-5 text-primary-foreground" />
                </div>
              </div>
              <div className="md:col-span-4">
                <div className="text-sm font-semibold">{s.title}</div>
              </div>
              <div className="text-sm text-muted-foreground md:col-span-5">{s.description}</div>
              <div className="md:col-span-1 md:text-center">
                <span
                  className={
                    "inline-block rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase " +
                    (s.active ? "bg-accent/15 text-accent" : "bg-muted text-muted-foreground")
                  }
                >
                  {s.active ? "Activo" : "Inactivo"}
                </span>
              </div>
              <div className="flex gap-2 md:col-span-1 md:justify-end">
                <Button
                  size="icon"
                  variant="outline"
                  className="h-8 w-8 border-white/10 bg-white/5"
                  onClick={() => openEdit(s)}
                >
                  <Pencil className="h-3.5 w-3.5" />
                </Button>
                <Button
                  size="icon"
                  variant="outline"
                  className="h-8 w-8 border-destructive/30 bg-destructive/10 text-destructive hover:bg-destructive/20"
                  onClick={() => setToDelete(s)}
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              </div>
            </li>
          ))}
          {services.length === 0 && (
            <li className="px-4 py-10 text-center text-sm text-muted-foreground">
              Aún no hay servicios. Crea el primero.
            </li>
          )}
        </ul>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="border-white/10 bg-card sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>{draft.id ? "Editar servicio" : "Nuevo servicio"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="t">Título</Label>
              <Input
                id="t"
                value={draft.title}
                onChange={(e) => setDraft({ ...draft, title: e.target.value })}
                className="mt-1.5 bg-background/50"
              />
            </div>
            <div>
              <Label htmlFor="d">Descripción</Label>
              <Textarea
                id="d"
                rows={3}
                value={draft.description}
                onChange={(e) => setDraft({ ...draft, description: e.target.value })}
                className="mt-1.5 bg-background/50"
              />
            </div>
            <div>
              <Label>Ícono</Label>
              <div className="mt-2 grid grid-cols-6 gap-2">
                {ICON_NAMES.map((n) => (
                  <button
                    key={n}
                    type="button"
                    onClick={() => setDraft({ ...draft, icon: n })}
                    className={
                      "grid h-10 place-items-center rounded-lg border transition-all " +
                      (draft.icon === n
                        ? "border-primary bg-primary/15 text-primary shadow-glow"
                        : "border-white/10 bg-white/5 text-muted-foreground hover:text-foreground")
                    }
                    aria-label={n}
                  >
                    <ServiceIcon name={n} className="h-4 w-4" />
                  </button>
                ))}
              </div>
            </div>
            <div className="flex items-center justify-between rounded-lg border border-white/10 bg-white/5 px-4 py-3">
              <div>
                <div className="text-sm font-medium">Activo en el sitio</div>
                <div className="text-xs text-muted-foreground">Visible en la landing pública</div>
              </div>
              <Switch
                checked={draft.active}
                onCheckedChange={(v) => setDraft({ ...draft, active: v })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              className="border-white/10 bg-white/5"
              onClick={() => setOpen(false)}
            >
              Cancelar
            </Button>
            <Button
              onClick={save}
              className="bg-[var(--gradient-primary)] text-primary-foreground shadow-glow"
            >
              {draft.id ? "Guardar cambios" : "Crear servicio"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!toDelete} onOpenChange={(o) => !o && setToDelete(null)}>
        <AlertDialogContent className="border-white/10 bg-card">
          <AlertDialogHeader>
            <AlertDialogTitle>¿Eliminar servicio?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. El servicio "{toDelete?.title}" dejará de aparecer
              en el sitio.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="border-white/10 bg-white/5">Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

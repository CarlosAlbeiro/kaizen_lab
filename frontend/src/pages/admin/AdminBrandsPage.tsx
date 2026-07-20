import { useState } from "react";
import { Plus, Pencil, Trash2, Tag } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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
import { useCatalogBrands, BrandData, createBrand, updateBrand, deleteBrand } from "@/lib/catalog";

type DraftBrand = Partial<BrandData>;

export default function AdminBrandsPage() {
  const [refresh, setRefresh] = useState(0);
  const brands = useCatalogBrands(refresh);

  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState<DraftBrand>({});
  const [toDelete, setToDelete] = useState<BrandData | null>(null);
  const [loading, setLoading] = useState(false);

  const openNew = () => {
    setDraft({ name: "", description: "", logo_url: "" });
    setOpen(true);
  };

  const openEdit = (b: BrandData) => {
    setDraft({ ...b });
    setOpen(true);
  };

  const save = async () => {
    if (!draft.name?.trim()) {
      toast.error("El nombre es requerido");
      return;
    }
    setLoading(true);
    try {
      if (draft.id) {
        await updateBrand(draft.id, draft);
        toast.success("Marca actualizada");
      } else {
        await createBrand(draft);
        toast.success("Marca creada");
      }
      setRefresh((r) => r + 1);
      setOpen(false);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Error al guardar la marca");
    } finally {
      setLoading(false);
    }
  };

  const confirmDelete = async () => {
    if (!toDelete) return;
    setLoading(true);
    try {
      await deleteBrand(toDelete.id);
      toast.success(`"${toDelete.name}" eliminada`);
      setRefresh((r) => r + 1);
      setToDelete(null);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Error al eliminar la marca");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold sm:text-3xl">Marcas</h1>
          <p className="text-sm text-muted-foreground">
            Administra las marcas de los productos (si aplica).
          </p>
        </div>
        <Button
          onClick={openNew}
          className="gap-2 bg-[var(--gradient-primary)] text-primary-foreground shadow-glow"
        >
          <Plus className="h-4 w-4" /> Nueva marca
        </Button>
      </div>

      <div className="overflow-hidden rounded-2xl border border-white/10 bg-card/60 backdrop-blur">
        <div className="hidden grid-cols-12 gap-3 border-b border-white/10 px-4 py-3 text-xs font-medium uppercase tracking-wider text-muted-foreground md:grid">
          <div className="col-span-1">Logo</div>
          <div className="col-span-4">Nombre</div>
          <div className="col-span-5">Descripción</div>
          <div className="col-span-2 text-right">Acciones</div>
        </div>

        <ul className="divide-y divide-white/5">
          {brands.map((b) => (
            <li
              key={b.id}
              className="grid grid-cols-1 gap-3 px-4 py-4 md:grid-cols-12 md:items-center"
            >
              <div className="md:col-span-1">
                <div className="grid h-10 w-10 place-items-center rounded-xl bg-black/40 border border-white/10 overflow-hidden">
                  {b.logo_url ? (
                    <img
                      src={b.logo_url}
                      alt={b.name}
                      className="h-full w-full object-contain p-1"
                    />
                  ) : (
                    <Tag className="h-5 w-5 text-muted-foreground" />
                  )}
                </div>
              </div>
              <div className="md:col-span-4">
                <div className="text-sm font-semibold">{b.name}</div>
              </div>
              <div className="text-sm text-muted-foreground md:col-span-5 line-clamp-2">
                {b.description || "-"}
              </div>
              <div className="flex gap-2 md:col-span-2 md:justify-end">
                <Button
                  size="icon"
                  variant="outline"
                  className="h-8 w-8 border-white/10 bg-white/5"
                  onClick={() => openEdit(b)}
                >
                  <Pencil className="h-3.5 w-3.5" />
                </Button>
                <Button
                  size="icon"
                  variant="outline"
                  className="h-8 w-8 border-destructive/30 bg-destructive/10 text-destructive hover:bg-destructive/20"
                  onClick={() => setToDelete(b)}
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              </div>
            </li>
          ))}
          {brands.length === 0 && (
            <li className="px-4 py-10 text-center text-sm text-muted-foreground">
              No hay marcas creadas.
            </li>
          )}
        </ul>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="border-white/10 bg-card sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>{draft.id ? "Editar marca" : "Nueva marca"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="name">Nombre *</Label>
              <Input
                id="name"
                value={draft.name || ""}
                onChange={(e) => setDraft({ ...draft, name: e.target.value })}
                className="mt-1.5 bg-background/50"
              />
            </div>
            <div>
              <Label htmlFor="desc">Descripción</Label>
              <Textarea
                id="desc"
                rows={3}
                value={draft.description || ""}
                onChange={(e) => setDraft({ ...draft, description: e.target.value })}
                className="mt-1.5 bg-background/50"
              />
            </div>
            <div>
              <Label htmlFor="img">URL del Logo (opcional)</Label>
              <Input
                id="img"
                value={draft.logo_url || ""}
                onChange={(e) => setDraft({ ...draft, logo_url: e.target.value })}
                className="mt-1.5 bg-background/50"
                placeholder="https://..."
              />
            </div>
          </div>
          <DialogFooter className="mt-4">
            <Button
              variant="outline"
              className="border-white/10 bg-white/5"
              onClick={() => setOpen(false)}
            >
              Cancelar
            </Button>
            <Button
              onClick={save}
              disabled={loading}
              className="bg-[var(--gradient-primary)] text-primary-foreground shadow-glow"
            >
              Guardar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!toDelete} onOpenChange={(o) => !o && setToDelete(null)}>
        <AlertDialogContent className="border-white/10 bg-card">
          <AlertDialogHeader>
            <AlertDialogTitle>¿Eliminar marca?</AlertDialogTitle>
            <AlertDialogDescription>Esta acción no se puede deshacer.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="border-white/10 bg-white/5">Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              disabled={loading}
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

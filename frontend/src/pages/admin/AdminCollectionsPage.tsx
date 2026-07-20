import { useState } from "react";
import { Plus, Pencil, Trash2, Folder } from "lucide-react";
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
import { useCatalogCollections, CollectionData, createCollection, updateCollection, deleteCollection } from "@/lib/catalog";
import { useCategories } from "@/lib/admin-api";

type DraftCollection = Partial<CollectionData> & { is_active?: boolean };

export default function AdminCollectionsPage() {
  const [refresh, setRefresh] = useState(0);
  const collections = useCatalogCollections(refresh);
  const categories = useCategories();

  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState<DraftCollection>({});
  const [toDelete, setToDelete] = useState<CollectionData | null>(null);
  const [loading, setLoading] = useState(false);

  const openNew = () => {
    setDraft({ name: "", description: "", image_url: "", category_id: "", is_active: true });
    setOpen(true);
  };

  const openEdit = (c: CollectionData) => {
    setDraft({ ...c, is_active: true });
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
        await updateCollection(draft.id, draft);
        toast.success("Colección actualizada");
      } else {
        await createCollection(draft);
        toast.success("Colección creada");
      }
      setRefresh(r => r + 1);
      setOpen(false);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Error al guardar la colección");
    } finally {
      setLoading(false);
    }
  };

  const confirmDelete = async () => {
    if (!toDelete) return;
    setLoading(true);
    try {
      await deleteCollection(toDelete.id);
      toast.success(`"${toDelete.name}" eliminada`);
      setRefresh(r => r + 1);
      setToDelete(null);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Error al eliminar la colección");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold sm:text-3xl">Colecciones</h1>
          <p className="text-sm text-muted-foreground">
            Agrupa los productos en colecciones temáticas.
          </p>
        </div>
        <Button
          onClick={openNew}
          className="gap-2 bg-[var(--gradient-primary)] text-primary-foreground shadow-glow"
        >
          <Plus className="h-4 w-4" /> Nueva colección
        </Button>
      </div>

      <div className="overflow-hidden rounded-2xl border border-white/10 bg-card/60 backdrop-blur">
        <div className="hidden grid-cols-12 gap-3 border-b border-white/10 px-4 py-3 text-xs font-medium uppercase tracking-wider text-muted-foreground md:grid">
          <div className="col-span-1">Ícono</div>
          <div className="col-span-3">Nombre</div>
          <div className="col-span-3">Categoría</div>
          <div className="col-span-3">Descripción</div>
          <div className="col-span-2 text-right">Acciones</div>
        </div>

        <ul className="divide-y divide-white/5">
          {collections.map((c) => (
            <li
              key={c.id}
              className="grid grid-cols-1 gap-3 px-4 py-4 md:grid-cols-12 md:items-center"
            >
              <div className="md:col-span-1">
                <div className="grid h-10 w-10 place-items-center rounded-xl bg-black/40 border border-white/10 overflow-hidden">
                  {c.image_url ? (
                    <img src={c.image_url} alt={c.name} className="h-full w-full object-cover" />
                  ) : (
                    <Folder className="h-5 w-5 text-muted-foreground" />
                  )}
                </div>
              </div>
              <div className="md:col-span-3">
                <div className="text-sm font-semibold">{c.name}</div>
              </div>
              <div className="text-sm text-muted-foreground md:col-span-3">
                {categories.find((cat: any) => cat.id === (c as any).category_id)?.name || "Sin categoría"}
              </div>
              <div className="text-sm text-muted-foreground md:col-span-3 line-clamp-2">
                {c.description || "-"}
              </div>
              <div className="flex gap-2 md:col-span-2 md:justify-end">
                <Button
                  size="icon"
                  variant="outline"
                  className="h-8 w-8 border-white/10 bg-white/5"
                  onClick={() => openEdit(c)}
                >
                  <Pencil className="h-3.5 w-3.5" />
                </Button>
                <Button
                  size="icon"
                  variant="outline"
                  className="h-8 w-8 border-destructive/30 bg-destructive/10 text-destructive hover:bg-destructive/20"
                  onClick={() => setToDelete(c)}
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              </div>
            </li>
          ))}
          {collections.length === 0 && (
            <li className="px-4 py-10 text-center text-sm text-muted-foreground">
              No hay colecciones creadas.
            </li>
          )}
        </ul>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="border-white/10 bg-card sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>{draft.id ? "Editar colección" : "Nueva colección"}</DialogTitle>
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
              <Label htmlFor="category">Categoría</Label>
              <select
                id="category"
                value={(draft as any).category_id || ""}
                onChange={(e) => setDraft({ ...draft, category_id: e.target.value || null })}
                className="mt-1.5 flex h-9 w-full rounded-md border border-input bg-white/5 px-3 py-1 text-sm text-white shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              >
                <option value="" className="bg-[#1a1a1a] text-white">Sin categoría</option>
                {categories.map((cat: any) => (
                  <option key={cat.id} value={cat.id} className="bg-[#1a1a1a] text-white">
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <Label htmlFor="img">URL de Imagen (opcional)</Label>
              <Input
                id="img"
                value={draft.image_url || ""}
                onChange={(e) => setDraft({ ...draft, image_url: e.target.value })}
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
            <AlertDialogTitle>¿Eliminar colección?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. Los productos no se eliminarán, pero perderán la
              asociación a esta colección.
            </AlertDialogDescription>
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

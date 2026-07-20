import { useState } from "react";
import { Plus, Pencil, Trash2, Image as ImageIcon } from "lucide-react";
import { toast } from "sonner";
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
import {
  useCatalogProducts,
  useCatalogCollections,
  useCatalogBrands,
  ProductData,
  createProduct,
  updateProduct,
  deleteProduct,
} from "@/lib/catalog";

type DraftProduct = Partial<ProductData> & { is_active?: boolean };

export default function AdminProductsPage() {
  const [refresh, setRefresh] = useState(0);
  const products = useCatalogProducts(refresh);
  const collections = useCatalogCollections();
  const brands = useCatalogBrands();

  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState<DraftProduct>({});
  const [toDelete, setToDelete] = useState<ProductData | null>(null);
  const [loading, setLoading] = useState(false);

  const openNew = () => {
    setDraft({
      name: "",
      description: "",
      price: "",
      image_url: "",
      reference: "",
      is_active: true,
    });
    setOpen(true);
  };

  const openEdit = (p: ProductData) => {
    setDraft({ ...p, is_active: true });
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
        await updateProduct(draft.id, draft);
        toast.success("Producto actualizado");
      } else {
        await createProduct(draft);
        toast.success("Producto creado");
      }
      setRefresh((r) => r + 1);
      setOpen(false);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Error al guardar el producto");
    } finally {
      setLoading(false);
    }
  };

  const confirmDelete = async () => {
    if (!toDelete) return;
    setLoading(true);
    try {
      await deleteProduct(toDelete.id);
      toast.success(`"${toDelete.name}" eliminado`);
      setRefresh((r) => r + 1);
      setToDelete(null);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Error al eliminar el producto");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold sm:text-3xl">Productos</h1>
          <p className="text-sm text-muted-foreground">
            Gestiona los cuadros y posters del catálogo.
          </p>
        </div>
        <Button
          onClick={openNew}
          className="gap-2 bg-[var(--gradient-primary)] text-primary-foreground shadow-glow"
        >
          <Plus className="h-4 w-4" /> Nuevo producto
        </Button>
      </div>

      <div className="overflow-hidden rounded-2xl border border-white/10 bg-card/60 backdrop-blur">
        <div className="hidden grid-cols-12 gap-3 border-b border-white/10 px-4 py-3 text-xs font-medium uppercase tracking-wider text-muted-foreground lg:grid">
          <div className="col-span-1">Imagen</div>
          <div className="col-span-3">Nombre & Ref</div>
          <div className="col-span-2">Colección</div>
          <div className="col-span-2">Precio</div>
          <div className="col-span-2 text-center">Estado</div>
          <div className="col-span-2 text-right">Acciones</div>
        </div>

        <ul className="divide-y divide-white/5">
          {products.map((p) => (
            <li
              key={p.id}
              className="grid grid-cols-1 gap-3 px-4 py-4 lg:grid-cols-12 lg:items-center"
            >
              <div className="lg:col-span-1">
                <div className="h-12 w-12 rounded-lg bg-black/40 overflow-hidden border border-white/10 flex items-center justify-center">
                  {p.image_url ? (
                    <img src={p.image_url} alt={p.name} className="h-full w-full object-cover" />
                  ) : (
                    <ImageIcon className="h-5 w-5 text-muted-foreground" />
                  )}
                </div>
              </div>
              <div className="lg:col-span-3">
                <div className="font-semibold text-sm">{p.name}</div>
                <div className="text-xs text-muted-foreground">
                  {p.reference ? `Ref: ${p.reference}` : "Sin referencia"}
                </div>
              </div>
              <div className="lg:col-span-2 text-sm text-muted-foreground">
                {p.collection_name || "-"}
              </div>
              <div className="lg:col-span-2 text-sm font-medium">
                {p.price ? `$${Number(p.price).toLocaleString("es-CO")}` : "-"}
              </div>
              <div className="lg:col-span-2 lg:text-center">
                <span className="inline-block rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase bg-accent/15 text-accent">
                  Activo
                </span>
              </div>
              <div className="flex gap-2 lg:col-span-2 lg:justify-end">
                <Button
                  size="icon"
                  variant="outline"
                  className="h-8 w-8 border-white/10 bg-white/5"
                  onClick={() => openEdit(p)}
                >
                  <Pencil className="h-3.5 w-3.5" />
                </Button>
                <Button
                  size="icon"
                  variant="outline"
                  className="h-8 w-8 border-destructive/30 bg-destructive/10 text-destructive hover:bg-destructive/20"
                  onClick={() => setToDelete(p)}
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              </div>
            </li>
          ))}
          {products.length === 0 && (
            <li className="px-4 py-10 text-center text-sm text-muted-foreground">
              Aún no hay productos creados.
            </li>
          )}
        </ul>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="border-white/10 bg-card sm:max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{draft.id ? "Editar producto" : "Nuevo producto"}</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <Label htmlFor="ref">Referencia</Label>
                  <Input
                    id="ref"
                    value={draft.reference || ""}
                    onChange={(e) => setDraft({ ...draft, reference: e.target.value })}
                    className="mt-1.5 bg-background/50"
                  />
                </div>
                <div>
                  <Label htmlFor="price">Precio (COP)</Label>
                  <Input
                    id="price"
                    type="number"
                    value={draft.price || ""}
                    onChange={(e) => setDraft({ ...draft, price: e.target.value })}
                    className="mt-1.5 bg-background/50"
                  />
                </div>
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
            </div>

            <div className="space-y-4">
              <div>
                <Label htmlFor="col">Colección</Label>
                <select
                  id="col"
                  className="mt-1.5 flex h-10 w-full items-center justify-between rounded-md border border-input bg-background/50 px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  value={draft.collection_name || ""}
                  onChange={(e) => setDraft({ ...draft, collection_name: e.target.value })}
                >
                  <option value="">Ninguna</option>
                  {collections.map((c) => (
                    <option key={c.id} value={c.name}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <Label htmlFor="img">URL de Imagen</Label>
                <Input
                  id="img"
                  value={draft.image_url || ""}
                  onChange={(e) => setDraft({ ...draft, image_url: e.target.value })}
                  className="mt-1.5 bg-background/50"
                  placeholder="https://..."
                />
              </div>

              <div className="flex items-center justify-between rounded-lg border border-white/10 bg-white/5 px-4 py-3 mt-4">
                <div>
                  <div className="text-sm font-medium">Activo en el catálogo</div>
                </div>
                <Switch
                  checked={draft.is_active}
                  onCheckedChange={(v) => setDraft({ ...draft, is_active: v })}
                />
              </div>
            </div>
          </div>
          <DialogFooter className="mt-6">
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
            <AlertDialogTitle>¿Eliminar producto?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. El producto "{toDelete?.name}" se eliminará del
              sistema.
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

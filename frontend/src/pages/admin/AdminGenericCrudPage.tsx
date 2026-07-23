import { useState } from "react";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";

type FieldDef = { id: string; label: string; type: string };

type Props = {
  title: string;
  description: string;
  columns: string[];
  fields: FieldDef[];
  useDataHook: (refresh: number) => any[];
  createFn: (data: any) => Promise<any>;
  updateFn: (id: string, data: any) => Promise<any>;
  deleteFn: (id: string) => Promise<any>;
};

export function AdminGenericCrudPage({ title, description, columns, fields, useDataHook, createFn, updateFn, deleteFn }: Props) {
  const [refresh, setRefresh] = useState(0);
  const items = useDataHook(refresh);
  
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState<any>({});
  const [toDelete, setToDelete] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);

  const openNew = () => { 
    setDraft({ is_active: true }); 
    setOpen(true); 
  };
  
  const openEdit = (item: any) => { 
    setDraft({ ...item }); 
    setOpen(true); 
  };

  const save = async () => {
    setLoading(true);
    try {
      if (draft.id) {
        await updateFn(draft.id, draft);
        toast.success("Registro actualizado");
      } else {
        await createFn(draft);
        toast.success("Registro creado");
      }
      setRefresh(r => r + 1);
      setOpen(false);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Error al guardar");
    } finally {
      setLoading(false);
    }
  };

  const confirmDelete = async () => {
    if (!toDelete) return;
    setLoading(true);
    try {
      await deleteFn(toDelete.id);
      toast.success("Registro eliminado");
      setRefresh(r => r + 1);
      setToDelete(null);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Error al eliminar");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold sm:text-3xl">{title}</h1>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>
        <Button onClick={openNew} className="gap-2 bg-[var(--gradient-primary)] text-primary-foreground shadow-glow">
          <Plus className="h-4 w-4" /> Nuevo
        </Button>
      </div>

      <div className="overflow-hidden rounded-2xl border border-white/10 bg-card/60 backdrop-blur">
        <div className="hidden grid-cols-12 gap-3 border-b border-white/10 px-4 py-3 text-xs font-medium uppercase tracking-wider text-muted-foreground md:grid">
          <div className="col-span-3">{columns[0]}</div>
          <div className="col-span-4">{columns[1]}</div>
          <div className="col-span-3">{columns[2]}</div>
          <div className="col-span-2 text-right">{columns[3] || 'Acciones'}</div>
        </div>

        <ul className="divide-y divide-white/5">
          {items.map((item: any) => (
            <li key={item.id} className="grid grid-cols-1 gap-3 px-4 py-4 md:grid-cols-12 md:items-center">
              <div className="md:col-span-3 font-semibold text-sm">{item[fields[0]?.id] || item.section_name || item.username || item.phone || "-"}</div>
              <div className="md:col-span-4 text-sm text-muted-foreground">{fields[1] ? item[fields[1].id] : "-"}</div>
              <div className="md:col-span-3 text-sm text-muted-foreground">{item.is_active !== undefined ? (item.is_active ? 'Activo' : 'Inactivo') : "-"}</div>
              <div className="flex gap-2 md:col-span-2 md:justify-end">
                <Button size="icon" variant="outline" className="h-8 w-8 border-white/10 bg-white/5" onClick={() => openEdit(item)}>
                  <Pencil className="h-3.5 w-3.5" />
                </Button>
                <Button size="icon" variant="outline" className="h-8 w-8 border-destructive/30 bg-destructive/10 text-destructive hover:bg-destructive/20" onClick={() => setToDelete(item)}>
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              </div>
            </li>
          ))}
          {items.length === 0 && (
            <li className="px-4 py-10 text-center text-sm text-muted-foreground">No hay registros.</li>
          )}
        </ul>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="border-white/10 bg-card sm:max-w-lg">
          <DialogHeader><DialogTitle>{draft.id ? "Editar" : "Nuevo"}</DialogTitle></DialogHeader>
          <div className="space-y-4">
            {fields.map(f => (
              <div key={f.id}>
                <Label htmlFor={f.id}>{f.label}</Label>
                <Input id={f.id} type={f.type} value={draft[f.id] || ""} onChange={(e) => setDraft({ ...draft, [f.id]: e.target.value })} className="mt-1.5 bg-white text-black" />
              </div>
            ))}
            
            <div className="flex items-center justify-between rounded-lg border border-white/10 bg-white/5 px-4 py-3 mt-4">
              <div className="text-sm font-medium">Activo</div>
              <Switch checked={draft.is_active ?? true} onCheckedChange={(v) => setDraft({ ...draft, is_active: v })} />
            </div>
          </div>
          <DialogFooter className="mt-4">
            <Button variant="outline" className="border-white/10 bg-white/5" onClick={() => setOpen(false)}>Cancelar</Button>
            <Button onClick={save} disabled={loading} className="bg-[var(--gradient-primary)] text-primary-foreground shadow-glow">Guardar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!toDelete} onOpenChange={(o) => !o && setToDelete(null)}>
        <AlertDialogContent className="border-white/10 bg-card">
          <AlertDialogHeader>
            <AlertDialogTitle>¿Eliminar registro?</AlertDialogTitle>
            <AlertDialogDescription>Esta acción no se puede deshacer.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="border-white/10 bg-white/5">Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} disabled={loading} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">Eliminar</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

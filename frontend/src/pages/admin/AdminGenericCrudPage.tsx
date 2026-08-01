import { useState, useEffect } from "react";
import { Plus, Pencil, Trash2, RefreshCw } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { KaizenLoader } from "@/components/ui/KaizenLoader";

type FieldDef = {
  id: string;
  label: string;
  type: string;
  options?: { value: string; label: string }[];
};

type Props = {
  title: string;
  description: string;
  columns: string[];
  fields: FieldDef[];
  useDataHook: (refresh: number) => any[];
  createFn: (data: any) => Promise<any>;
  updateFn: (id: string, data: any) => Promise<any>;
  deleteFn: (id: string) => Promise<any>;
  customAction?: React.ReactNode;
};

export function AdminGenericCrudPage({ title, description, columns, fields, useDataHook, createFn, updateFn, deleteFn, customAction }: Props) {
  const [refresh, setRefresh] = useState(0);
  const [initialLoading, setInitialLoading] = useState(true);
  const rawItems = useDataHook(refresh);
  const items = Array.isArray(rawItems) ? rawItems : [];

  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState<any>({});
  const [toDelete, setToDelete] = useState<any | null>(null);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setInitialLoading(false), 400);
    return () => clearTimeout(t);
  }, []);

  const openNew = () => { 
    const initialDraft: any = { is_active: true };
    fields.forEach((f) => {
      if (f.type === "select" && f.options?.[0]) {
        initialDraft[f.id] = f.options[0].value;
      }
    });
    setDraft(initialDraft); 
    setOpen(true); 
  };
  
  const openEdit = (item: any) => { 
    setDraft({ ...item }); 
    setOpen(true); 
  };

  const save = async () => {
    setActionLoading(true);
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
      setActionLoading(false);
    }
  };

  const confirmDelete = async () => {
    if (!toDelete) return;
    setActionLoading(true);
    try {
      await deleteFn(toDelete.id);
      toast.success("Registro eliminado");
      setRefresh(r => r + 1);
      setToDelete(null);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Error al eliminar");
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold sm:text-3xl">{title}</h1>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-0.5 text-[11px] font-medium text-emerald-400">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Sincronizado en vivo
            </span>
          </div>
          <p className="text-sm text-muted-foreground mt-1">{description}</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={() => setRefresh(r => r + 1)}
            className="gap-1.5 border-white/10 bg-white/5 text-xs text-muted-foreground hover:text-white"
            title="Refrescar datos de la tabla"
          >
            <RefreshCw className="h-3.5 w-3.5" /> Refrescar
          </Button>
          {customAction}
          <Button onClick={openNew} className="gap-2 bg-[var(--gradient-primary)] text-primary-foreground shadow-glow">
            <Plus className="h-4 w-4" /> Nuevo
          </Button>
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl border border-white/10 bg-card/60 backdrop-blur min-h-[300px] relative">
        {initialLoading && items.length === 0 ? (
          <div className="py-20 flex items-center justify-center">
            <KaizenLoader text={`Cargando ${title.toLowerCase()}...`} subtext="Sincronizando con base de datos PostgreSQL" />
          </div>
        ) : (
          <>
            <div className="hidden grid-cols-12 gap-3 border-b border-white/10 px-4 py-3 text-xs font-medium uppercase tracking-wider text-muted-foreground md:grid">
              <div className="col-span-3">{columns[0]}</div>
              <div className="col-span-4">{columns[1]}</div>
              <div className="col-span-3">{columns[2]}</div>
              <div className="col-span-2 text-right">{columns[3] || 'Acciones'}</div>
            </div>

            <ul className="divide-y divide-white/5">
              {items.map((item: any) => (
                <li key={item.id} className="grid grid-cols-1 gap-3 px-4 py-4 md:grid-cols-12 md:items-center hover:bg-white/5 transition-colors">
                  <div className="md:col-span-3 font-semibold text-sm">{item[fields[0]?.id] || item.section_name || item.username || item.phone || "-"}</div>
                  <div className="md:col-span-4 text-sm text-muted-foreground truncate">{fields[1] ? item[fields[1].id] : "-"}</div>
                  <div className="md:col-span-3 text-sm text-muted-foreground">
                    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium transition-all ${
                      item.status === 'pendiente'
                        ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                        : item.status === 'contactado'
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                        : item.status === 'procesado'
                        ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                        : item.status === 'fallido'
                        ? 'bg-red-500/20 text-red-300 border border-red-500/30'
                        : 'bg-white/10 text-white/80'
                    }`}>
                      {item.status || (item.is_active !== undefined ? (item.is_active ? 'Activo' : 'Inactivo') : "-")}
                    </span>
                  </div>
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
                <li className="px-4 py-16 text-center text-sm text-muted-foreground">No hay registros almacenados actualmente.</li>
              )}
            </ul>
          </>
        )}
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="border-white/10 bg-card sm:max-w-lg">
          {actionLoading ? (
            <div className="py-8">
              <KaizenLoader text="Guardando registro..." subtext="Actualizando base de datos en tiempo real" />
            </div>
          ) : (
            <>
              <DialogHeader><DialogTitle>{draft.id ? "Editar Registro" : "Nuevo Registro"}</DialogTitle></DialogHeader>
              <div className="space-y-4">
                {fields.map(f => (
                  <div key={f.id}>
                    <Label htmlFor={f.id}>{f.label}</Label>
                    {f.type === "select" ? (
                      <select
                        id={f.id}
                        value={draft[f.id] || (f.options?.[0]?.value || "")}
                        onChange={(e) => setDraft({ ...draft, [f.id]: e.target.value })}
                        className="mt-1.5 flex h-10 w-full items-center justify-between rounded-md border border-input bg-white px-3 py-2 text-sm text-black focus:outline-none focus:ring-2 focus:ring-primary"
                      >
                        {f.options?.map((opt) => (
                          <option key={opt.value} value={opt.value}>
                            {opt.label}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <Input
                        id={f.id}
                        type={f.type}
                        value={draft[f.id] || ""}
                        onChange={(e) => setDraft({ ...draft, [f.id]: e.target.value })}
                        className="mt-1.5 bg-white text-black"
                      />
                    )}
                  </div>
                ))}
                
                <div className="flex items-center justify-between rounded-lg border border-white/10 bg-white/5 px-4 py-3 mt-4">
                  <div className="text-sm font-medium">Activo</div>
                  <Switch checked={draft.is_active ?? true} onCheckedChange={(v) => setDraft({ ...draft, is_active: v })} />
                </div>
              </div>
              <DialogFooter className="mt-4">
                <Button variant="outline" className="border-white/10 bg-white/5" onClick={() => setOpen(false)}>Cancelar</Button>
                <Button onClick={save} disabled={actionLoading} className="bg-[var(--gradient-primary)] text-primary-foreground shadow-glow">Guardar</Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!toDelete} onOpenChange={(o) => !o && setToDelete(null)}>
        <AlertDialogContent className="border-white/10 bg-card">
          {actionLoading ? (
            <div className="py-8">
              <KaizenLoader text="Eliminando registro..." subtext="Removiendo dato de la base de datos" />
            </div>
          ) : (
            <>
              <AlertDialogHeader>
                <AlertDialogTitle>¿Eliminar registro?</AlertDialogTitle>
                <AlertDialogDescription>Esta acción no se puede deshacer.</AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel className="border-white/10 bg-white/5">Cancelar</AlertDialogCancel>
                <AlertDialogAction onClick={confirmDelete} disabled={actionLoading} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">Eliminar</AlertDialogAction>
              </AlertDialogFooter>
            </>
          )}
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

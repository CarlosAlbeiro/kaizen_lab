import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useCatalogProfile } from "@/lib/catalog";
import { updateProfile } from "@/lib/admin-api";

export default function AdminProfilePage() {
  const profile = useCatalogProfile();
  const [draft, setDraft] = useState<any>({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (profile) setDraft(profile);
  }, [profile]);

  const save = async () => {
    setLoading(true);
    try {
      await updateProfile(draft);
      toast.success("Perfil actualizado correctamente");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Error al actualizar perfil");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-2xl font-bold sm:text-3xl">Perfil</h1>
        <p className="text-sm text-muted-foreground">Administra los datos públicos de tu perfil.</p>
      </div>

      <div className="space-y-4 rounded-2xl border border-white/10 bg-card/60 p-6 backdrop-blur">
        <div>
          <Label htmlFor="name">Nombre Corto *</Label>
          <Input id="name" value={draft.name || ""} onChange={e => setDraft({...draft, name: e.target.value})} className="mt-1.5 bg-background/50" />
        </div>
        <div>
          <Label htmlFor="fullname">Nombre Completo</Label>
          <Input id="fullname" value={draft.fullname || ""} onChange={e => setDraft({...draft, fullname: e.target.value})} className="mt-1.5 bg-background/50" />
        </div>
        <div>
          <Label htmlFor="bio">Biografía / Descripción</Label>
          <Textarea id="bio" rows={4} value={draft.bio || ""} onChange={e => setDraft({...draft, bio: e.target.value})} className="mt-1.5 bg-background/50" />
        </div>
        <div>
          <Label htmlFor="image_url">URL Foto de Perfil</Label>
          <Input id="image_url" value={draft.image_url || ""} onChange={e => setDraft({...draft, image_url: e.target.value})} className="mt-1.5 bg-background/50" />
        </div>
        
        <div className="grid grid-cols-2 gap-4 mt-6">
          <div>
            <Label htmlFor="stats_years">Años Exp.</Label>
            <Input id="stats_years" value={draft.stats_years || ""} onChange={e => setDraft({...draft, stats_years: e.target.value})} className="mt-1.5 bg-background/50" />
          </div>
          <div>
            <Label htmlFor="stats_clients">Clientes</Label>
            <Input id="stats_clients" value={draft.stats_clients || ""} onChange={e => setDraft({...draft, stats_clients: e.target.value})} className="mt-1.5 bg-background/50" />
          </div>
          <div>
            <Label htmlFor="stats_products">Productos</Label>
            <Input id="stats_products" value={draft.stats_products || ""} onChange={e => setDraft({...draft, stats_products: e.target.value})} className="mt-1.5 bg-background/50" />
          </div>
        </div>
        
        <Button onClick={save} disabled={loading} className="w-full mt-4 bg-[var(--gradient-primary)] text-primary-foreground shadow-glow">
          Guardar Cambios
        </Button>
      </div>
    </div>
  );
}

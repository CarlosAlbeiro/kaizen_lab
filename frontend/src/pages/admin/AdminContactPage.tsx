import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useCatalogContact } from "@/lib/catalog";
import { updateContactInfo } from "@/lib/admin-api";

export default function AdminContactPage() {
  const contact = useCatalogContact();
  const [draft, setDraft] = useState<any>({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (contact) setDraft(contact);
  }, [contact]);

  const save = async () => {
    setLoading(true);
    try {
      await updateContactInfo(draft);
      toast.success("Información de contacto actualizada");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Error al actualizar contacto");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-2xl font-bold sm:text-3xl">Contacto</h1>
        <p className="text-sm text-muted-foreground">Administra tus enlaces y medios de contacto.</p>
      </div>

      <div className="space-y-4 rounded-2xl border border-white/10 bg-card/60 p-6 backdrop-blur">
        <div>
          <Label htmlFor="phone">Teléfono (WhatsApp)</Label>
          <Input id="phone" value={draft.phone || ""} onChange={e => setDraft({...draft, phone: e.target.value})} className="mt-1.5 bg-background/50" />
        </div>
        <div>
          <Label htmlFor="email">Correo Electrónico</Label>
          <Input id="email" type="email" value={draft.email || ""} onChange={e => setDraft({...draft, email: e.target.value})} className="mt-1.5 bg-background/50" />
        </div>
        <div>
          <Label htmlFor="address">Dirección</Label>
          <Input id="address" value={draft.address || ""} onChange={e => setDraft({...draft, address: e.target.value})} className="mt-1.5 bg-background/50" />
        </div>
        
        <div className="pt-4 border-t border-white/10 mt-6">
          <h3 className="font-semibold mb-4">Redes Sociales</h3>
          <div className="space-y-4">
            <div>
              <Label htmlFor="instagram_url">Instagram URL</Label>
              <Input id="instagram_url" value={draft.instagram_url || ""} onChange={e => setDraft({...draft, instagram_url: e.target.value})} className="mt-1.5 bg-background/50" />
            </div>
            <div>
              <Label htmlFor="tiktok_url">TikTok URL</Label>
              <Input id="tiktok_url" value={draft.tiktok_url || ""} onChange={e => setDraft({...draft, tiktok_url: e.target.value})} className="mt-1.5 bg-background/50" />
            </div>
            <div>
              <Label htmlFor="facebook_url">Facebook URL</Label>
              <Input id="facebook_url" value={draft.facebook_url || ""} onChange={e => setDraft({...draft, facebook_url: e.target.value})} className="mt-1.5 bg-background/50" />
            </div>
          </div>
        </div>
        
        <Button onClick={save} disabled={loading} className="w-full mt-4 bg-[var(--gradient-primary)] text-primary-foreground shadow-glow">
          Guardar Cambios
        </Button>
      </div>
    </div>
  );
}

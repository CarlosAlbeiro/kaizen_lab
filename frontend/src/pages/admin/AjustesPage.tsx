import { useEffect, useState } from "react";
import { Bot, CheckCircle2, Loader2, MessageCircle, QrCode, Save, Smartphone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3001/api";

type WhatsAppConfig = {
  ready: boolean;
  status: string;
  qrCodeDataUrl?: string | null;
  autoResponseActive: boolean;
  waMsgAdvice: string;
  waMsgProduct: string;
};

export default function AjustesPage() {
  const [config, setConfig] = useState<WhatsAppConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [testPhone, setTestPhone] = useState("");
  const [testing, setTesting] = useState(false);

  const loadConfig = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/whatsapp/config`);
      if (!res.ok) throw new Error("No se pudo cargar la configuración");
      const data = await res.json();
      setConfig(data);
    } catch (error) {
      console.error(error);
      toast.error("No se pudo cargar la conexión de WhatsApp");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadConfig();
  }, []);

  const saveConfig = async () => {
    if (!config) return;
    setSaving(true);
    try {
      const res = await fetch(`${API_URL}/whatsapp/config`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          autoResponseActive: config.autoResponseActive,
          waMsgAdvice: config.waMsgAdvice,
          waMsgProduct: config.waMsgProduct,
        }),
      });
      if (!res.ok) throw new Error("No se pudo guardar");
      toast.success("Configuración guardada");
    } catch (error) {
      console.error(error);
      toast.error("Error al guardar la configuración");
    } finally {
      setSaving(false);
    }
  };

  const sendTestMessage = async () => {
    if (!testPhone.trim()) {
      toast.error("Ingresa un número de WhatsApp para probar");
      return;
    }

    setTesting(true);
    try {
      const res = await fetch(`${API_URL}/whatsapp/test`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          to: testPhone,
          message: "Prueba de conexión desde KAIZEN LAB Admin",
        }),
      });
      if (!res.ok) throw new Error("Error al enviar");
      toast.success("Mensaje de prueba enviado");
    } catch (error) {
      console.error(error);
      toast.error("No se pudo enviar el mensaje de prueba");
    } finally {
      setTesting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold sm:text-3xl">Ajustes</h1>
        <p className="text-sm text-muted-foreground">
          Gestiona la conexión de WhatsApp y el chatbot desde aquí.
        </p>
      </div>

      <div className="rounded-2xl border border-white/10 bg-card/60 p-6 backdrop-blur">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-sm font-semibold">Estado de WhatsApp</p>
            <p className="text-sm text-muted-foreground">
              Conecta el bot, escanea el QR y deja el chatbot listo para responder.
            </p>
          </div>
          <div
            className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-sm ${config?.ready ? "bg-emerald-500/15 text-emerald-400" : "bg-amber-500/15 text-amber-400"}`}
          >
            {config?.ready ? (
              <CheckCircle2 className="h-4 w-4" />
            ) : (
              <Smartphone className="h-4 w-4" />
            )}
            {config?.ready ? "Conectado" : "Esperando conexión"}
          </div>
        </div>

        {loading ? (
          <div className="mt-6 flex items-center gap-2 text-sm text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin" /> Cargando estado del bot...
          </div>
        ) : (
          <div className="mt-6 grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
            <div className="rounded-2xl border border-white/10 bg-background/60 p-4">
              <div className="mb-4 flex items-center gap-2">
                <QrCode className="h-4 w-4 text-primary" />
                <h3 className="font-semibold">QR de autenticación</h3>
              </div>

              {config?.qrCodeDataUrl ? (
                <div className="flex justify-center rounded-2xl bg-white p-4">
                  <img
                    src={config.qrCodeDataUrl}
                    alt="QR de WhatsApp"
                    className="h-48 w-48 object-contain"
                  />
                </div>
              ) : (
                <div className="rounded-2xl border border-dashed border-white/10 p-6 text-center text-sm text-muted-foreground">
                  El QR aparecerá aquí cuando el bot genere una sesión nueva.
                </div>
              )}
            </div>

            <div className="space-y-4 rounded-2xl border border-white/10 bg-background/60 p-4">
              <div className="flex items-center gap-2">
                <Bot className="h-4 w-4 text-primary" />
                <h3 className="font-semibold">Configuración del chatbot</h3>
              </div>

              <div className="flex items-center justify-between rounded-xl border border-white/10 px-3 py-2">
                <div>
                  <p className="text-sm font-medium">Respuestas automáticas</p>
                  <p className="text-xs text-muted-foreground">
                    Activa o desactiva el bot para mensajes entrantes.
                  </p>
                </div>
                <Switch
                  checked={config?.autoResponseActive ?? false}
                  onCheckedChange={(value) =>
                    setConfig((prev) => (prev ? { ...prev, autoResponseActive: value } : prev))
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="advice">Mensaje de bienvenida</Label>
                <Textarea
                  id="advice"
                  value={config?.waMsgAdvice ?? ""}
                  onChange={(event) =>
                    setConfig((prev) =>
                      prev ? { ...prev, waMsgAdvice: event.target.value } : prev,
                    )
                  }
                  className="min-h-24"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="product">Mensaje para productos</Label>
                <Textarea
                  id="product"
                  value={config?.waMsgProduct ?? ""}
                  onChange={(event) =>
                    setConfig((prev) =>
                      prev ? { ...prev, waMsgProduct: event.target.value } : prev,
                    )
                  }
                  className="min-h-24"
                />
              </div>

              <Button onClick={saveConfig} disabled={saving} className="w-full">
                {saving ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Guardando...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" /> Guardar configuración
                  </>
                )}
              </Button>
            </div>
          </div>
        )}
      </div>

      <div className="rounded-2xl border border-white/10 bg-card/60 p-6 backdrop-blur">
        <div className="flex items-center gap-2">
          <MessageCircle className="h-4 w-4 text-primary" />
          <h2 className="text-lg font-semibold">Probar WhatsApp</h2>
        </div>
        <p className="mt-1 text-sm text-muted-foreground">
          Envía un mensaje de prueba si la sesión ya está autenticada.
        </p>

        <div className="mt-4 flex flex-col gap-3 sm:flex-row">
          <Input
            placeholder="+57 320 000 0000"
            value={testPhone}
            onChange={(event) => setTestPhone(event.target.value)}
            className="max-w-sm"
          />
          <Button variant="outline" onClick={sendTestMessage} disabled={testing}>
            {testing ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Enviando...
              </>
            ) : (
              "Enviar prueba"
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}

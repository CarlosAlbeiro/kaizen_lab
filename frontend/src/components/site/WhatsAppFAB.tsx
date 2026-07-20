import { useState, type FormEvent } from "react";
import { CheckCircle2, Loader2, MessageCircle } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3001";

type RequestFormState = {
  name: string;
  phone: string;
  location: string;
  message: string;
};

export function WhatsAppFAB() {
  const [formData, setFormData] = useState<RequestFormState>({
    name: "",
    phone: "",
    location: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);

  const handleChange = (field: keyof RequestFormState, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!formData.name.trim() || !formData.phone.trim() || !formData.message.trim()) {
      setFeedback("Completa tu nombre, teléfono y mensaje para enviar la solicitud.");
      return;
    }

    setIsSubmitting(true);
    setFeedback(null);

    try {
      const response = await fetch(`${API_BASE_URL}/api/service-requests`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          phone: formData.phone,
          location: formData.location || "No especificada",
          product_info: `Nombre: ${formData.name}\nMensaje: ${formData.message}`,
          source: "web",
          status: "pendiente",
          consent_given: true,
          policy_version: "v1.0",
        }),
      });

      if (!response.ok) {
        throw new Error("No se pudo guardar la solicitud");
      }

      setFeedback("Solicitud enviada correctamente. Pronto te contactaremos.");
      setFormData({ name: "", phone: "", location: "", message: "" });
    } catch (error) {
      console.error(error);
      setFeedback("Ocurrió un error al guardar la solicitud. Inténtalo nuevamente.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <button
          aria-label="Solicitar información"
          className="fixed bottom-5 right-5 z-50 grid h-14 w-14 place-items-center rounded-full bg-[var(--accent)] text-[var(--accent-foreground)] shadow-glow-neon transition-transform hover:scale-110 animate-pulse-glow"
        >
          <MessageCircle className="h-7 w-7" />
        </button>
      </PopoverTrigger>
      <PopoverContent
        side="top"
        align="end"
        className="mb-2 w-88 border-none bg-white p-4 text-black shadow-xl"
      >
        <div className="mb-3 space-y-1">
          <p className="text-sm font-semibold text-black">Solicita información</p>
          <p className="text-sm leading-tight text-gray-600">
            Cuéntanos qué necesitas y te contactamos para tu poster o cuadro de aluminio.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="space-y-1.5">
            <Label htmlFor="name" className="text-sm text-black">
              Nombre
            </Label>
            <Input
              id="name"
              placeholder="Tu nombre"
              value={formData.name}
              onChange={(event) => handleChange("name", event.target.value)}
              className="border-gray-300 text-black placeholder:text-gray-400 focus-visible:ring-gray-400"
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="phone" className="text-sm text-black">
              Teléfono / WhatsApp
            </Label>
            <Input
              id="phone"
              type="tel"
              placeholder="+57 320 000 0000"
              value={formData.phone}
              onChange={(event) => handleChange("phone", event.target.value)}
              className="border-gray-300 text-black placeholder:text-gray-400 focus-visible:ring-gray-400"
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="location" className="text-sm text-black">
              Ciudad o ubicación
            </Label>
            <Input
              id="location"
              placeholder="Bogotá"
              value={formData.location}
              onChange={(event) => handleChange("location", event.target.value)}
              className="border-gray-300 text-black placeholder:text-gray-400 focus-visible:ring-gray-400"
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="message" className="text-sm text-black">
              ¿Qué te gustaría cotizar?
            </Label>
            <Textarea
              id="message"
              placeholder="Ej. Quiero un poster metálico para mi sala..."
              value={formData.message}
              onChange={(event) => handleChange("message", event.target.value)}
              className="min-h-24 border-gray-300 text-black placeholder:text-gray-400 focus-visible:ring-gray-400"
            />
          </div>

          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-[var(--accent)] text-[var(--accent-foreground)] hover:opacity-90"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Enviando...
              </>
            ) : (
              <>
                <CheckCircle2 className="mr-2 h-4 w-4" /> Enviar solicitud
              </>
            )}
          </Button>

          {feedback ? (
            <p
              className={`text-sm ${feedback.includes("correctamente") ? "text-green-600" : "text-red-600"}`}
            >
              {feedback}
            </p>
          ) : null}
        </form>
      </PopoverContent>
    </Popover>
  );
}

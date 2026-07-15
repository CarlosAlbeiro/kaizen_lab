import { useState } from "react";
import { MessageCircle } from "lucide-react";
import { waLink } from "@/lib/site";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export function WhatsAppFAB() {
  const [number, setNumber] = useState("");

  const handleSolicitar = () => {
    if (!number.trim()) return;
    const message = `Hola KAIZEN LAB, quisiera cotizar un poster o cuadro de aluminio. Mi número es: ${number}`;
    window.open(waLink(message), "_blank");
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <button
          aria-label="Escríbenos por WhatsApp"
          className="fixed bottom-5 right-5 z-50 grid h-14 w-14 place-items-center rounded-full bg-[var(--accent)] text-[var(--accent-foreground)] shadow-glow-neon transition-transform hover:scale-110 animate-pulse-glow"
        >
          <MessageCircle className="h-7 w-7" />
        </button>
      </PopoverTrigger>
      <PopoverContent side="top" align="end" className="w-80 bg-white text-black p-4 mb-2 shadow-xl border-none">
        <p className="text-sm font-medium mb-3 leading-tight">
          Escribe tu número de WhatsApp para cotizar tu poster o cuadro de aluminio. Ejemplo: +573123456789
        </p>
        <div className="flex flex-col gap-3">
          <Input 
            type="tel"
            placeholder="+573123456789" 
            value={number}
            onChange={(e) => setNumber(e.target.value)}
            className="border-gray-300 text-black placeholder:text-gray-400 focus-visible:ring-gray-400"
          />
          <Button onClick={handleSolicitar} className="w-full bg-[#25D366] hover:bg-[#128C7E] text-white">
            Cotizar
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}

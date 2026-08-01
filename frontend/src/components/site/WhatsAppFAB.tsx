import { useState } from "react";
import { MessageCircle } from "lucide-react";
import { QuoteModal } from "./QuoteModal";

export function WhatsAppFAB() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        aria-label="Contactar por WhatsApp"
        className="fixed bottom-6 right-6 z-50 grid h-14 w-14 place-items-center rounded-full bg-primary text-primary-foreground shadow-[0_0_25px_rgba(229,57,53,0.6)] transition-all duration-300 hover:scale-110 hover:shadow-[0_0_35px_rgba(229,57,53,0.8)] animate-pulse-glow"
      >
        <MessageCircle className="h-7 w-7" />
      </button>

      <QuoteModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        product={null}
      />
    </>
  );
}

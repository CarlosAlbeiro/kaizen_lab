import { Sparkles, Loader2 } from "lucide-react";
import profileLogo from "@/assets/logo.png";

type KaizenLoaderProps = {
  text?: string;
  subtext?: string;
  fullScreen?: boolean;
};

export function KaizenLoader({
  text = "Procesando solicitud...",
  subtext = "Conectando con el servidor de KAIZEN LAB",
  fullScreen = false,
}: KaizenLoaderProps) {
  const content = (
    <div className="flex flex-col items-center justify-center text-center p-6 space-y-4">
      {/* Logo y Marco Neón Pulsante */}
      <div className="relative grid place-items-center">
        {/* Resplandor neón exterior */}
        <div className="absolute -inset-4 rounded-full bg-primary/30 blur-xl animate-pulse-glow" />
        
        {/* Anillo giratorio externo */}
        <div className="h-20 w-20 rounded-full border-2 border-primary/20 border-t-primary animate-spin" />

        {/* Marco de aluminio interno con logo */}
        <div className="absolute grid h-14 w-14 place-items-center rounded-2xl bg-black/90 border border-white/20 shadow-glow backdrop-blur">
          <img src={profileLogo} alt="KAIZEN LAB" className="h-10 w-10 object-contain animate-pulse" />
        </div>
      </div>

      {/* Texto de estado */}
      <div className="space-y-1">
        <h4 className="text-base font-bold text-white tracking-wide flex items-center justify-center gap-1.5">
          <Sparkles className="h-4 w-4 text-primary animate-bounce" />
          <span>{text}</span>
        </h4>
        <p className="text-xs text-muted-foreground">{subtext}</p>
      </div>

      {/* Indicador de barra de progreso neón */}
      <div className="h-1 w-32 rounded-full bg-white/10 overflow-hidden relative">
        <div className="h-full w-full bg-[var(--gradient-primary)] rounded-full animate-[shimmer_1.5s_infinite] shadow-glow" />
      </div>
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/90 backdrop-blur-md">
        {content}
      </div>
    );
  }

  return content;
}

import { useState, useRef } from "react";
import { Sparkles, ArrowRight, Play, Maximize2, ShieldCheck, Truck, ShoppingBag } from "lucide-react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ProductData } from "@/lib/catalog";
import { useCart } from "@/context/CartContext";
import { QuoteModal } from "./QuoteModal";

type ProductDetailModalProps = {
  product: ProductData | null;
  isOpen: boolean;
  onClose: () => void;
};

export function ProductDetailModal({ product, isOpen, onClose }: ProductDetailModalProps) {
  const { addToCart } = useCart();
  const [activeMediaIndex, setActiveMediaIndex] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);
  const [zoomPos, setZoomPos] = useState({ x: 50, y: 50 });
  const [isQuoteOpen, setIsQuoteOpen] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);

  if (!product) return null;

  const mediaList: string[] = [];
  if (product.image_url) mediaList.push(product.image_url);
  if (product.media && Array.isArray(product.media)) {
    product.media.forEach((m) => {
      if (m && !mediaList.includes(m)) mediaList.push(m);
    });
  }
  if (mediaList.length === 0) {
    mediaList.push("https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=800&q=80");
  }

  const currentMedia = mediaList[activeMediaIndex] || mediaList[0];
  const isVideo = currentMedia.endsWith(".mp4") || currentMedia.includes("youtube.com") || currentMedia.includes("vimeo.com");

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const { left, top, width, height } = containerRef.current.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    setZoomPos({ x: Math.max(0, Math.min(100, x)), y: Math.max(0, Math.min(100, y)) });
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={(o) => !o && onClose()}>
        <DialogContent className="border-white/15 bg-card/95 backdrop-blur-2xl max-w-4xl p-0 overflow-hidden text-white sm:rounded-3xl shadow-[0_0_80px_rgba(229,57,53,0.3)]">
          <div className="grid grid-cols-1 lg:grid-cols-12 max-h-[90vh] overflow-y-auto custom-scrollbar">
            {/* Columna Izquierda: Visor con Lente de Zoom Mercado Libre & Miniaturas */}
            <div className="lg:col-span-7 p-6 bg-black/60 flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-white/10">
              <div className="relative w-full">
                {/* Badge de Marca / Calidad */}
                <div className="absolute top-3 left-3 z-20 flex gap-2">
                  <span className="rounded-full border border-primary/40 bg-black/80 backdrop-blur px-3 py-1 text-[10px] font-bold text-primary shadow-glow">
                    Aluminio HD Premium
                  </span>
                  {product.reference && (
                    <span className="rounded-full border border-white/20 bg-black/60 backdrop-blur px-2.5 py-1 text-[10px] text-white">
                      REF: {product.reference}
                    </span>
                  )}
                </div>

                {/* Visor Principal con Zoom Mercado Libre */}
                <div
                  ref={containerRef}
                  onMouseEnter={() => !isVideo && setIsZoomed(true)}
                  onMouseLeave={() => setIsZoomed(false)}
                  onMouseMove={handleMouseMove}
                  className="relative aspect-[3/4] w-full overflow-hidden rounded-2xl border border-white/15 bg-black cursor-crosshair group shadow-card"
                >
                  {isVideo ? (
                    currentMedia.endsWith(".mp4") ? (
                      <video src={currentMedia} controls autoPlay loop className="h-full w-full object-cover" />
                    ) : (
                      <iframe src={currentMedia} title="Video" className="h-full w-full" allowFullScreen />
                    )
                  ) : (
                    <>
                      <img
                        src={currentMedia}
                        alt={product.name}
                        className="h-full w-full object-cover transition-opacity duration-300"
                      />
                      {/* Lente de Zoom en tiempo real (Mercado Libre Style) */}
                      {isZoomed && (
                        <div
                          className="absolute inset-0 z-30 pointer-events-none border-2 border-primary/60 shadow-[0_0_30px_rgba(229,57,53,0.5)] transition-all"
                          style={{
                            backgroundImage: `url(${currentMedia})`,
                            backgroundPosition: `${zoomPos.x}% ${zoomPos.y}%`,
                            backgroundSize: "280%",
                            backgroundRepeat: "no-repeat",
                          }}
                        />
                      )}
                    </>
                  )}

                  {!isVideo && !isZoomed && (
                    <div className="absolute bottom-3 right-3 z-10 rounded-full bg-black/70 backdrop-blur px-2.5 py-1 text-[10px] text-white/80 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Maximize2 className="h-3 w-3 text-primary" />
                      Pasa el cursor para hacer zoom
                    </div>
                  )}
                </div>
              </div>

              {/* Tira de Miniaturas */}
              {mediaList.length > 1 && (
                <div className="mt-4 flex gap-3 overflow-x-auto pb-1 custom-scrollbar">
                  {mediaList.map((m, idx) => {
                    const isVid = m.endsWith(".mp4") || m.includes("youtube") || m.includes("vimeo");
                    return (
                      <button
                        key={idx}
                        onClick={() => setActiveMediaIndex(idx)}
                        className={`relative h-16 w-16 shrink-0 overflow-hidden rounded-xl border transition-all ${
                          activeMediaIndex === idx
                            ? "border-primary shadow-glow ring-2 ring-primary/40 scale-105"
                            : "border-white/10 opacity-60 hover:opacity-100"
                        }`}
                      >
                        {isVid ? (
                          <div className="h-full w-full bg-black/80 flex flex-col items-center justify-center text-primary">
                            <Play className="h-5 w-5 fill-current" />
                            <span className="text-[8px] mt-0.5 text-white">Video</span>
                          </div>
                        ) : (
                          <img src={m} alt={`Foto ${idx + 1}`} className="h-full w-full object-cover" />
                        )}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Columna Derecha: Especificaciones y Acciones */}
            <div className="lg:col-span-5 p-6 md:p-8 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 text-xs font-semibold text-primary uppercase tracking-widest">
                  <Sparkles className="h-3.5 w-3.5" />
                  <span>{product.collection_name || "Colección Exclusiva"}</span>
                </div>

                <h2 className="text-2xl sm:text-3xl font-extrabold mt-2 text-white leading-tight">
                  {product.name}
                </h2>

                {product.price && (
                  <div className="mt-4 flex items-baseline gap-2">
                    <span className="text-3xl sm:text-4xl font-extrabold gradient-text">
                      ${Number(product.price).toLocaleString("es-CO")}
                    </span>
                    <span className="text-xs text-muted-foreground">COP</span>
                  </div>
                )}

                <div className="mt-6 space-y-3 border-t border-b border-white/10 py-4">
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {product.description || "Cuadro de aluminio de alta densidad con acabado brillante metálico de larga durabilidad. Resistente a la humedad y rayos UV."}
                  </p>

                  <div className="grid grid-cols-2 gap-3 pt-2">
                    <div className="rounded-xl border border-white/10 bg-white/5 p-3 text-xs">
                      <ShieldCheck className="h-4 w-4 text-primary mb-1" />
                      <span className="font-semibold block text-white">Aluminio HD</span>
                      <span className="text-muted-foreground text-[11px]">Sublimación directa</span>
                    </div>
                    <div className="rounded-xl border border-white/10 bg-white/5 p-3 text-xs">
                      <Truck className="h-4 w-4 text-primary mb-1" />
                      <span className="font-semibold block text-white">Envío Seguro</span>
                      <span className="text-muted-foreground text-[11px]">Empaque reforzado</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Botones de Acción: Cotizar Ahora & Agregar al Carrito */}
              <div className="mt-8 space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <Button
                    onClick={() => addToCart(product)}
                    variant="outline"
                    size="lg"
                    className="h-12 gap-2 border-white/20 bg-white/5 hover:bg-white/10 text-white font-semibold"
                  >
                    <ShoppingBag className="h-4 w-4 text-primary" /> Agregar al Carrito
                  </Button>

                  <Button
                    onClick={() => setIsQuoteOpen(true)}
                    size="lg"
                    className="h-12 gap-2 bg-[var(--gradient-primary)] text-primary-foreground shadow-glow hover:opacity-95 font-bold"
                  >
                    Cotizar Ahora <ArrowRight className="h-4 w-4" />
                  </Button>
                </div>

                <p className="text-[11px] text-center text-muted-foreground">
                  Agrega múltiples cuadros para cotizar tu selección completa
                </p>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Modal de Cotización Unificado */}
      <QuoteModal
        isOpen={isQuoteOpen}
        onClose={() => setIsQuoteOpen(false)}
        product={product}
      />
    </>
  );
}

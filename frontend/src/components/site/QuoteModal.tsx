import { useState, useEffect } from "react";
import { Sparkles, Phone, MapPin, User, CheckCircle2, Clock, ShieldCheck, ShoppingBag } from "lucide-react";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { KaizenLoader } from "@/components/ui/KaizenLoader";
import { createServiceRequest } from "@/lib/admin-api";
import { SITE } from "@/lib/site";
import { ProductData } from "@/lib/catalog";
import { CartItem, useCart } from "@/context/CartContext";

type QuoteModalProps = {
  isOpen: boolean;
  onClose: () => void;
  product?: ProductData | null;
  cartItems?: CartItem[];
};

export function QuoteModal({ isOpen, onClose, product, cartItems }: QuoteModalProps) {
  const { clearCart } = useCart();
  const [phone, setPhone] = useState("");
  const [name, setName] = useState("");
  const [location, setLocation] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const isCartQuote = cartItems && cartItems.length > 0;

  useEffect(() => {
    if (!isOpen) {
      setPhone("");
      setName("");
      setLocation("");
      setSubmitted(false);
    }
  }, [isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!phone.trim()) {
      toast.error("Ingresa tu número de teléfono / WhatsApp");
      return;
    }

    setLoading(true);
    try {
      let productSummary = "";
      let productImage = "";

      if (isCartQuote) {
        const totalPcs = cartItems.reduce((sum, i) => sum + i.quantity, 0);
        const subtotal = cartItems.reduce(
          (sum, i) => sum + (i.product.price ? Number(i.product.price) : 0) * i.quantity,
          0
        );

        const itemsListStr = cartItems
          .map(
            (i) =>
              `- ${i.quantity}x ${i.product.name}${i.product.reference ? ` (Ref: ${i.product.reference})` : ""} ($${Number(i.product.price || 0).toLocaleString("es-CO")} COP c/u)`
          )
          .join("\n");

        productSummary = `Cotización Grupal (${totalPcs} cuadros):\n${itemsListStr}\nSubtotal Estimado: $${subtotal.toLocaleString("es-CO")} COP`;
        
        // Guardar todas las URLs de imágenes separadas por coma para enviar cada foto por WhatsApp
        productImage = cartItems
          .map((i) => i.product.image_url)
          .filter((url): url is string => Boolean(url && url.trim()))
          .join(",");
      } else if (product) {
        productSummary = `${product.name} (Ref: ${product.reference || "S/R"}) - $${Number(product.price || 0).toLocaleString("es-CO")} COP`;
        productImage = product.image_url || "";
      } else {
        productSummary = "Consulta General / Solicitud Directa";
      }

      // Guardar la solicitud en la base de datos (service_requests)
      await createServiceRequest({
        phone: phone.trim(),
        location: location.trim() ? `${name ? name + " - " : ""}${location.trim()}` : name || SITE.city,
        product_info: productSummary,
        product_image: productImage,
        source: isCartQuote ? "cotizacion_grupal_carrito" : product ? "modal_producto" : "boton_flotante",
        status: "pendiente",
      });

      if (isCartQuote) {
        clearCart();
      }

      setSubmitted(true);
      toast.success("¡Solicitud registrada con éxito!");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Error al guardar la solicitud");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="border-white/15 bg-card/95 backdrop-blur-xl sm:max-w-md shadow-[0_0_50px_rgba(229,57,53,0.25)] text-white overflow-hidden">
        {loading ? (
          <div className="py-8">
            <KaizenLoader
              text="Registrando cotización..."
              subtext="Enviando datos al servidor de KAIZEN LAB"
            />
          </div>
        ) : !submitted ? (
          <>
            <DialogHeader>
              <div className="flex items-center gap-2 text-xs font-semibold text-primary uppercase tracking-wider">
                <Sparkles className="h-4 w-4" />
                <span>
                  {isCartQuote
                    ? "Cotización Grupal de Cuadros"
                    : product
                    ? "Cotización de Cuadro"
                    : "Asesoría Personalizada"}
                </span>
              </div>
              <DialogTitle className="text-xl sm:text-2xl font-bold mt-1 text-white">
                {isCartQuote
                  ? `Cotizar ${cartItems.reduce((sum, i) => sum + i.quantity, 0)} Cuadros`
                  : product
                  ? product.name
                  : "Solicitar Información"}
              </DialogTitle>
            </DialogHeader>

            {/* Resumen de Producto Individual */}
            {!isCartQuote && product && (
              <div className="flex items-center gap-4 rounded-xl border border-white/10 bg-white/5 p-3 mt-1">
                {product.image_url ? (
                  <img
                    src={product.image_url}
                    alt={product.name}
                    className="h-16 w-16 rounded-lg object-cover border border-white/10 shrink-0"
                  />
                ) : (
                  <div className="h-16 w-16 rounded-lg bg-black/40 border border-white/10 flex items-center justify-center text-xs text-muted-foreground shrink-0">
                    Sin foto
                  </div>
                )}
                <div className="min-w-0 flex-1">
                  <h4 className="font-semibold text-sm truncate">{product.name}</h4>
                  {product.reference && (
                    <span className="text-xs text-primary block">REF: {product.reference}</span>
                  )}
                  {product.price && (
                    <span className="text-sm font-bold text-white block mt-0.5">
                      ${Number(product.price).toLocaleString("es-CO")} COP
                    </span>
                  )}
                </div>
              </div>
            )}

            {/* Resumen de Cotización Grupal del Carrito */}
            {isCartQuote && (
              <div className="rounded-xl border border-white/10 bg-white/5 p-3.5 mt-1 space-y-2 max-h-36 overflow-y-auto custom-scrollbar">
                <div className="flex items-center justify-between text-xs font-semibold text-primary pb-1.5 border-b border-white/10">
                  <span className="flex items-center gap-1">
                    <ShoppingBag className="h-3.5 w-3.5" /> Selección de Cuadros ({cartItems.reduce((s, i) => s + i.quantity, 0)})
                  </span>
                  <span>
                    Subtotal: $
                    {cartItems
                      .reduce((s, i) => s + (i.product.price ? Number(i.product.price) : 0) * i.quantity, 0)
                      .toLocaleString("es-CO")}{" "}
                    COP
                  </span>
                </div>
                {cartItems.map(({ product: p, quantity: q }) => (
                  <div key={p.id} className="flex items-center justify-between text-xs">
                    <span className="truncate text-white/90 max-w-[200px]">
                      • {q}x {p.name}
                    </span>
                    <span className="font-medium text-white/70">
                      ${(Number(p.price || 0) * q).toLocaleString("es-CO")}
                    </span>
                  </div>
                ))}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4 mt-2">
              <div>
                <Label htmlFor="req-phone" className="text-xs font-medium text-white flex items-center gap-1.5 mb-1.5">
                  <Phone className="h-3.5 w-3.5 text-primary" /> Número de Teléfono / WhatsApp *
                </Label>
                <Input
                  id="req-phone"
                  type="tel"
                  required
                  placeholder="Ej: 3001234567"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="bg-white/10 border-white/15 text-white placeholder:text-white/40 h-11"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <Label htmlFor="req-name" className="text-xs font-medium text-white flex items-center gap-1.5 mb-1.5">
                    <User className="h-3.5 w-3.5 text-muted-foreground" /> Nombre (Opcional)
                  </Label>
                  <Input
                    id="req-name"
                    type="text"
                    placeholder="Tu nombre"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="bg-white/10 border-white/15 text-white placeholder:text-white/40 h-10 text-sm"
                  />
                </div>
                <div>
                  <Label htmlFor="req-location" className="text-xs font-medium text-white flex items-center gap-1.5 mb-1.5">
                    <MapPin className="h-3.5 w-3.5 text-muted-foreground" /> Ciudad / Ubicación
                  </Label>
                  <Input
                    id="req-location"
                    type="text"
                    placeholder="Ej: Medellín"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="bg-white/10 border-white/15 text-white placeholder:text-white/40 h-10 text-sm"
                  />
                </div>
              </div>

              <p className="text-[11px] text-muted-foreground leading-relaxed flex items-start gap-1.5 mt-2">
                <ShieldCheck className="h-3.5 w-3.5 text-primary shrink-0 mt-0.5" />
                <span>Tus datos están protegidos. Un asesor te enviará la información en breves minutos.</span>
              </p>

              <div className="flex gap-2 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={onClose}
                  className="w-1/3 border-white/10 bg-white/5 hover:bg-white/10 text-white"
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  disabled={loading}
                  className="w-2/3 gap-2 bg-[var(--gradient-primary)] text-primary-foreground shadow-glow hover:opacity-95 h-11 font-bold"
                >
                  {isCartQuote ? "Cotizar Carrito" : "Solicitar Información"}
                </Button>
              </div>
            </form>
          </>
        ) : (
          /* Vista de Confirmación Exitosa */
          <div className="py-6 px-2 text-center flex flex-col items-center">
            <div className="h-16 w-16 rounded-full bg-primary/20 border border-primary/40 flex items-center justify-center mb-4 shadow-[0_0_30px_rgba(229,57,53,0.5)]">
              <CheckCircle2 className="h-8 w-8 text-primary animate-pulse" />
            </div>

            <h3 className="text-2xl font-bold text-white">¡Solicitud Recibida!</h3>

            <p className="mt-3 text-sm text-muted-foreground leading-relaxed max-w-xs">
              En unos minutos un asesor se comunicará contigo al número <strong className="text-white">{phone}</strong> para enviarte la cotización detallada de tu selección de cuadros.
            </p>

            <div className="mt-4 flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-xs text-primary">
              <Clock className="h-4 w-4" />
              <span>Tiempo promedio de respuesta: 5 a 15 minutos</span>
            </div>

            <Button
              onClick={onClose}
              className="mt-6 w-full bg-[var(--gradient-primary)] text-primary-foreground shadow-glow h-11 font-bold"
            >
              Entendido / Cerrar
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

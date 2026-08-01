import { useState } from "react";
import { ShoppingBag, Plus, Minus, Trash2, ArrowRight, ShieldCheck } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useCart } from "@/context/CartContext";
import { QuoteModal } from "./QuoteModal";

export function CartDrawer() {
  const { items, isCartOpen, setIsCartOpen, removeFromCart, updateQuantity, clearCart, totalItems, totalPrice } = useCart();
  const [isQuoteOpen, setIsQuoteOpen] = useState(false);

  const handleOpenQuote = () => {
    setIsQuoteOpen(true);
  };

  return (
    <>
      <Dialog open={isCartOpen} onOpenChange={setIsCartOpen}>
        <DialogContent className="border-white/15 bg-card/95 backdrop-blur-2xl max-w-md w-full h-[92vh] p-0 flex flex-col justify-between text-white shadow-[0_0_80px_rgba(229,57,53,0.3)] sm:rounded-3xl overflow-hidden">
          {/* Header */}
          <div className="p-5 border-b border-white/10 flex items-center justify-between bg-black/40">
            <div className="flex items-center gap-2">
              <div className="grid h-9 w-9 place-items-center rounded-full bg-primary/20 text-primary border border-primary/30 shadow-glow">
                <ShoppingBag className="h-4 w-4" />
              </div>
              <div>
                <DialogTitle className="text-lg font-bold text-white leading-none">
                  Carrito de Cotización
                </DialogTitle>
                <p className="text-xs text-muted-foreground mt-1">
                  {totalItems === 1 ? "1 cuadro seleccionado" : `${totalItems} cuadros seleccionados`}
                </p>
              </div>
            </div>
            {items.length > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={clearCart}
                className="text-xs text-muted-foreground hover:text-destructive h-8 px-2"
              >
                Vaciar todo
              </Button>
            )}
          </div>

          {/* Lista de Cuadros en el Carrito (Detalles DEBAJO de la Imagen) */}
          <div className="flex-1 overflow-y-auto p-5 space-y-5 custom-scrollbar">
            {items.length > 0 ? (
              items.map(({ product, quantity }) => (
                <div
                  key={product.id}
                  className="flex flex-col overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-4 transition-all hover:border-white/20 shadow-card"
                >
                  {/* Foto centrada arriba */}
                  <div className="relative aspect-[16/9] sm:aspect-[4/3] w-full overflow-hidden rounded-xl bg-black/50 border border-white/10 mb-3">
                    {product.image_url ? (
                      <img
                        src={product.image_url}
                        alt={product.name}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="h-full w-full bg-black/40 flex items-center justify-center text-xs text-muted-foreground">
                        Sin imagen
                      </div>
                    )}
                    {product.reference && (
                      <span className="absolute top-2 left-2 rounded-full border border-primary/40 bg-black/80 backdrop-blur px-2.5 py-0.5 text-[10px] font-semibold text-primary">
                        REF: {product.reference}
                      </span>
                    )}
                  </div>

                  {/* Detalles del Producto DEBAJO de la Imagen */}
                  <div className="space-y-2">
                    <h4 className="font-bold text-base text-white leading-tight">{product.name}</h4>
                    
                    {product.collection_name && (
                      <p className="text-xs text-primary/90 font-medium">
                        Colección: {product.collection_name}
                      </p>
                    )}

                    {product.description && (
                      <p className="text-xs text-muted-foreground line-clamp-2">
                        {product.description}
                      </p>
                    )}

                    {product.price && (
                      <div className="flex items-baseline justify-between pt-1">
                        <span className="text-xs text-muted-foreground">Precio unitario:</span>
                        <span className="text-sm font-extrabold text-white">
                          ${Number(product.price).toLocaleString("es-CO")} COP
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Controles de Cantidad y Botón Eliminar del Carrito DEBAJO */}
                  <div className="flex items-center justify-between pt-3 mt-3 border-t border-white/10">
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-muted-foreground">Cantidad:</span>
                      <div className="flex items-center rounded-lg border border-white/15 bg-black/40 overflow-hidden">
                        <button
                          onClick={() => updateQuantity(product.id, quantity - 1)}
                          className="h-8 w-8 grid place-items-center text-white/70 hover:text-white hover:bg-white/10 transition-colors"
                        >
                          <Minus className="h-3.5 w-3.5" />
                        </button>
                        <span className="w-8 text-center text-xs font-bold text-white">{quantity}</span>
                        <button
                          onClick={() => updateQuantity(product.id, quantity + 1)}
                          className="h-8 w-8 grid place-items-center text-white/70 hover:text-white hover:bg-white/10 transition-colors"
                        >
                          <Plus className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>

                    {/* Botón Eliminar del Carrito */}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => removeFromCart(product.id)}
                      className="h-8 border-destructive/30 bg-destructive/10 text-destructive hover:bg-destructive/20 text-xs gap-1.5 px-3"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                      <span>Eliminar</span>
                    </Button>
                  </div>
                </div>
              ))
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center py-16 text-muted-foreground">
                <div className="h-16 w-16 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mb-4">
                  <ShoppingBag className="h-8 w-8 opacity-40 text-primary" />
                </div>
                <h3 className="text-base font-bold text-white">Tu carrito está vacío</h3>
                <p className="text-xs mt-1 max-w-xs">
                  Agrega cuadros desde el carrusel o catálogo para solicitar una cotización grupal consolidada.
                </p>
              </div>
            )}
          </div>

          {/* Footer del Carrito con Subtotal y Botón de Cotización */}
          {items.length > 0 && (
            <div className="p-5 border-t border-white/10 bg-black/60 space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Subtotal Estimado ({totalItems} pcs):</span>
                <span className="text-xl font-extrabold gradient-text">
                  ${totalPrice.toLocaleString("es-CO")} COP
                </span>
              </div>

              <p className="text-[11px] text-muted-foreground flex items-center gap-1.5">
                <ShieldCheck className="h-3.5 w-3.5 text-primary shrink-0" />
                <span>Recibirás la cotización consolidada con asesoría de envío en Armenia y Colombia.</span>
              </p>

              <Button
                onClick={handleOpenQuote}
                size="lg"
                className="w-full h-12 gap-2 bg-[var(--gradient-primary)] text-primary-foreground shadow-glow hover:opacity-95 text-base font-bold"
              >
                Cotizar Selección ({totalItems} cuadros) <ArrowRight className="h-5 w-5" />
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Modal de Cotización Grupal */}
      <QuoteModal
        isOpen={isQuoteOpen}
        onClose={() => {
          setIsQuoteOpen(false);
          setIsCartOpen(false);
        }}
        cartItems={items}
      />
    </>
  );
}

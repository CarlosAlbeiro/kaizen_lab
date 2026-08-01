import { useState } from "react";
import { motion } from "framer-motion";
import { Sparkles, ArrowRight, ShoppingBag, Eye } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useCatalogProducts, ProductData } from "@/lib/catalog";
import { useCart } from "@/context/CartContext";
import { ProductDetailModal } from "./ProductDetailModal";

export function CuadrosCarousel() {
  const catalogProducts = useCatalogProducts();
  const { addToCart } = useCart();
  const [isPaused, setIsPaused] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<ProductData | null>(null);

  const displayItems = (catalogProducts || []).map((p) => ({
    rawProduct: p,
    id: p.id,
    name: p.name,
    price: p.price ? Number(p.price) : 0,
    category: p.collection_name || "Aluminio Premium",
    image_url: p.image_url || "",
    badge: p.is_promotion ? "Oferta" : "Destacado",
  }));

  const infiniteList =
    displayItems.length > 0
      ? displayItems.length < 5
        ? [...displayItems, ...displayItems, ...displayItems, ...displayItems]
        : [...displayItems, ...displayItems, ...displayItems]
      : [];

  return (
    <section className="py-16 sm:py-20 relative overflow-hidden bg-gradient-to-b from-background via-black/50 to-background border-y border-white/10">
      <div className="absolute left-1/4 top-1/2 -z-10 h-[350px] w-[500px] -translate-y-1/2 rounded-full bg-primary/15 blur-[120px] pointer-events-none" />
      <div className="absolute right-1/4 top-1/2 -z-10 h-[350px] w-[500px] -translate-y-1/2 rounded-full bg-accent/10 blur-[120px] pointer-events-none" />

      {/* Encabezado */}
      <div className="mb-10 flex flex-col items-center text-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 text-xs text-primary shadow-[0_0_15px_rgba(229,57,53,0.3)] mb-3"
        >
          <Sparkles className="h-3.5 w-3.5" />
          <span className="font-semibold uppercase tracking-wider">Galería de Cuadros & Posters</span>
        </motion.div>

        <h2 className="text-3xl font-bold sm:text-4xl md:text-5xl tracking-tight">
          Colección de <span className="gradient-text drop-shadow-[0_0_20px_rgba(229,57,53,0.5)]">Cuadros Metálicos</span>
        </h2>
        <p className="mt-3 max-w-xl text-sm sm:text-base text-muted-foreground">
          Haz clic en cualquier cuadro para ver sus detalles o agrégalo directamente a tu carrito de cotización.
        </p>
      </div>

      {/* Contenedor del Carrusel Animado */}
      {infiniteList.length > 0 ? (
        <div
          className="relative w-full overflow-hidden py-4"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          <div className="absolute left-0 top-0 z-20 h-full w-24 sm:w-36 bg-gradient-to-r from-background via-background/80 to-transparent pointer-events-none" />
          <div className="absolute right-0 top-0 z-20 h-full w-24 sm:w-36 bg-gradient-to-l from-background via-background/80 to-transparent pointer-events-none" />

          <motion.div
            className="flex gap-6 sm:gap-8 w-max px-6 cursor-pointer"
            animate={isPaused ? {} : { x: ["0%", "-33.333%"] }}
            transition={{
              x: {
                repeat: Infinity,
                repeatType: "loop",
                duration: Math.max(15, infiniteList.length * 3),
                ease: "linear",
              },
            }}
          >
            {infiniteList.map((item, idx) => (
              <motion.div
                key={`${item.id}-${idx}`}
                onClick={() => setSelectedProduct(item.rawProduct)}
                whileHover={{ y: -8, scale: 1.02 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                className="group relative w-[240px] sm:w-[290px] aspect-[2/3] shrink-0 rounded-2xl border border-white/15 bg-card/80 p-2.5 backdrop-blur-md shadow-card overflow-hidden transition-all duration-300 hover:border-primary/60 hover:shadow-[0_0_30px_rgba(229,57,53,0.35)]"
              >
                <div className="relative w-full h-full rounded-xl overflow-hidden bg-black flex flex-col justify-end">
                  {item.image_url ? (
                    <img
                      src={item.image_url}
                      alt={item.name}
                      className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-90 group-hover:opacity-100"
                    />
                  ) : (
                    <div className="absolute inset-0 bg-neutral-900 flex items-center justify-center text-xs text-muted-foreground">
                      Sin imagen
                    </div>
                  )}

                  <div className="absolute top-3 left-3 z-10">
                    <span className="rounded-full border border-primary/40 bg-black/80 backdrop-blur px-3 py-1 text-[10px] font-bold text-primary shadow-glow">
                      {item.badge}
                    </span>
                  </div>

                  <div className="absolute top-3 right-3 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
                    <span className="grid h-8 w-8 place-items-center rounded-full bg-black/80 border border-white/20 text-white backdrop-blur shadow-glow">
                      <Eye className="h-4 w-4" />
                    </span>
                  </div>

                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent opacity-80 group-hover:opacity-90 transition-opacity duration-300" />

                  <div className="relative z-10 p-4 transform transition-transform duration-300 group-hover:translate-y-0">
                    <span className="text-[11px] font-medium uppercase tracking-wider text-primary drop-shadow">
                      {item.category}
                    </span>
                    <h3 className="text-base font-bold text-white leading-tight mt-0.5 line-clamp-1 group-hover:text-primary transition-colors">
                      {item.name}
                    </h3>

                    <div className="mt-3 flex items-center justify-between pt-2 border-t border-white/10">
                      <div>
                        <span className="text-[10px] text-muted-foreground block">Precio</span>
                        <span className="text-base font-extrabold text-white">
                          ${item.price.toLocaleString("es-CO")}
                        </span>
                      </div>

                      <Button
                        size="icon"
                        onClick={(e) => {
                          e.stopPropagation();
                          addToCart(item.rawProduct);
                        }}
                        title="Agregar al carrito"
                        className="h-8 w-8 rounded-full bg-primary text-primary-foreground shadow-glow hover:scale-110 transition-transform"
                      >
                        <ShoppingBag className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      ) : (
        <div className="py-12 text-center text-sm text-muted-foreground">
          No hay productos disponibles actualmente en el catálogo.
        </div>
      )}

      <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4 px-4">
        <Button
          asChild
          size="lg"
          className="h-12 px-8 gap-2 bg-[var(--gradient-primary)] text-primary-foreground shadow-glow hover:opacity-95"
        >
          <Link to="/catalogo">
            Explorar todo el catálogo <ArrowRight className="h-4 w-4" />
          </Link>
        </Button>
      </div>

      <ProductDetailModal
        product={selectedProduct}
        isOpen={Boolean(selectedProduct)}
        onClose={() => setSelectedProduct(null)}
      />
    </section>
  );
}

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ShoppingBag, ArrowRight, Filter, Search, Eye, Plus } from "lucide-react";
import { SiteLayout } from "@/components/site/SiteLayout";
import { SEO } from "@/components/site/SEO";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useCatalogProducts, useCatalogCollections, ProductData } from "@/lib/catalog";
import { useCart } from "@/context/CartContext";
import { ProductDetailModal } from "@/components/site/ProductDetailModal";
import { QuoteModal } from "@/components/site/QuoteModal";
import { KaizenLoader } from "@/components/ui/KaizenLoader";
import { ProductSkeletonGrid } from "@/components/ui/ProductSkeleton";

export default function CatalogPage() {
  const products = useCatalogProducts();
  const collections = useCatalogCollections();
  const { addToCart } = useCart();
  const [loadingData, setLoadingData] = useState(true);

  const [searchQuery, setSearchQuery] = useState("");
  const [activeCollection, setActiveCollection] = useState<string>("all");
  const [selectedProduct, setSelectedProduct] = useState<ProductData | null>(null);
  const [quoteProduct, setQuoteProduct] = useState<ProductData | null>(null);

  useEffect(() => {
    if (products.length > 0) {
      setLoadingData(false);
    } else {
      const timer = setTimeout(() => setLoadingData(false), 800);
      return () => clearTimeout(timer);
    }
  }, [products]);

  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (product.reference && product.reference.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCollection =
      activeCollection === "all" ||
      product.collection_id === activeCollection ||
      product.collection_name === activeCollection;
    return matchesSearch && matchesCollection;
  });

  return (
    <SiteLayout>
      <SEO
        title="Catálogo de Cuadros de Aluminio y Posters Metálicos | KAIZEN LAB Armenia Quindío"
        description="Explora el catálogo exclusivo de cuadros de aluminio y posters metálicos sublimados en HD en Armenia, Quindío. Diseños únicos con envíos a todo Colombia."
        keywords="catalogo cuadros de aluminio armenia, comprar cuadros metalicos quindio, galeria de posters metalicos colombia, cuadros kaizen lab"
        canonical="https://kaizenlab.co/catalogo"
      />

      <section className="relative overflow-hidden pt-24 md:pt-32 pb-16">
        <div className="absolute inset-0 -z-10 bg-[var(--gradient-hero)] opacity-50" aria-hidden />
        <div
          className="absolute left-1/2 top-0 -z-10 h-[400px] w-[600px] -translate-x-1/2 rounded-full bg-primary/20 blur-[100px]"
          aria-hidden
        />

        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="text-center">
            <motion.h1
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-4xl font-bold md:text-6xl gradient-text text-glow-neon"
            >
              Colección Exclusiva de Cuadros de Aluminio
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto"
            >
              Fabricados en Armenia, Quindío. Cuadros sublimados en HD con acabados metálicos brillantes de máxima durabilidad.
            </motion.p>
          </div>

          {/* Filtros y Buscador */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-12 flex flex-col sm:flex-row gap-4 items-center justify-between bg-card/40 border border-white/10 p-4 rounded-2xl backdrop-blur-md shadow-card"
          >
            <div className="flex w-full sm:w-auto items-center gap-2 overflow-x-auto pb-2 sm:pb-0 scrollbar-hide">
              <Button
                variant={activeCollection === "all" ? "default" : "outline"}
                className={`rounded-full shrink-0 ${
                  activeCollection === "all"
                    ? "bg-[var(--gradient-primary)] text-primary-foreground shadow-glow border-none"
                    : "bg-white/5 border-white/10 hover:bg-white/10 text-white"
                }`}
                onClick={() => setActiveCollection("all")}
              >
                Todas
              </Button>
              {collections.map((c) => (
                <Button
                  key={c.id}
                  variant={activeCollection === c.id || activeCollection === c.name ? "default" : "outline"}
                  className={`rounded-full shrink-0 ${
                    activeCollection === c.id || activeCollection === c.name
                      ? "bg-[var(--gradient-primary)] text-primary-foreground shadow-glow border-none"
                      : "bg-white/5 border-white/10 hover:bg-white/10 text-white"
                  }`}
                  onClick={() => setActiveCollection(c.id)}
                >
                  {c.name}
                </Button>
              ))}
            </div>

            {/* Buscador con texto blanco */}
            <div className="relative w-full sm:w-72 shrink-0">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/60" />
              <Input
                placeholder="Buscar por obra o referencia..."
                className="pl-9 bg-white/10 text-white placeholder:text-white/40 border-white/15 focus-visible:ring-primary/50"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </motion.div>

          {/* Grid de Productos o Estado de Carga Neón */}
          <div className="mt-10">
            {loadingData ? (
              <div className="py-12 space-y-8">
                <KaizenLoader text="Cargando obras de aluminio..." subtext="Consultando catálogo en la base de datos de Armenia, Quindío" />
                <ProductSkeletonGrid count={8} />
              </div>
            ) : filteredProducts.length > 0 ? (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {filteredProducts.map((product, i) => (
                  <motion.div
                    key={product.id}
                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: i * 0.05 }}
                    className="group relative flex flex-col overflow-hidden rounded-2xl border border-white/10 bg-card/30 backdrop-blur-sm transition-all hover:border-primary/40 hover:shadow-glow hover:-translate-y-1"
                  >
                    <div
                      onClick={() => setSelectedProduct(product)}
                      className="aspect-[3/4] w-full overflow-hidden bg-black/40 relative cursor-pointer"
                    >
                      {product.image_url ? (
                        <img
                          src={product.image_url}
                          alt={`Cuadro de aluminio ${product.name} KAIZEN LAB Armenia Quindío`}
                          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center text-muted-foreground">
                          <ShoppingBag className="h-12 w-12 opacity-20" />
                        </div>
                      )}
                      {product.price && (
                        <div className="absolute top-3 right-3 bg-black/70 backdrop-blur-md px-3 py-1 rounded-full text-sm font-semibold border border-white/10 text-white">
                          ${Number(product.price).toLocaleString("es-CO")}
                        </div>
                      )}
                      {product.collection_name && (
                        <div className="absolute bottom-3 left-3 bg-primary/20 backdrop-blur-md px-2.5 py-0.5 rounded text-xs text-primary-foreground border border-primary/30 font-medium">
                          {product.collection_name}
                        </div>
                      )}
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-black/80 border border-white/20 px-3 py-1.5 text-xs text-white backdrop-blur">
                          <Eye className="h-4 w-4 text-primary" /> Ver Detalle
                        </span>
                      </div>
                    </div>

                    <div className="p-5 flex-1 flex flex-col">
                      <h3
                        onClick={() => setSelectedProduct(product)}
                        className="text-lg font-bold leading-tight hover:text-primary cursor-pointer transition-colors"
                      >
                        {product.name}
                      </h3>
                      {product.reference && (
                        <p className="text-xs text-primary font-semibold mt-1">REF: {product.reference}</p>
                      )}
                      <p className="mt-2 text-sm text-muted-foreground line-clamp-2 flex-1">
                        {product.description || "Cuadro sublimado premium de alta durabilidad en aluminio."}
                      </p>

                      <div className="mt-5 grid grid-cols-5 gap-2">
                        <Button
                          onClick={() => addToCart(product)}
                          variant="outline"
                          title="Agregar al carrito"
                          className="col-span-2 border-white/15 bg-white/5 hover:bg-white/10 text-white text-xs gap-1 px-2"
                        >
                          <Plus className="h-3.5 w-3.5 text-primary" /> Carrito
                        </Button>
                        <Button
                          onClick={() => setQuoteProduct(product)}
                          className="col-span-3 bg-white/5 border border-white/10 hover:bg-[var(--gradient-primary)] hover:border-transparent hover:text-white transition-all group-hover:shadow-glow text-xs"
                        >
                          Cotizar <ArrowRight className="ml-1 h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="py-20 text-center flex flex-col items-center">
                <div className="h-20 w-20 rounded-full bg-white/5 flex items-center justify-center mb-4 border border-white/10">
                  <Filter className="h-8 w-8 text-muted-foreground" />
                </div>
                <h3 className="text-xl font-semibold">No se encontraron productos</h3>
                <p className="text-muted-foreground mt-2">
                  Intenta con otros términos de búsqueda o selecciona otra colección.
                </p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Modal de Detalle del Producto */}
      <ProductDetailModal
        product={selectedProduct}
        isOpen={Boolean(selectedProduct)}
        onClose={() => setSelectedProduct(null)}
      />

      {/* Modal de Cotización Específica */}
      <QuoteModal
        product={quoteProduct}
        isOpen={Boolean(quoteProduct)}
        onClose={() => setQuoteProduct(null)}
      />
    </SiteLayout>
  );
}

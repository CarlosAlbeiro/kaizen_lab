import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ShoppingBag, ArrowRight, Filter, Search } from "lucide-react";
import { SiteLayout } from "@/components/site/SiteLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useCatalogProducts, useCatalogCollections } from "@/lib/catalog";
import { waLink } from "@/lib/site";

export default function CatalogPage() {
  const products = useCatalogProducts();
  const collections = useCatalogCollections();

  const [searchQuery, setSearchQuery] = useState("");
  const [activeCollection, setActiveCollection] = useState<string>("all");

  useEffect(() => {
    document.title = "Catálogo Premium — KAIZEN LAB";
  }, []);

  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (product.reference && product.reference.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCollection =
      activeCollection === "all" || product.collection_name === activeCollection;
    return matchesSearch && matchesCollection;
  });

  return (
    <SiteLayout>
      <section className="relative overflow-hidden pt-24 md:pt-32 pb-10">
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
              Colección Exclusiva
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto"
            >
              Explora nuestra selección de posters metálicos y cuadros sublimados diseñados para
              transformar tu entorno.
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
                className={`rounded-full shrink-0 ${activeCollection === "all" ? "bg-[var(--gradient-primary)] text-primary-foreground shadow-glow border-none" : "bg-white/5 border-white/10 hover:bg-white/10"}`}
                onClick={() => setActiveCollection("all")}
              >
                Todas
              </Button>
              {collections.map((c) => (
                <Button
                  key={c.id}
                  variant={activeCollection === c.name ? "default" : "outline"}
                  className={`rounded-full shrink-0 ${activeCollection === c.name ? "bg-[var(--gradient-primary)] text-primary-foreground shadow-glow border-none" : "bg-white/5 border-white/10 hover:bg-white/10"}`}
                  onClick={() => setActiveCollection(c.name)}
                >
                  {c.name}
                </Button>
              ))}
            </div>
            <div className="relative w-full sm:w-64 shrink-0">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar obra..."
                className="pl-9 bg-black/20 border-white/10 focus-visible:ring-primary/50"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </motion.div>

          {/* Grid de Productos */}
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredProducts.length > 0 ? (
              filteredProducts.map((product, i) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, scale: 0.95, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: i * 0.05 }}
                  className="group relative flex flex-col overflow-hidden rounded-2xl border border-white/10 bg-card/30 backdrop-blur-sm transition-all hover:border-primary/40 hover:shadow-glow hover:-translate-y-1"
                >
                  <div className="aspect-[3/4] w-full overflow-hidden bg-black/40 relative">
                    {product.image_url ? (
                      <img
                        src={product.image_url}
                        alt={product.name}
                        className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center text-muted-foreground">
                        <ShoppingBag className="h-12 w-12 opacity-20" />
                      </div>
                    )}
                    {product.price && (
                      <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full text-sm font-semibold border border-white/10 text-white">
                        ${Number(product.price).toLocaleString("es-CO")}
                      </div>
                    )}
                    {product.collection_name && (
                      <div className="absolute bottom-3 left-3 bg-primary/20 backdrop-blur-md px-2 py-0.5 rounded text-xs text-primary-foreground border border-primary/30">
                        {product.collection_name}
                      </div>
                    )}
                  </div>
                  <div className="p-5 flex-1 flex flex-col">
                    <h3 className="text-lg font-bold leading-tight">{product.name}</h3>
                    {product.reference && (
                      <p className="text-xs text-primary mt-1">REF: {product.reference}</p>
                    )}
                    <p className="mt-2 text-sm text-muted-foreground line-clamp-2 flex-1">
                      {product.description || "Cuadro sublimado premium de alta durabilidad."}
                    </p>
                    <Button
                      asChild
                      className="w-full mt-5 bg-white/5 border border-white/10 hover:bg-[var(--gradient-primary)] hover:border-transparent hover:text-white transition-all group-hover:shadow-glow"
                    >
                      <a
                        href={waLink(
                          `Hola, me interesa el cuadro "${product.name}"${product.reference ? ` (Ref: ${product.reference})` : ""}.`,
                        )}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Cotizar ahora <ArrowRight className="ml-2 h-4 w-4" />
                      </a>
                    </Button>
                  </div>
                </motion.div>
              ))
            ) : (
              <div className="col-span-full py-20 text-center flex flex-col items-center">
                <div className="h-20 w-20 rounded-full bg-white/5 flex items-center justify-center mb-4 border border-white/10">
                  <Filter className="h-8 w-8 text-muted-foreground" />
                </div>
                <h3 className="text-xl font-semibold">No se encontraron productos</h3>
                <p className="text-muted-foreground mt-2">
                  Intenta con otros términos de búsqueda o filtros.
                </p>
              </div>
            )}
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}

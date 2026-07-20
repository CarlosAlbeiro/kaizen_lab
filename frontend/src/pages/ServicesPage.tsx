import { useEffect } from "react";
import { motion } from "framer-motion";
import { MessageCircle } from "lucide-react";
import { SiteLayout } from "@/components/site/SiteLayout";
import { ServiceIcon } from "@/components/site/ServiceIcon";
import { Button } from "@/components/ui/button";
import { useServices } from "@/lib/admin-store";
import { useCatalogProducts } from "@/lib/catalog";
import { waLink } from "@/lib/site";

export default function ServicesPage() {
  const services = useServices().filter((s) => s.active);
  const products = useCatalogProducts();
  useEffect(() => {
    document.title = "Colecciones — KAIZEN LAB";
  }, []);

  return (
    <SiteLayout>
      <section className="mx-auto max-w-6xl px-4 pb-10 pt-12 sm:px-6 sm:pt-20">
        <div className="text-center">
          <span className="text-xs uppercase tracking-[0.2em] text-primary">Colecciones</span>
          <h1 className="mt-2 text-4xl font-bold sm:text-5xl">Piezas que elevan tu espacio</h1>
          <p className="mx-auto mt-3 max-w-xl text-sm text-muted-foreground">
            Explora posters metálicos, cuadros premium y formatos especiales para gaming, motos,
            anime, oficinas y setups.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-20 sm:px-6">
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {products.length > 0
            ? products.map((product, i) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 14 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-40px" }}
                  transition={{ duration: 0.4, delay: i * 0.05 }}
                  className="group relative flex flex-col overflow-hidden rounded-2xl border border-white/10 bg-card/60 p-6 backdrop-blur transition-all hover:-translate-y-1 hover:border-primary/40 hover:shadow-glow"
                >
                  <div className="mb-4 inline-grid h-12 w-12 place-items-center rounded-xl bg-[var(--gradient-primary)] shadow-glow">
                    <ServiceIcon name="Sparkles" className="h-6 w-6 text-primary-foreground" />
                  </div>
                  <h3 className="text-lg font-semibold">{product.name}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">
                    {product.description ||
                      product.notes ||
                      "Producto disponible para pedido personalizado."}
                  </p>
                  <div className="mt-3 text-sm font-semibold text-primary">
                    {product.price ? `Desde $${product.price}` : "Cotización personalizada"}
                  </div>
                  <Button
                    asChild
                    size="sm"
                    variant="outline"
                    className="mt-5 w-fit gap-2 border-white/15 bg-white/5"
                  >
                    <a
                      href={waLink(`Hola, me interesa el producto: ${product.name}.`)}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <MessageCircle className="h-4 w-4" /> Cotizar pieza
                    </a>
                  </Button>
                </motion.div>
              ))
            : services.map((s, i) => (
                <motion.div
                  key={s.id}
                  initial={{ opacity: 0, y: 14 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-40px" }}
                  transition={{ duration: 0.4, delay: i * 0.05 }}
                  className="group relative flex flex-col overflow-hidden rounded-2xl border border-white/10 bg-card/60 p-6 backdrop-blur transition-all hover:-translate-y-1 hover:border-primary/40 hover:shadow-glow"
                >
                  <div className="mb-4 inline-grid h-12 w-12 place-items-center rounded-xl bg-[var(--gradient-primary)] shadow-glow">
                    <ServiceIcon name={s.icon} className="h-6 w-6 text-primary-foreground" />
                  </div>
                  <h3 className="text-lg font-semibold">{s.title}</h3>
                  <p className="mt-2 flex-1 text-sm text-muted-foreground">{s.description}</p>
                  <Button
                    asChild
                    size="sm"
                    variant="outline"
                    className="mt-5 w-fit gap-2 border-white/15 bg-white/5"
                  >
                    <a
                      href={waLink(`Hola, me interesa el servicio: ${s.title}.`)}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <MessageCircle className="h-4 w-4" /> Cotizar pieza
                    </a>
                  </Button>
                </motion.div>
              ))}
        </div>
        {products.length === 0 && services.length === 0 && (
          <p className="mt-10 text-center text-sm text-muted-foreground">
            Próximamente tendremos nuevas colecciones disponibles.
          </p>
        )}
      </section>
    </SiteLayout>
  );
}

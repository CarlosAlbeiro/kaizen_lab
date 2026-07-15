import { useEffect, useState, type FormEvent } from "react";
import { Mail, MapPin, MessageCircle, Phone, Send } from "lucide-react";
import { toast } from "sonner";
import { SiteLayout } from "@/components/site/SiteLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { SITE, waLink } from "@/lib/site";

export default function ContactPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => { document.title = "Contacto — KAIZEN LAB"; }, []);

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !message.trim()) { toast.error("Por favor completa nombre y mensaje."); return; }
    setLoading(true);
    const text = `Hola KAIZEN LAB, soy ${name}${email ? ` (${email})` : ""}. ${message}`;
    window.open(waLink(text), "_blank");
    setTimeout(() => {
      setLoading(false);
      toast.success("Mensaje enviado por WhatsApp ✦");
      setName(""); setEmail(""); setMessage("");
    }, 400);
  };

  return (
    <SiteLayout>
      <section className="mx-auto max-w-6xl px-4 pb-10 pt-12 sm:px-6 sm:pt-20">
        <div className="text-center">
          <span className="text-xs uppercase tracking-[0.2em] text-primary">Contacto</span>
          <h1 className="mt-2 text-4xl font-bold sm:text-5xl">Hablemos de tu próximo diseño</h1>
          <p className="mx-auto mt-3 max-w-xl text-sm text-muted-foreground">
            Cuéntanos qué quieres decorar y te ayudamos a elegir el poster o cuadro ideal. {SITE.coverage}.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-24 sm:px-6">
        <div className="grid gap-6 md:grid-cols-5">
          <form onSubmit={onSubmit} className="rounded-2xl border border-white/10 bg-card/60 p-6 backdrop-blur md:col-span-3">
            <h2 className="text-lg font-semibold">Cuéntanos qué buscas</h2>
            <div className="mt-5 grid gap-4">
              <div>
                <Label htmlFor="name">Nombre</Label>
                <Input id="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Tu nombre" className="mt-1.5 bg-background/50" />
              </div>
              <div>
                <Label htmlFor="email">Correo (opcional)</Label>
                <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="tucorreo@ejemplo.com" className="mt-1.5 bg-background/50" />
              </div>
              <div>
                <Label htmlFor="msg">Mensaje</Label>
                <Textarea id="msg" value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Ej: Quiero un poster metálico para mi setup con estilo gamer…" rows={5} className="mt-1.5 bg-background/50" />
              </div>
              <Button type="submit" disabled={loading} className="gap-2 bg-[var(--gradient-primary)] text-primary-foreground shadow-glow">
                <Send className="h-4 w-4" />{loading ? "Enviando…" : "Enviar por WhatsApp"}
              </Button>
            </div>
          </form>

          <div className="space-y-4 md:col-span-2">
            <a href={waLink()} target="_blank" rel="noopener noreferrer"
              className="group block rounded-2xl border border-accent/30 bg-[var(--gradient-neon)] p-6 text-[var(--neon-foreground)] shadow-glow-neon transition-transform hover:scale-[1.01]">
              <MessageCircle className="h-7 w-7" />
              <div className="mt-3 text-sm font-medium opacity-80">WhatsApp directo</div>
              <div className="text-2xl font-bold">{SITE.whatsappDisplay}</div>
            </a>

            <div className="rounded-2xl border border-white/10 bg-card/60 p-6 backdrop-blur">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Información</h3>
              <ul className="mt-4 space-y-4 text-sm">
                <li className="flex items-start gap-3"><Phone className="mt-0.5 h-4 w-4 text-primary" />
                  <div><div className="font-medium">Teléfono</div><div className="text-muted-foreground">{SITE.whatsappDisplay}</div></div></li>
                <li className="flex items-start gap-3"><Mail className="mt-0.5 h-4 w-4 text-primary" />
                  <div><div className="font-medium">Correo</div><a href={`mailto:${SITE.email}`} className="text-muted-foreground hover:text-foreground">{SITE.email}</a></div></li>
                <li className="flex items-start gap-3"><MapPin className="mt-0.5 h-4 w-4 text-primary" />
                  <div><div className="font-medium">Cobertura</div><div className="text-muted-foreground">{SITE.coverage}</div></div></li>
              </ul>
            </div>
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}

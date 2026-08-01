import { Link } from "react-router-dom";
import { Mail, MapPin, Phone, Instagram } from "lucide-react";
import { useCatalogContact, useCatalogProfile } from "@/lib/catalog";
import { SITE } from "@/lib/site";
import profileImage from "@/assets/logo.png";

export function Footer() {
  const contact = useCatalogContact();
  const profile = useCatalogProfile();

  const phoneDisplay = contact?.phone || contact?.whatsapp || SITE.whatsappDisplay;
  const emailDisplay = contact?.email || SITE.email;
  const addressDisplay = contact?.address || SITE.city;
  const bioDisplay = profile?.bio || `${SITE.subtitle}. ${SITE.coverage}.`;

  return (
    <footer className="relative mt-24 border-t border-white/10 bg-background/60">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-12 sm:px-6 md:grid-cols-4">
        <div className="md:col-span-2">
          <Link to="/" className="flex items-center gap-2">
            <img
              src={profileImage}
              alt="KAIZEN LAB"
              className="h-16 w-16 object-contain drop-shadow-md"
            />
            <span className="text-lg font-semibold">
              KAIZEN <span className="text-primary">LAB</span>
            </span>
          </Link>
          <p className="mt-4 max-w-sm text-sm text-muted-foreground leading-relaxed">
            {bioDisplay}
          </p>
        </div>

        <div>
          <h4 className="text-sm font-semibold text-white">Navegación</h4>
          <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
            <li>
              <Link to="/" className="hover:text-foreground transition-colors">
                Inicio
              </Link>
            </li>
            <li>
              <Link to="/catalogo" className="hover:text-foreground transition-colors">
                Catálogo
              </Link>
            </li>
            <li>
              <Link to="/nosotros" className="hover:text-foreground transition-colors">
                Nosotros
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-semibold text-white">Contacto</h4>
          <ul className="mt-4 space-y-3 text-sm text-muted-foreground">
            <li className="flex items-start gap-2">
              <Phone className="mt-0.5 h-4 w-4 text-primary shrink-0" />
              <span>{phoneDisplay}</span>
            </li>
            <li className="flex items-start gap-2">
              <Mail className="mt-0.5 h-4 w-4 text-primary shrink-0" />
              <a href={`mailto:${emailDisplay}`} className="hover:text-foreground truncate">
                {emailDisplay}
              </a>
            </li>
            <li className="flex items-start gap-2">
              <MapPin className="mt-0.5 h-4 w-4 text-primary shrink-0" />
              <span>{addressDisplay}</span>
            </li>

            {contact?.instagram_url && (
              <li className="flex items-center gap-2 pt-1">
                <Instagram className="h-4 w-4 text-primary" />
                <a href={contact.instagram_url} target="_blank" rel="noopener noreferrer" className="hover:text-white">
                  Instagram
                </a>
              </li>
            )}
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-2 px-4 py-5 text-xs text-muted-foreground sm:flex-row sm:px-6">
          <p>
            © {new Date().getFullYear()} KAIZEN LAB<Link to="/admin/login">.</Link> Todos los derechos reservados.
          </p>
          <p>
            <Link to="/legal" className="hover:text-white underline mr-3">Términos y Privacidad</Link>
            Decoración premium en {addressDisplay}.
          </p>
        </div>
      </div>
    </footer>
  );
}

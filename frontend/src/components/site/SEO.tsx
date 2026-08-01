import { useEffect } from "react";

type SEOProps = {
  title?: string;
  description?: string;
  keywords?: string;
  canonical?: string;
};

export function SEO({
  title = "Cuadros de Aluminio en Armenia Quindío | KAIZEN LAB",
  description = "Empresa dedicada a crear cuadros de aluminio de alta calidad y posters metálicos sublimados en HD en Armenia, Quindío. Envíos garantizados a todo Colombia.",
  keywords = "cuadros de aluminio armenia, posters metalicos quindio, arte metalico armenia, cuadros sublimados colombia, kaizen lab",
  canonical = "https://kaizenlab.co/",
}: SEOProps) {
  useEffect(() => {
    // 1. Título de la página
    document.title = title;

    // 2. Meta description
    let metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute("content", description);
    } else {
      metaDesc = document.createElement("meta");
      metaDesc.setAttribute("name", "description");
      metaDesc.setAttribute("content", description);
      document.head.appendChild(metaDesc);
    }

    // 3. Meta keywords
    let metaKw = document.querySelector('meta[name="keywords"]');
    if (metaKw) {
      metaKw.setAttribute("content", keywords);
    } else {
      metaKw = document.createElement("meta");
      metaKw.setAttribute("name", "keywords");
      metaKw.setAttribute("content", keywords);
      document.head.appendChild(metaKw);
    }

    // 4. Open Graph Title & Description
    const ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle) ogTitle.setAttribute("content", title);

    const ogDesc = document.querySelector('meta[property="og:description"]');
    if (ogDesc) ogDesc.setAttribute("content", description);

    // 5. Canonical link
    let canonicalLink = document.querySelector('link[rel="canonical"]');
    if (canonicalLink) {
      canonicalLink.setAttribute("href", canonical);
    }
  }, [title, description, keywords, canonical]);

  return null;
}

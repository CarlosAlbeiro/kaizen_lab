export const SITE = {
  name: "KAIZEN LAB",
  tagline: "Pósters metálicos y cuadros premium para transformar espacios",
  subtitle: "Diseños exclusivos en aluminio, montaje limpio y decoración con personalidad",
  whatsappNumber: "573207282185",
  whatsappDisplay: "+57 320 728 2185",
  email: "contacto@kaizenlab.com",
  city: "Bogotá, Colombia",
  coverage: "Envíos y pedidos personalizados a nivel nacional",
} as const;

export const waLink = (
  message = "Hola KAIZEN LAB, me interesa un poster metálico o cuadro personalizado.",
) => `https://wa.me/${SITE.whatsappNumber}?text=${encodeURIComponent(message)}`;

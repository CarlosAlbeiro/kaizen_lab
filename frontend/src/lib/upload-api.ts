const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3055/api";

export async function uploadImageFile(file: File): Promise<string> {
  const formData = new FormData();
  formData.append("image", file);

  const token = typeof window !== "undefined" ? localStorage.getItem("cab_admin_jwt_token_v1") : null;
  const headers: Record<string, string> = {};
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const res = await fetch(`${API_URL}/upload`, {
    method: "POST",
    headers,
    body: formData,
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || err.message || "Error al subir la imagen");
  }

  const data = await res.json();
  let url = data.url as string;

  if (url.startsWith("/")) {
    const origin = new URL(API_URL).origin;
    url = `${origin}${url}`;
  }

  return url;
}

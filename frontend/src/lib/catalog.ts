import { useEffect, useState } from "react";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3001/api";

export type ProfileData = {
  id?: string;
  name?: string;
  fullname?: string;
  bio?: string;
  image_url?: string;
  site_icon_url?: string;
  stats_years?: string;
  stats_clients?: string;
  stats_products?: string;
  stats_awards?: string;
  wa_msg_advice?: string;
  wa_msg_product?: string;
};

export type ContactData = {
  phone?: string;
  email?: string;
  address?: string;
  whatsapp?: string;
  instagram_url?: string;
  instagram_active?: boolean;
  tiktok_url?: string;
  tiktok_active?: boolean;
  facebook_url?: string;
  facebook_active?: boolean;
  youtube_url?: string;
  youtube_active?: boolean;
};

export type CollectionData = {
  id: string;
  name: string;
  description?: string;
  image_url?: string;
  category_name?: string;
};

export type ProductData = {
  id: string;
  name: string;
  description?: string;
  price?: string | number | null;
  image_url?: string;
  reference?: string;
  notes?: string;
  collection_name?: string;
  brand_name?: string;
};

export type BrandData = {
  id: string;
  name: string;
  description?: string;
  logo_url?: string;
};

async function fetchJson<T>(path: string): Promise<T | null> {
  try {
    const res = await fetch(`${API_URL}/catalog${path}`);
    if (!res.ok) return null;
    return (await res.json()) as T;
  } catch {
    return null;
  }
}

export async function getCatalogProfile(): Promise<ProfileData | null> {
  return fetchJson<ProfileData>("/profile");
}

export async function getCatalogContact(): Promise<ContactData | null> {
  return fetchJson<ContactData>("/contact");
}

export async function getCatalogCollections(): Promise<CollectionData[]> {
  const data = await fetchJson<CollectionData[]>("/collections");
  return data ?? [];
}

export async function getCatalogProducts(): Promise<ProductData[]> {
  const data = await fetchJson<ProductData[]>("/products");
  return data ?? [];
}

export async function getCatalogBrands(): Promise<BrandData[]> {
  const data = await fetchJson<BrandData[]>("/brands");
  return data ?? [];
}

export function useCatalogProfile(refreshTrigger = 0) {
  const [profile, setProfile] = useState<ProfileData | null>(null);
  useEffect(() => {
    let active = true;
    getCatalogProfile().then((data) => {
      if (active) setProfile(data);
    });
    return () => {
      active = false;
    };
  }, [refreshTrigger]);
  return profile;
}

export function useCatalogContact(refreshTrigger = 0) {
  const [contact, setContact] = useState<ContactData | null>(null);
  useEffect(() => {
    let active = true;
    getCatalogContact().then((data) => {
      if (active) setContact(data);
    });
    return () => {
      active = false;
    };
  }, [refreshTrigger]);
  return contact;
}

export function useCatalogCollections(refreshTrigger = 0) {
  const [collections, setCollections] = useState<CollectionData[]>([]);
  useEffect(() => {
    let active = true;
    getCatalogCollections().then((data) => {
      if (active) setCollections(data);
    });
    return () => {
      active = false;
    };
  }, [refreshTrigger]);
  return collections;
}

export function useCatalogProducts(refreshTrigger = 0) {
  const [products, setProducts] = useState<ProductData[]>([]);
  useEffect(() => {
    let active = true;
    getCatalogProducts().then((data) => {
      if (active) setProducts(data);
    });
    return () => {
      active = false;
    };
  }, [refreshTrigger]);
  return products;
}

export function useCatalogBrands(refreshTrigger = 0) {
  const [brands, setBrands] = useState<BrandData[]>([]);
  useEffect(() => {
    let active = true;
    getCatalogBrands().then((data) => {
      if (active) setBrands(data);
    });
    return () => {
      active = false;
    };
  }, [refreshTrigger]);
  return brands;
}

// Mutations
async function mutateJson<T>(path: string, method: string, body?: any): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, {
    method,
    headers: { "Content-Type": "application/json" },
    body: body ? JSON.stringify(body) : undefined,
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || err.message || `Error en petición ${method} ${path}`);
  }
  return res.json();
}

export async function createProduct(data: Partial<ProductData>) {
  return mutateJson("/products", "POST", data);
}
export async function updateProduct(id: string, data: Partial<ProductData>) {
  return mutateJson(`/products/${id}`, "PUT", data);
}
export async function deleteProduct(id: string) {
  return mutateJson(`/products/${id}`, "DELETE");
}

export async function createBrand(data: Partial<BrandData>) {
  return mutateJson("/brands", "POST", data);
}
export async function updateBrand(id: string, data: Partial<BrandData>) {
  return mutateJson(`/brands/${id}`, "PUT", data);
}
export async function deleteBrand(id: string) {
  return mutateJson(`/brands/${id}`, "DELETE");
}

export async function createCollection(data: Partial<CollectionData>) {
  return mutateJson("/collections", "POST", data);
}
export async function updateCollection(id: string, data: Partial<CollectionData>) {
  return mutateJson(`/collections/${id}`, "PUT", data);
}
export async function deleteCollection(id: string) {
  return mutateJson(`/collections/${id}`, "DELETE");
}

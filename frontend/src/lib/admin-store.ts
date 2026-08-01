/**
 * Admin store integrated with Backend API and automatic JWT expiration handling.
 */
import { useEffect, useState, useSyncExternalStore } from "react";

const AUTH_KEY = "cab_admin_auth_v1";
const TOKEN_KEY = "cab_admin_jwt_token_v1";
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3001/api";

export type ServiceItem = {
  id: string;
  icon: string;
  title: string;
  description: string;
  active: boolean;
};

let services: ServiceItem[] = [];
let isInitialLoaded = false;

type Listener = () => void;
const listeners = new Set<Listener>();
const emit = () => listeners.forEach((l) => l());

const isBrowser = () => typeof window !== "undefined";

/**
 * Valida si un token JWT ha expirado leyendo la propiedad 'exp' de su payload.
 */
export function isJwtExpired(token: string): boolean {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return true;
    const payload = JSON.parse(atob(parts[1]));
    if (payload.exp && typeof payload.exp === "number") {
      // Comparar tiempo actual con la fecha de expiración exp (en ms)
      return Date.now() >= payload.exp * 1000;
    }
    return false;
  } catch {
    return true;
  }
}

export function getToken(): string | null {
  if (!isBrowser()) return null;
  const token = window.localStorage.getItem(TOKEN_KEY);
  if (!token) return null;
  if (isJwtExpired(token)) {
    logout();
    return null;
  }
  return token;
}

export function isAuthed(): boolean {
  if (!isBrowser()) return false;
  const token = window.localStorage.getItem(TOKEN_KEY);
  if (!token) {
    // Si no hay token, verificar si había un flag viejo y limpiarlo
    window.localStorage.removeItem(AUTH_KEY);
    return false;
  }
  if (isJwtExpired(token)) {
    logout();
    return false;
  }
  return true;
}

export async function login(username: string, password: string): Promise<boolean> {
  try {
    const res = await fetch(`${API_URL}/users/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });

    if (res.ok) {
      const data = await res.json();
      if (data.token) {
        window.localStorage.setItem(TOKEN_KEY, data.token);
      }
      window.localStorage.setItem(AUTH_KEY, "1");
      emit();
      return true;
    }
  } catch (error) {
    console.error("Login error:", error);
  }
  return false;
}

export function logout() {
  if (!isBrowser()) return;
  window.localStorage.removeItem(AUTH_KEY);
  window.localStorage.removeItem(TOKEN_KEY);
  emit();
}

export function useAuth() {
  const [authed, setAuthed] = useState(isAuthed());
  useEffect(() => {
    const l = () => setAuthed(isAuthed());
    listeners.add(l);
    return () => {
      listeners.delete(l);
    };
  }, []);
  return authed;
}

// ---------- services API ----------

async function fetchServices() {
  try {
    const res = await fetch(`${API_URL}/services`);
    if (res.ok) {
      const data = await res.json();
      services = (Array.isArray(data) ? data : []).map((s: any) => ({ ...s, id: String(s.id) }));
      isInitialLoaded = true;
      emit();
    }
  } catch (error) {
    console.error("Fetch services error:", error);
  }
}

export function getServices(): ServiceItem[] {
  if (!isInitialLoaded && isBrowser()) {
    fetchServices();
  }
  return services;
}

export async function createService(s: Omit<ServiceItem, "id">) {
  const res = await fetch(`${API_URL}/services`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(s),
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || "Failed to create service");
  }
  await fetchServices();
}

export async function updateService(id: string, patch: Partial<ServiceItem>) {
  const res = await fetch(`${API_URL}/services/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(patch),
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || "Failed to update service");
  }
  await fetchServices();
}

export async function deleteService(id: string) {
  const res = await fetch(`${API_URL}/services/${id}`, {
    method: "DELETE",
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || "Failed to delete service");
  }
  await fetchServices();
}

export async function resetServices() {
  await fetchServices();
}

export function useServices(): ServiceItem[] {
  const subscribe = (cb: () => void) => {
    listeners.add(cb);
    return () => {
      listeners.delete(cb);
    };
  };

  const get = () => {
    if (!isInitialLoaded && isBrowser()) {
      fetchServices();
    }
    return services;
  };

  return useSyncExternalStore(subscribe, get, () => []);
}

if (isBrowser()) {
  fetchServices();
}

/**
 * Admin store integrated with Backend API.
 */
import { useEffect, useState, useSyncExternalStore } from "react";

const AUTH_KEY = "cab_admin_auth_v1";
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3001/api";

export type ServiceItem = {
  id: string;
  icon: string; // lucide icon name
  title: string;
  description: string;
  active: boolean;
};

// ---------- state ----------
let services: ServiceItem[] = [];
let isInitialLoaded = false;

// ---------- listeners ----------
type Listener = () => void;
const listeners = new Set<Listener>();
const emit = () => listeners.forEach((l) => l());

const isBrowser = () => typeof window !== "undefined";

// ---------- auth ----------
export function isAuthed(): boolean {
  if (!isBrowser()) return false;
  return window.localStorage.getItem(AUTH_KEY) === "1";
}

export async function login(username: string, password: string): Promise<boolean> {
  try {
    const res = await fetch(`${API_URL}/users/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });

    if (res.ok) {
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
  window.localStorage.removeItem(AUTH_KEY);
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
      // Ensure IDs are strings for frontend consistency if needed,
      // but backend returns numbers now.
      services = data.map((s: any) => ({ ...s, id: String(s.id) }));
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
  // En una app real, esto podría borrar todo y re-insertar defaults.
  // Por ahora lo ignoramos o relanzamos fetch.
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

// Initial fetch if in browser
if (isBrowser()) {
  fetchServices();
}

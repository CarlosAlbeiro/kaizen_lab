import { useState, useEffect } from "react";
import { logout, getToken } from "./admin-store";
import { toast } from "sonner";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3001/api";

async function mutateJson<T>(path: string, method: string, body?: any): Promise<T> {
  const token = getToken();
  const headers: Record<string, string> = { "Content-Type": "application/json" };
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const res = await fetch(`${API_URL}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  if (res.status === 401 || res.status === 403) {
    logout();
    toast.error("Tu sesión ha expirado o no tienes permisos", {
      description: "Por favor inicia sesión nuevamente.",
    });
    if (typeof window !== "undefined") {
      window.location.href = "/admin/login";
    }
    throw new Error("Sesión expirada o no autorizada");
  }

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || err.message || `Error en petición ${method} ${path}`);
  }
  return res.json();
}

/**
 * Hook universal de consulta API con sincronización automática en tiempo real (Polling inteligente cada 5 segundos)
 */
function useApi<T>(path: string, refreshTrigger: number, pollIntervalMs = 5000): T[] {
  const [data, setData] = useState<T[]>([]);

  useEffect(() => {
    let active = true;

    const loadData = () => {
      const token = getToken();
      const headers: Record<string, string> = {};
      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }

      fetch(`${API_URL}${path}`, { headers })
        .then((res) => {
          if (res.status === 401 || res.status === 403) {
            logout();
            if (typeof window !== "undefined" && window.location.pathname.startsWith("/admin")) {
              window.location.href = "/admin/login";
            }
            return [];
          }
          if (!res.ok) return [];
          return res.json();
        })
        .then((json) => {
          if (active) {
            const next = Array.isArray(json) ? json : [];
            setData((prev) => {
              if (JSON.stringify(prev) === JSON.stringify(next)) {
                return prev;
              }
              return next;
            });
          }
        })
        .catch((err) => {
          console.error(err);
          if (active) setData([]);
        });
    };

    loadData();

    let timer: any = null;
    if (pollIntervalMs > 0) {
      timer = setInterval(loadData, pollIntervalMs);
    }

    return () => {
      active = false;
      if (timer) clearInterval(timer);
    };
  }, [path, refreshTrigger, pollIntervalMs]);

  return Array.isArray(data) ? data : [];
}

// Users
export function useUsers(refresh = 0) { return useApi<any>("/users", refresh); }
export const createUser = (data: any) => mutateJson("/users", "POST", data);
export const updateUser = (id: string, data: any) => mutateJson(`/users/${id}`, "PUT", data);
export const deleteUser = (id: string) => mutateJson(`/users/${id}`, "DELETE");

// Categories
export function useCategories(refresh = 0) { return useApi<any>("/categories", refresh); }
export const createCategory = (data: any) => mutateJson("/categories", "POST", data);
export const updateCategory = (id: string, data: any) => mutateJson(`/categories/${id}`, "PUT", data);
export const deleteCategory = (id: string) => mutateJson(`/categories/${id}`, "DELETE");

// Site Sections
export function useSections(refresh = 0) { return useApi<any>("/site-sections", refresh); }
export const createSection = (data: any) => mutateJson("/site-sections", "POST", data);
export const updateSection = (id: string, data: any) => mutateJson(`/site-sections/${id}`, "PUT", data);
export const deleteSection = (id: string) => mutateJson(`/site-sections/${id}`, "DELETE");

// Service Requests
export function useServiceRequests(refresh = 0) { return useApi<any>("/service-requests", refresh, 4000); }
export const createServiceRequest = (data: any) => mutateJson("/service-requests", "POST", data);
export const updateServiceRequest = (id: string, data: any) => mutateJson(`/service-requests/${id}`, "PUT", data);
export const deleteServiceRequest = (id: string) => mutateJson(`/service-requests/${id}`, "DELETE");
export const processPendingServiceRequests = () => mutateJson<any>("/service-requests/process-pending", "POST");

// Clients
export function useClients(refresh = 0) { return useApi<any>("/clients", refresh); }
export const createClient = (data: any) => mutateJson("/clients", "POST", data);
export const updateClient = (id: string, data: any) => mutateJson(`/clients/${id}`, "PUT", data);
export const deleteClient = (id: string) => mutateJson(`/clients/${id}`, "DELETE");

// Profile & Contact Info (Singleton updates)
export const updateProfile = (data: any) => mutateJson(`/profile`, "PUT", data);
export const updateContactInfo = (data: any) => mutateJson(`/contact-info`, "PUT", data);

// WhatsApp Status
export function useWhatsAppStatus(pollMs = 5000) {
  const [status, setStatus] = useState<any>({ ready: false, status: "disconnected" });
  useEffect(() => {
    let active = true;
    const fetchStatus = () => {
      fetch(`${API_URL}/whatsapp/status`)
        .then((res) => (res.ok ? res.json() : { ready: false, status: "disconnected" }))
        .then((data) => {
          if (active) setStatus(data);
        })
        .catch(() => {
          if (active) setStatus({ ready: false, status: "disconnected" });
        });
    };
    fetchStatus();
    const interval = setInterval(fetchStatus, pollMs);
    return () => {
      active = false;
      clearInterval(interval);
    };
  }, [pollMs]);
  return status;
}

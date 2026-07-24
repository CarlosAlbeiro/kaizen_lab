import { useState, useEffect } from "react";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3001/api";

async function mutateJson<T>(path: string, method: string, body?: any): Promise<T> {
  const token = typeof window !== "undefined" ? localStorage.getItem("cab_admin_jwt_token_v1") : null;
  const headers: Record<string, string> = { "Content-Type": "application/json" };
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const res = await fetch(`${API_URL}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || err.message || `Error en petición ${method} ${path}`);
  }
  return res.json();
}

function useApi<T>(path: string, refreshTrigger: number): T[] {
  const [data, setData] = useState<T[]>([]);
  useEffect(() => {
    let active = true;
    fetch(`${API_URL}${path}`)
      .then(res => res.json())
      .then(json => {
        if (active) setData(json);
      })
      .catch(console.error);
    return () => { active = false; };
  }, [path, refreshTrigger]);
  return data;
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
export function useServiceRequests(refresh = 0) { return useApi<any>("/service-requests", refresh); }
export const createServiceRequest = (data: any) => mutateJson("/service-requests", "POST", data);
export const updateServiceRequest = (id: string, data: any) => mutateJson(`/service-requests/${id}`, "PUT", data);
export const deleteServiceRequest = (id: string) => mutateJson(`/service-requests/${id}`, "DELETE");

// Clients
export function useClients(refresh = 0) { return useApi<any>("/clients", refresh); }
export const createClient = (data: any) => mutateJson("/clients", "POST", data);
export const updateClient = (id: string, data: any) => mutateJson(`/clients/${id}`, "PUT", data);
export const deleteClient = (id: string) => mutateJson(`/clients/${id}`, "DELETE");

// Profile & Contact Info (Singleton updates)
export const updateProfile = (data: any) => mutateJson(`/profile`, "PUT", data);
export const updateContactInfo = (data: any) => mutateJson(`/contact-info`, "PUT", data);


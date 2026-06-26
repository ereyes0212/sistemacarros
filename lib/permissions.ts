import { redirect } from "next/navigation";

import { getSession, requireSession } from "@/auth";

export const PERMISSIONS = {
  dashboardView: "ver_dashboard",
  carsView: "ver_carros",
  carsCreate: "crear_carros",
  carsEdit: "editar_carros",
  carsDelete: "eliminar_carros",
  carsModerate: "moderar_carros",
  leadsView: "ver_leads",
  leadsEdit: "editar_leads",
  rolesView: "ver_roles",
  rolesCreate: "crear_roles",
  rolesEdit: "editar_roles",
  rolesDelete: "eliminar_roles",
  usersView: "ver_usuarios",
  usersCreate: "crear_usuarios",
  usersEdit: "editar_usuarios",
  usersDelete: "eliminar_usuarios",
  wishlistView: "ver_favoritos",
  wishlistCreate: "crear_favoritos",
  ordersView: "ver_ordenes",
  ordersCreate: "crear_ordenes",
} as const;

export type PermissionName = (typeof PERMISSIONS)[keyof typeof PERMISSIONS];

export async function requirePermission(permission: PermissionName) {
  const session = await requireSession();
  if (!session.Permiso.includes(permission)) redirect("/dashboard?error=sin-permiso");
  return session;
}

export async function hasPermission(permission: PermissionName) {
  const session = await getSession();
  return Boolean(session?.Permiso.includes(permission));
}

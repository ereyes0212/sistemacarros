import { getSession } from "@/auth";
import { NavUser } from "@/components/nav-user";
import { ModeToggle } from "@/components/buton-theme";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";
import { BarChart3, Car, LayersIcon, MessageSquare, ShieldCheck, UserIcon, type LucideIcon } from "lucide-react";

type SidebarModule = {
  title: string;
  url: string;
  icon: LucideIcon;
  permiso?: string;
  permisos?: string[];
};

const modules: SidebarModule[] = [
  { title: "Dashboard", url: "/dashboard", icon: BarChart3, permisos: ["ver_dashboard", "ver_vehiculos_admin"] },
  { title: "Vehículos", url: "/productos-admin", icon: Car, permisos: ["ver_productos_admin", "ver_vehiculos_admin"] },
  { title: "Categorías", url: "/categorias", icon: LayersIcon, permisos: ["ver_categorias_admin", "ver_vehiculos_admin"] },
  { title: "Leads", url: "/reportes", icon: MessageSquare, permisos: ["ver_reportes", "ver_vehiculos_admin"] },
  { title: "Comentarios", url: "/comentarios", icon: ShieldCheck, permisos: ["ver_comentarios", "ver_vehiculos_admin"] },
  { title: "Usuarios", url: "/usuarios", icon: UserIcon, permiso: "ver_usuarios" },
  { title: "Roles", url: "/roles", icon: LayersIcon, permiso: "ver_roles" },
];

export async function AppSidebar() {
  const usuario = await getSession();
  const permisosUsuario = usuario?.Permiso || [];

  const filteredModules = modules.filter((item) => item.permisos?.some((permiso) => permisosUsuario.includes(permiso)) ?? (item.permiso ? permisosUsuario.includes(item.permiso) : false));

  return (
    <Sidebar collapsible="icon" variant="floating">
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="mb-2 flex items-center justify-between text-sidebar-foreground">
            <span className="font-semibold tracking-tight">Panel CRM</span>
            <ModeToggle />
          </SidebarGroupLabel>

          <SidebarGroupContent>
            <SidebarMenu>
              {filteredModules.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton href={item.url}>
                    <item.icon size={16} />
                    <span>{item.title}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>{usuario && <NavUser usuario={usuario} />}</SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}

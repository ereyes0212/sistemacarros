import { getSession } from "@/auth";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
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
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarRail,
} from "@/components/ui/sidebar";
import {
  Car, ChevronDown, ChevronUp, Heart, LayersIcon, Settings, ShieldCheck, ShoppingBag, UserIcon,
} from "lucide-react";
import Link from "next/link";
import { NavUser } from "./nav-user";
import { ModeToggle } from "./buton-theme";

const mantenimientoItems = [
  { title: "Roles", url: "/roles", icon: LayersIcon, permiso: "ver_roles" },
  { title: "Permisos", url: "/permisos", icon: LayersIcon, permiso: "ver_permisos" },
  { title: "Usuarios", url: "/usuarios", icon: UserIcon, permiso: "ver_usuarios" },
];

const items = [
  { title: "Dashboard", url: "/dashboard", icon: LayersIcon, permiso: "ver_dashboard" },
  { title: "Mi Perfil", url: "/mi-perfil", icon: UserIcon },
];


const marketplaceItems = [
  { title: "Comprar carros", url: "/productos", icon: ShoppingBag, permiso: "ver_carros" },
  { title: "Mis favoritos", url: "/favoritos", icon: Heart, permiso: "ver_favoritos" },
];

const sellerItems = [
  { title: "Mis vehículos", url: "/mis-vehiculos", icon: Car, permiso: "crear_carros" },
  { title: "Publicar vehículo", url: "/mis-vehiculos/create", icon: Car, permiso: "crear_carros" },
];

const ecommerceAdminItems = [
  { title: "Revisión de vehículos", url: "/productos-admin", permiso: "moderar_carros" },
  { title: "Reportes", url: "/reportes", permiso: "ver_reportes_admin" },
  { title: "Comentarios", url: "/comentarios", permiso: "ver_comentarios" },
  { title: "Usuarios", url: "/usuarios", permiso: "ver_usuarios" },
];

export async function AppSidebar() {
  const usuario = await getSession();
  const permisosUsuario = usuario?.Permiso || [];


  const filteredItems = items.filter((item) => {
    if (item.permiso && !permisosUsuario.includes(item.permiso)) return false;
    return true;
  });
  const filteredMantenimientoItems = mantenimientoItems.filter((item) => permisosUsuario.includes(item.permiso));
  const showMantenimiento = filteredMantenimientoItems.length > 0;
  const filteredEcommerceAdminItems = ecommerceAdminItems.filter((item) => permisosUsuario.includes(item.permiso));
  const filteredMarketplaceItems = marketplaceItems.filter((item) => permisosUsuario.includes(item.permiso));
  const filteredSellerItems = sellerItems.filter((item) => permisosUsuario.includes(item.permiso));
  const showEcommerceAdmin = filteredEcommerceAdminItems.length > 0;

  return (
    <Sidebar collapsible="icon" variant="floating">
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="flex justify-between items-center">
            <ModeToggle></ModeToggle>
          </SidebarGroupLabel>

          <SidebarGroupContent>


            <SidebarMenu>
              {filteredItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <Link href={item.url}>
                      <item.icon size={16} className="p-0" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}


              {filteredMarketplaceItems.map((item) => (
                <SidebarMenuItem key={item.url}>
                  <SidebarMenuButton asChild>
                    <Link href={item.url}><item.icon size={16} className="p-0" /><span>{item.title}</span></Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}

              {filteredSellerItems.map((item) => (
                <SidebarMenuItem key={item.url}>
                  <SidebarMenuButton asChild>
                    <Link href={item.url}><item.icon size={16} className="p-0" /><span>{item.title}</span></Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}

              {showEcommerceAdmin && (
                <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                    <Link href="/dashboard">
                      <ShieldCheck size={16} className="p-0" />
                      <span>Moderación</span>
                    </Link>
                  </SidebarMenuButton>
                  <SidebarMenuSub>
                    {filteredEcommerceAdminItems.map((item) => (
                      <SidebarMenuSubItem key={item.url}>
                        <SidebarMenuSubButton asChild>
                          <Link href={item.url}>{item.title}</Link>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                    ))}
                  </SidebarMenuSub>
                </SidebarMenuItem>
              )}


              {showMantenimiento && (
                <Collapsible className="group/collapsible">
                  <SidebarMenuItem>
                    <CollapsibleTrigger asChild>
                      <SidebarMenuButton>
                        <Settings size={16} className="p-0" />
                        <span>Mantenimiento</span>
                        <ChevronDown className="ml-auto group-data-[state=open]/collapsible:hidden" />
                        <ChevronUp className="ml-auto group-data-[state=closed]/collapsible:hidden" />
                      </SidebarMenuButton>
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                      <SidebarMenuSub>
                        {filteredMantenimientoItems.map((item) => (
                          <SidebarMenuSubItem key={item.title}>
                            <SidebarMenuSubButton asChild>
                              <Link href={item.url}>{item.title}</Link>
                            </SidebarMenuSubButton>
                          </SidebarMenuSubItem>
                        ))}
                      </SidebarMenuSub>
                    </CollapsibleContent>
                  </SidebarMenuItem>
                </Collapsible>
              )}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>{usuario && <NavUser usuario={usuario} />}</SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}

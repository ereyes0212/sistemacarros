import bcrypt from "bcryptjs";
import { randomUUID } from "crypto";
import { PrismaClient } from "../lib/generated/prisma/index.js";

const prisma = new PrismaClient();

const permissions = [
  ["ver_dashboard", "Acceder al panel principal"],
  ["ver_carros", "Ver vehículos e inventario"],
  ["crear_carros", "Crear publicaciones de vehículos"],
  ["editar_carros", "Editar publicaciones de vehículos"],
  ["eliminar_carros", "Eliminar publicaciones de vehículos"],
  ["moderar_carros", "Aprobar o rechazar publicaciones"],
  ["ver_leads", "Ver leads comerciales"],
  ["editar_leads", "Gestionar estado de leads"],
  ["ver_roles", "Ver roles"],
  ["crear_roles", "Crear roles"],
  ["editar_roles", "Editar roles"],
  ["eliminar_roles", "Eliminar roles"],
  ["ver_usuarios", "Ver usuarios"],
  ["crear_usuarios", "Crear usuarios"],
  ["editar_usuarios", "Editar usuarios"],
  ["eliminar_usuarios", "Eliminar usuarios"],
  ["ver_mi_perfil", "Ver mi perfil"],
  ["ver_favoritos", "Ver favoritos"],
  ["crear_favoritos", "Agregar o quitar favoritos"],
  ["ver_ordenes", "Ver órdenes o solicitudes de compra"],
  ["ver_permisos", "Ver permisos"],
  ["crear_permisos", "Crear permisos"],
  ["editar_permisos", "Editar permisos"],
  ["eliminar_permisos", "Eliminar permisos"],
  ["ver_reportes_admin", "Ver reportes administrativos"],
  ["ver_comentarios", "Ver comentarios"],
  ["crear_ordenes", "Crear solicitudes de compra"],
];

const rolePermissions = {
  Administrador: permissions.map(([name]) => name),
  Vendedor: ["ver_dashboard", "ver_mi_perfil", "ver_carros", "crear_carros", "editar_carros", "eliminar_carros", "ver_leads", "editar_leads"],
  Comprador: ["ver_dashboard", "ver_mi_perfil", "ver_carros", "ver_favoritos", "crear_favoritos", "crear_ordenes"],
  Moderador: ["ver_dashboard", "ver_mi_perfil", "ver_carros", "moderar_carros", "ver_leads", "ver_comentarios"],
};

async function main() {
  for (const [nombre, descripcion] of permissions) {
    await prisma.permiso.upsert({ where: { nombre }, update: { descripcion, activo: true }, create: { nombre, descripcion } });
  }

  for (const [nombre, permisos] of Object.entries(rolePermissions)) {
    const rol = await prisma.rol.upsert({
      where: { nombre },
      update: { descripcion: `Rol ${nombre} del marketplace`, activo: true },
      create: { nombre, descripcion: `Rol ${nombre} del marketplace` },
    });

    for (const permisoNombre of permisos) {
      const permiso = await prisma.permiso.findUniqueOrThrow({ where: { nombre: permisoNombre } });
      await prisma.rolPermiso.upsert({
        where: { rolId_permisoId: { rolId: rol.id, permisoId: permiso.id } },
        update: {},
        create: { rolId: rol.id, permisoId: permiso.id },
      });
    }
  }

  const adminRole = await prisma.rol.findUniqueOrThrow({ where: { nombre: "Administrador" } });
  const adminEmail = process.env.SEED_ADMIN_EMAIL ?? "admin@motormarket.local";
  const adminPassword = process.env.SEED_ADMIN_PASSWORD ?? "Admin12345!";

  await prisma.usuario.upsert({
    where: { email: adminEmail },
    update: { rol_id: adminRole.id, activo: true, DebeCambiarPassword: false },
    create: {
      id: randomUUID(),
      usuario: "admin",
      email: adminEmail,
      contrasena: await bcrypt.hash(adminPassword, 12),
      nombre: "Administrador MotorMarket",
      rol_id: adminRole.id,
      activo: true,
      DebeCambiarPassword: false,
    },
  });

  const brands = [
    { name: "Toyota", slug: "toyota", models: ["RAV4", "Corolla", "Camry"] },
    { name: "Ford", slug: "ford", models: ["F-150", "Explorer", "Mustang"] },
    { name: "Tesla", slug: "tesla", models: ["Model 3", "Model Y"] },
  ];

  for (const brandSeed of brands) {
    const brand = await prisma.vehicleBrand.upsert({ where: { slug: brandSeed.slug }, update: { name: brandSeed.name }, create: { name: brandSeed.name, slug: brandSeed.slug } });
    for (const modelName of brandSeed.models) {
      const slug = modelName.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
      await prisma.vehicleModel.upsert({ where: { brandId_slug: { brandId: brand.id, slug } }, update: { name: modelName }, create: { brandId: brand.id, name: modelName, slug } });
    }
  }

  for (const category of ["SUV", "Sedán", "Pickup", "Eléctrico", "Híbrido"]) {
    const slug = category.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-");
    await prisma.vehicleCategory.upsert({ where: { slug }, update: { name: category }, create: { name: category, slug } });
  }

  console.log(`Seed completado. Admin: ${adminEmail} / ${adminPassword}`);
}

main().finally(async () => prisma.$disconnect());

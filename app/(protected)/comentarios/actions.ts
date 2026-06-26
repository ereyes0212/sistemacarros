"use server";
import { CommentStatus } from "@/lib/generated/prisma";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function getAdminVehicleComments(status?: CommentStatus) {
  return prisma.vehicleComment.findMany({ where: status ? { status } : undefined, include: { vehicle: true, user: { select: { nombre: true, usuario: true } } }, orderBy: { createdAt: "desc" }, take: 100 });
}
export async function moderateVehicleComment(commentId: string, status: CommentStatus.APPROVED | CommentStatus.REJECTED) {
  const comment = await prisma.vehicleComment.update({ where: { id: commentId }, data: { status, reviewedAt: new Date() }, include: { vehicle: true } });
  revalidatePath("/comentarios");
  revalidatePath(`/productos/${comment.vehicle.slug}`);
}

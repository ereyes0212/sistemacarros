"use server";

import { revalidatePath } from "next/cache";

import { getSession } from "@/auth";
import { prisma } from "@/lib/prisma";
import { optionalString, requireString } from "@/lib/schemas";

export async function createLeadAction(_prevState: { error?: string; success?: string }, formData: FormData) {
  try {
    const session = await getSession();
    await prisma.vehicleLead.create({
      data: {
        vehicleId: requireString(formData.get("vehicleId"), "vehículo"),
        buyerId: session?.IdUser,
        name: requireString(formData.get("name"), "nombre"),
        email: requireString(formData.get("email"), "email"),
        phone: optionalString(formData.get("phone")),
        message: optionalString(formData.get("message")),
        type: requireString(formData.get("type"), "tipo") as never,
      },
    });
    revalidatePath("/leads");
    return { success: "Solicitud enviada. Un asesor te contactará." };
  } catch (error) {
    return { error: error instanceof Error ? error.message : "No se pudo enviar el lead." };
  }
}

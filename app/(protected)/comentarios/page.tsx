import { CommentStatus } from "@/lib/generated/prisma";
import HeaderComponent from "@/components/HeaderComponent";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { MessageSquare } from "lucide-react";
import { getAdminVehicleComments, moderateVehicleComment } from "./actions";

export default async function ComentariosPage({ searchParams }: { searchParams: { status?: string } }) {
  const status = Object.values(CommentStatus).includes(searchParams.status as CommentStatus) ? searchParams.status as CommentStatus : undefined;
  const comments = await getAdminVehicleComments(status);
  return <div className="container mx-auto py-2"><HeaderComponent Icon={MessageSquare} description="Moderación de comentarios de vehículos" screenName="Comentarios" /><div className="grid gap-4">{comments.map((comment) => <Card key={comment.id}><CardContent className="flex flex-col gap-3 p-4 md:flex-row md:items-center md:justify-between"><div><p className="font-medium">{comment.vehicle.title}</p><p className="text-sm text-muted-foreground">{comment.user.nombre ?? comment.user.usuario}: {comment.content}</p><p className="text-xs">Estado: {comment.status}</p></div><div className="flex gap-2"><form action={moderateVehicleComment.bind(null, comment.id, CommentStatus.APPROVED)}><Button size="sm">Aprobar</Button></form><form action={moderateVehicleComment.bind(null, comment.id, CommentStatus.REJECTED)}><Button size="sm" variant="outline">Rechazar</Button></form></div></CardContent></Card>)}</div></div>;
}

import { Badge } from "@/components/ui/badge";

const statusLabel = {
  AVAILABLE: "Disponible",
  RESERVED: "Reservado",
  SOLD: "Vendido",
};

export function VehicleStatusBadge({ status }: { status: keyof typeof statusLabel }) {
  const className =
    status === "AVAILABLE"
      ? "bg-emerald-100 text-emerald-700 ring-emerald-200"
      : status === "RESERVED"
        ? "bg-amber-100 text-amber-700 ring-amber-200"
        : "bg-zinc-100 text-zinc-700 ring-zinc-200";

  return <Badge className={className}>{statusLabel[status]}</Badge>;
}

import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function VehicleSearchBar() {
  return (
    <form action="/productos" className="grid gap-3 rounded-2xl border bg-white p-3 shadow-2xl shadow-blue-950/10 md:grid-cols-[1.5fr_1fr_1fr_auto]">
      <Input name="marca" aria-label="Buscar por marca o modelo" placeholder="Marca, modelo o palabra clave" className="h-12" />
      <Input name="ciudad" aria-label="Ciudad" placeholder="Ciudad" className="h-12" />
      <Input name="max" type="number" min="1" aria-label="Presupuesto máximo" placeholder="Precio máximo" className="h-12" />
      <Button className="h-12 px-6" type="submit"><Search /> Buscar</Button>
    </form>
  );
}

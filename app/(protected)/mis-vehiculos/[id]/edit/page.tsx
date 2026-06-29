import { notFound } from "next/navigation";
import HeaderComponent from "@/components/HeaderComponent";
import { Car } from "lucide-react";
import { getMyVehicle, getVehicleFormData } from "../../actions";
import { VehicleForm } from "../../components/vehicle-form";

export default async function EditVehiclePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [data, vehicle] = await Promise.all([getVehicleFormData(), getMyVehicle(id)]);
  if (!vehicle) notFound();
  return <div className="container mx-auto py-2"><HeaderComponent Icon={Car} description="Al guardar, la publicación vuelve a revisión para proteger la calidad del marketplace." screenName="Editar vehículo" /><VehicleForm data={data} vehicle={vehicle} /></div>;
}

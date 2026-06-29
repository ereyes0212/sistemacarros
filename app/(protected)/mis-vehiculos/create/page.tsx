import HeaderComponent from "@/components/HeaderComponent";
import { Car } from "lucide-react";
import { getVehicleFormData } from "../actions";
import { VehicleForm } from "../components/vehicle-form";

export default async function CreateVehiclePage() {
  const data = await getVehicleFormData();
  return <div className="container mx-auto py-2"><HeaderComponent Icon={Car} description="Completa la ficha comercial; quedará pendiente hasta que un admin la apruebe." screenName="Nuevo vehículo" /><VehicleForm data={data} /></div>;
}

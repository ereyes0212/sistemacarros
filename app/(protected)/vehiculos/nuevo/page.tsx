import { VehicleForm } from "./vehicle-form";

export default function NewVehiclePage() {
  return (
    <div className="space-y-6">
      <div>
        <p className="font-semibold text-blue-700">Nueva publicación</p>
        <h2 className="text-3xl font-black">Registrar vehículo para revisión</h2>
        <p className="text-muted-foreground">La publicación queda en estado PENDING_REVIEW según el schema Prisma.</p>
      </div>
      <VehicleForm />
    </div>
  );
}

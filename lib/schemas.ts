export type SignInInput = {
  usuario: string;
  contrasena: string;
};

export type VehicleInput = {
  title: string;
  description: string;
  year: number;
  mileage: number;
  fuelType: "GASOLINE" | "DIESEL" | "HYBRID" | "ELECTRIC" | "LPG" | "OTHER";
  transmission: "MANUAL" | "AUTOMATIC" | "CVT" | "SEMI_AUTOMATIC";
  price: number;
  country: string;
  city: string;
  vin?: string;
  brandName: string;
  modelName?: string;
  categoryName: string;
  imageUrl?: string;
};

export type LeadInput = {
  vehicleId: string;
  name: string;
  email: string;
  phone?: string;
  message?: string;
  type: "CONTACT" | "PURCHASE_REQUEST" | "TEST_DRIVE" | "FINANCING";
};

export function requireString(value: FormDataEntryValue | null, field: string) {
  const normalized = String(value ?? "").trim();
  if (!normalized) throw new Error(`El campo ${field} es obligatorio.`);
  return normalized;
}

export function optionalString(value: FormDataEntryValue | null) {
  const normalized = String(value ?? "").trim();
  return normalized.length ? normalized : undefined;
}

export function requireNumber(value: FormDataEntryValue | null, field: string) {
  const parsed = Number(value);
  if (!Number.isFinite(parsed)) throw new Error(`El campo ${field} debe ser numérico.`);
  return parsed;
}

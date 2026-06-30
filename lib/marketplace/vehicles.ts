export type Vehicle = {
  id: string;
  title: string;
  brand: string;
  model: string;
  year: number;
  mileage: number;
  fuelType: string;
  transmission: string;
  price: number;
  city: string;
  country: string;
  image: string;
  status: "AVAILABLE" | "RESERVED" | "SOLD";
  seller: string;
  isFavorite?: boolean;
};

export const featuredVehicles: Vehicle[] = [
  {
    id: "toyota-rav4-2022",
    title: "Toyota RAV4 XLE Hybrid",
    brand: "Toyota",
    model: "RAV4",
    year: 2022,
    mileage: 28500,
    fuelType: "Híbrido",
    transmission: "Automática",
    price: 32900,
    city: "Miami",
    country: "Estados Unidos",
    image: "https://images.unsplash.com/photo-1619767886558-efdc259cde1a?auto=format&fit=crop&w=900&q=80",
    status: "AVAILABLE",
    seller: "AutoHub Miami",
  },
  {
    id: "ford-f150-2021",
    title: "Ford F-150 Lariat 4x4",
    brand: "Ford",
    model: "F-150",
    year: 2021,
    mileage: 41100,
    fuelType: "Gasolina",
    transmission: "Automática",
    price: 41800,
    city: "Dallas",
    country: "Estados Unidos",
    image: "https://images.unsplash.com/photo-1605893477799-b99e3b8b93fe?auto=format&fit=crop&w=900&q=80",
    status: "RESERVED",
    seller: "North Trucks",
  },
  {
    id: "tesla-model-3-2023",
    title: "Tesla Model 3 Long Range",
    brand: "Tesla",
    model: "Model 3",
    year: 2023,
    mileage: 12400,
    fuelType: "Eléctrico",
    transmission: "Automática",
    price: 38950,
    city: "Los Angeles",
    country: "Estados Unidos",
    image: "https://images.unsplash.com/photo-1560958089-b8a1929cea89?auto=format&fit=crop&w=900&q=80",
    status: "AVAILABLE",
    seller: "EV Select",
  },
];

export const vehicleTypes = ["SUV", "Sedán", "Pickup", "Hatchback", "Coupé", "Van"];

import camry40 from "../images/camry.jpg";
import carnival from "../images/carnival.jpg";
import sarenta from "../images/sarenta.jpg";
import santaFe from "../images/santa-fe.jpg";
import rav4 from "../images/rav-4.jpg";
import gl350 from "../images/gl350.jpg";
import camry402 from "../images/camry40-2.jpg";
import camry70 from "../images/camry70.jpg";
import carola from "../images/carola.jpg";
import nexia from "../images/nexia-r3.jpg";
import cVr from "../images/c-vr.jpg";
import polo from "../images/polo.jpg";
import landCruser from "../images/land-cruser.jpg";

export interface Car {
  id: string;
  brand: string; // Например: "Hyundai Elantra"
  model: string; // Например: "Hyundai Elantra"
  year: number;
  price: number;
  mileage: number;
  engine: number; // "2.0 л бензин"
  transmission: string; // "КПП автомат"
  images: string[]; // URL
  isFavorite?: boolean;
  views?: number;
  likes?: number;
  date?: string; // "29 августа"
  fuel: "Дизель" | "Бензин" | "Гибрид";
  drive: "Передний" | "Задний" | "Полный";
  color: string;
  owners: number;
}

export const cars: Car[] = [
  {
    id: "1",
    brand: "Toyota",
    model: "Camry",
    year: 2021,
    price: 5400000,
    images: [camry40],
    mileage: 10000,
    engine: 2.5,
    fuel: "Бензин",
    transmission: "Автомат",
    drive: "Передний",
    color: "Черный",
    owners: 1,
  },
  {
    id: "2",
    brand: "Hyundai",
    model: "Santa Fe",
    year: 2020,
    price: 17000000,
    images: [santaFe],
    mileage: 10000,
    engine: 2.2,
    fuel: "Дизель",
    transmission: "Автомат",
    drive: "Полный",
    color: "Белый",
    owners: 1,
  },
  {
    id: "3",
    brand: "Kia",
    model: "Sorento",
    year: 2015,
    price: 8000000,
    images: [sarenta],
    mileage: 15000,
    engine: 2.4,
    fuel: "Бензин",
    transmission: "Автомат",
    drive: "Полный",
    color: "Серый",
    owners: 1,
  },
  {
    id: "4",
    brand: "Kia",
    model: "Carnival",
    year: 2016,
    price: 12000000,
    images: [carnival],
    mileage: 20000,
    engine: 3.3,
    fuel: "Бензин",
    transmission: "Автомат",
    drive: "Передний",
    color: "Синий",
    owners: 2,
  },
  {
    id: "5",
    brand: "Toyota",
    model: "RAV4",
    year: 2015,
    price: 10000000,
    images: [rav4],
    mileage: 25000,
    engine: 2.0,
    fuel: "Бензин",
    transmission: "Автомат",
    drive: "Полный",
    color: "Белый",
    owners: 2,
  },
  {
    id: "6",
    brand: "Toyota",
    model: "Land Cruiser 200",
    year: 2019,
    price: 27000000,
    images: [landCruser],
    mileage: 30000,
    engine: 4.5,
    fuel: "Дизель",
    transmission: "Автомат",
    drive: "Полный",
    color: "Черный",
    owners: 2,
  },
  {
    id: "7",
    brand: "Volkswagen",
    model: "Polo",
    year: 2019,
    price: 6000000,
    images: [polo],
    mileage: 40000,
    engine: 1.6,
    fuel: "Бензин",
    transmission: "Механика",
    drive: "Передний",
    color: "Красный",
    owners: 2,
  },
  {
    id: "8",
    brand: "Toyota",
    model: "Camry",
    year: 2019,
    price: 5300000,
    images: [camry402],
    mileage: 30000,
    engine: 2.5,
    fuel: "Бензин",
    transmission: "Автомат",
    drive: "Передний",
    color: "Серый",
    owners: 2,
  },
  {
    id: "9",
    brand: "Chevrolet",
    model: "Nexia R3",
    year: 2019,
    price: 4700000,
    images: [nexia],
    mileage: 35000,
    engine: 1.5,
    fuel: "Бензин",
    transmission: "Механика",
    drive: "Передний",
    color: "Белый",
    owners: 2,
  },
  {
    id: "10",
    brand: "Toyota",
    model: "C-HR",
    year: 2022,
    price: 13200000,
    images: [cVr],
    mileage: 25000,
    engine: 1.8,
    fuel: "Гибрид",
    transmission: "Автомат",
    drive: "Передний",
    color: "Синий",
    owners: 1,
  },
  {
    id: "11",
    brand: "Toyota",
    model: "Corolla",
    year: 2019,
    price: 13000000,
    images: [carola],
    mileage: 28000,
    engine: 1.6,
    fuel: "Бензин",
    transmission: "Автомат",
    drive: "Передний",
    color: "Серебристый",
    owners: 2,
  },
  {
    id: "12",
    brand: "Toyota",
    model: "Camry 70",
    year: 2019,
    price: 13000000,
    images: [camry70],
    mileage: 20000,
    engine: 2.5,
    fuel: "Бензин",
    transmission: "Автомат",
    drive: "Передний",
    color: "Белый",
    owners: 1,
  },
  {
    id: "13",
    brand: "Mercedes",
    model: "GL350",
    year: 2019,
    price: 15000000,
    images: [gl350],
    mileage: 40000,
    engine: 3.0,
    fuel: "Дизель",
    transmission: "Автомат",
    drive: "Полный",
    color: "Черный",
    owners: 2,
  },
];

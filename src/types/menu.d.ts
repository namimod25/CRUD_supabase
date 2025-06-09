import { Type } from "lucide-react";

interface IMenu {
    id: number;
    name: string;
    description: string;
    price: number;
  categori: string;
  imagePath: string; // image path from DB, default can be handled in the component
}
export type {IMenu};
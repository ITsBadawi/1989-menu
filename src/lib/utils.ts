import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatIQD(price: number) {
  return new Intl.NumberFormat("ar-IQ").format(price) + " د.ع";
}

export interface Category {
  id: string;
  nameAr: string;
  nameEn: string;
  sortOrder: number;
  isVisible: boolean;
  createdAt: number;
}

export interface MenuItem {
  id: string;
  nameAr: string;
  nameEn: string;
  descriptionAr: string;
  descriptionEn: string;
  ingredients: string[];
  price: number;
  categoryId: string;
  imageUrl: string;
  isAvailable: boolean;
  isFeatured: boolean;
  sortOrder: number;
  createdAt: number;
  rating?: number; // average rating 0-5
  ratingCount?: number;
  viewCount?: number;
}

export interface Phone {
  number: string;
  isWhatsapp: boolean;
  label: string;
}

export interface Social {
  platform: "instagram" | "facebook" | "tiktok";
  url: string;
}

export interface WorkingHour {
  day: string;
  open: string;
  close: string;
  isClosed: boolean;
}

export interface Restaurant {
  id: string; // singleton "main"
  name: string;
  logo: string;
  address: string;
  mapEmbedUrl: string;
  phones: Phone[];
  socials: Social[];
  hours: WorkingHour[];
  about: string;
  aboutEn: string;
  seoDescription: string;
  themeColor: string;
  defaultDarkMode: boolean;
  fontScale: number;
}

export interface CartLine {
  itemId: string;
  qty: number;
  note?: string;
}

export interface ViewEvent {
  id: string;
  itemId: string;
  timestamp: number;
}

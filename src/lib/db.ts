import Dexie, { type Table } from "dexie";
import type { Category, MenuItem, Restaurant, ViewEvent } from "../types";

export class MenuDB extends Dexie {
  categories!: Table<Category, string>;
  items!: Table<MenuItem, string>;
  restaurant!: Table<Restaurant, string>;
  views!: Table<ViewEvent, string>;

  constructor() {
    super("nineteen89-db");
    this.version(1).stores({
      categories: "id, sortOrder, isVisible",
      items: "id, categoryId, sortOrder, isFeatured, isAvailable",
      restaurant: "id",
      views: "id, itemId, timestamp",
    });
  }
}

export const db = new MenuDB();

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { CartLine } from "../types";

interface CartState {
  lines: CartLine[];
  isOpen: boolean;
  open: () => void;
  close: () => void;
  toggle: () => void;
  addItem: (itemId: string) => void;
  removeItem: (itemId: string) => void;
  decrement: (itemId: string) => void;
  clear: () => void;
  count: () => number;
}

export const useCart = create<CartState>()(
  persist(
    (set, get) => ({
      lines: [],
      isOpen: false,
      open: () => set({ isOpen: true }),
      close: () => set({ isOpen: false }),
      toggle: () => set((s) => ({ isOpen: !s.isOpen })),
      addItem: (itemId) =>
        set((s) => {
          const existing = s.lines.find((l) => l.itemId === itemId);
          if (existing) {
            return {
              lines: s.lines.map((l) =>
                l.itemId === itemId ? { ...l, qty: l.qty + 1 } : l
              ),
            };
          }
          return { lines: [...s.lines, { itemId, qty: 1 }] };
        }),
      decrement: (itemId) =>
        set((s) => {
          const existing = s.lines.find((l) => l.itemId === itemId);
          if (!existing) return s;
          if (existing.qty <= 1) {
            return { lines: s.lines.filter((l) => l.itemId !== itemId) };
          }
          return {
            lines: s.lines.map((l) =>
              l.itemId === itemId ? { ...l, qty: l.qty - 1 } : l
            ),
          };
        }),
      removeItem: (itemId) =>
        set((s) => ({ lines: s.lines.filter((l) => l.itemId !== itemId) })),
      clear: () => set({ lines: [] }),
      count: () => get().lines.reduce((sum, l) => sum + l.qty, 0),
    }),
    { name: "1989-cart" }
  )
);

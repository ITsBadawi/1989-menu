import { type ButtonHTMLAttributes, forwardRef } from "react";
import { cn } from "../../lib/utils";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "ghost" | "outline" | "danger";
  size?: "sm" | "md" | "lg";
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center gap-2 rounded-full font-arBody font-medium transition-all duration-200 disabled:opacity-40 disabled:pointer-events-none active:scale-95",
          variant === "primary" &&
            "bg-gold text-base hover:bg-gold-bright shadow-gold",
          variant === "outline" &&
            "border border-gold/40 text-gold hover:bg-gold/10",
          variant === "ghost" && "text-cream-muted hover:text-cream hover:bg-white/5",
          variant === "danger" && "bg-rust/90 text-cream hover:bg-rust",
          size === "sm" && "px-3 py-1.5 text-sm",
          size === "md" && "px-5 py-2.5 text-sm",
          size === "lg" && "px-7 py-3.5 text-base",
          className
        )}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

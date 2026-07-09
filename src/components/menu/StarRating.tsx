import { Star } from "lucide-react";
import { cn } from "../../lib/utils";

export function StarRating({
  rating = 0,
  count,
  size = 13,
  className,
}: {
  rating?: number;
  count?: number;
  size?: number;
  className?: string;
}) {
  return (
    <div className={cn("flex items-center gap-1", className)}>
      <div className="flex items-center">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star
            key={i}
            size={size}
            className={
              i < Math.round(rating)
                ? "fill-gold text-gold"
                : "fill-transparent text-base-line"
            }
          />
        ))}
      </div>
      {count !== undefined && (
        <span className="text-[11px] text-cream-dim">({count})</span>
      )}
    </div>
  );
}

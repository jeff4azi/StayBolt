import { Star } from "lucide-react";

export default function StarRating({ rating, max = 5, size = 16 }) {
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: max }).map((_, i) => {
        const filled = i < Math.floor(rating);
        const partial = !filled && i < rating;
        return (
          <Star
            key={i}
            size={size}
            className={
              filled
                ? "fill-yellow-400 text-yellow-400"
                : partial
                  ? "fill-yellow-200 text-yellow-400"
                  : "text-gray-300"
            }
          />
        );
      })}
      <span className="ml-1 text-[13px] text-gray-500 font-medium">
        {rating}
      </span>
    </div>
  );
}

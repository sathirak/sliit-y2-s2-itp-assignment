"use client";

import { useState } from "react";
import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

interface StarRatingProps {
  rating?: number;
  onRatingChange?: (rating: number) => void;
  readonly?: boolean;
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function StarRating({ 
  rating = 0, 
  onRatingChange, 
  readonly = false, 
  size = "md",
  className 
}: StarRatingProps) {
  const [hoverRating, setHoverRating] = useState(0);

  const sizeClasses = {
    sm: "h-4 w-4",
    md: "h-5 w-5", 
    lg: "h-6 w-6"
  };

  const handleClick = (newRating: number) => {
    if (!readonly && onRatingChange) {
      onRatingChange(newRating);
    }
  };

  const handleMouseEnter = (newRating: number) => {
    if (!readonly) {
      setHoverRating(newRating);
    }
  };

  const handleMouseLeave = () => {
    if (!readonly) {
      setHoverRating(0);
    }
  };

  const displayRating = hoverRating || rating;

  return (
    <div className={cn("flex items-center space-x-1", className)}>
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => handleClick(star)}
          onMouseEnter={() => handleMouseEnter(star)}
          onMouseLeave={handleMouseLeave}
          disabled={readonly}
          className={cn(
            "transition-colors duration-150",
            !readonly && "hover:scale-110 cursor-pointer",
            readonly && "cursor-default"
          )}
        >
          <Star
            className={cn(
              sizeClasses[size],
              star <= displayRating
                ? "fill-yellow-400 text-yellow-400"
                : "text-gray-300"
            )}
          />
        </button>
      ))}
    </div>
  );
}

interface StarDisplayProps {
  rating?: number;
  size?: "sm" | "md" | "lg";
  className?: string;
  showValue?: boolean;
}

export function StarDisplay({ 
  rating = 0, 
  size = "md", 
  className,
  showValue = false 
}: StarDisplayProps) {
  const sizeClasses = {
    sm: "h-4 w-4",
    md: "h-5 w-5", 
    lg: "h-6 w-6"
  };

  return (
    <div className={cn("flex items-center space-x-1", className)}>
      <StarRating rating={rating} readonly size={size} />
      {showValue && (
        <span className="text-sm text-gray-600 ml-1">
          {rating > 0 ? rating.toFixed(1) : "No rating"}
        </span>
      )}
    </div>
  );
}

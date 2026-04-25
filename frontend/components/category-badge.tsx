import { Category } from "@/lib/types";

const categoryStyles: Record<Category, string> = {
  Tech: "bg-blue-100 text-blue-700 border-blue-200",
  Lifestyle: "bg-pink-100 text-pink-700 border-pink-200",
  Education: "bg-green-100 text-green-700 border-green-200",
  Travel: "bg-amber-100 text-amber-700 border-amber-200",
  Health: "bg-teal-100 text-teal-700 border-teal-200",
};

interface CategoryBadgeProps {
  category: Category;
  className?: string;
}

export function CategoryBadge({ category, className }: CategoryBadgeProps) {
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${categoryStyles[category]} ${className ?? ""}`}
    >
      {category}
    </span>
  );
}

"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useCategories } from "@/lib/hooks/use-categories";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { CategoryIcon } from "@/lib/utils/icon-map";

export default function CategoriesPage() {
  const { data: categories, isLoading } = useCategories();


  useEffect(() => {
    if (categories) {
      console.log("Categories from DB:", categories);
      categories.forEach((cat) => {
        console.log(`${cat.name}: icon=${cat.icon}`);
      });
    }
  }, [categories]);

  return (
    <div className="flex flex-col gap-6 p-4 md:p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-[#171717]">Categories</h1>
      </div>

      <div className="space-y-3">
        {isLoading ? (
          <>
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Skeleton key={i} className="h-20 rounded-lg" />
            ))}
          </>
        ) : !categories || categories.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-[#6b6b6f]">No categories available</p>
          </div>
        ) : (
          categories.map((category) => (
            <Link
              key={category.id}
              href={`/dashboard/categories/${category.id}`}
              className="block group"
            >
              <div className="flex items-center justify-between p-4 bg-white border border-[#e8e2db] rounded-lg shadow-orange hover:shadow-orange-lg hover:border-[#FF6B35] transition-all group-hover:bg-[#f5f0eb]">
                <div className="flex items-center gap-4 flex-1 min-w-0">
                  <CategoryIcon icon={category.icon} size={8} />
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-[#171717]">{category.name}</h3>
                    {category.description && (
                      <p className="text-sm text-[#6b6b6f] truncate">
                        {category.description}
                      </p>
                    )}
                  </div>
                  <Badge
                    variant="outline"
                    className={
                      category.type === "income"
                        ? "bg-sky-100 text-sky-800"
                        : "bg-red-100 text-red-800"
                    }
                  >
                    {category.type}
                  </Badge>
                </div>
              </div>
            </Link>
          ))
        )}
      </div>
    </div>
  );
}


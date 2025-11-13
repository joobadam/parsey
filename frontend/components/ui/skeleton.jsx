import { cn } from "@/lib/utils";

export function Skeleton({ className = "" }) {
  return <div className={cn("animate-pulse bg-[#e8e2db] rounded-lg", className)} />;
}


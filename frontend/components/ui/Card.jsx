import Link from "next/link";
import { cn } from "@/lib/utils";

export function Card({ 
  children, 
  className,
  href,
  onClick,
  ...props 
}) {
  const baseStyles = "bg-white rounded-xl border border-[var(--color-card-border)] p-6 transition-all duration-200 hover:shadow-lg";
  
  const classes = cn(baseStyles, className);

  if (href) {
    return (
      <Link href={href} className={classes} {...props}>
        {children}
      </Link>
    );
  }

  if (onClick) {
    return (
      <div onClick={onClick} className={cn(classes, "cursor-pointer")} {...props}>
        {children}
      </div>
    );
  }

  return (
    <div className={classes} {...props}>
      {children}
    </div>
  );
}


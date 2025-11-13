import Link from "next/link";
import { cn } from "@/lib/utils";

export function Card({ 
  children, 
  className,
  href,
  onClick,
  ...props 
}) {
  const baseStyles = "bg-white rounded-xl border border-[var(--color-card-border)] p-6 transition-all duration-200 shadow-orange hover:shadow-orange-lg";
  
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

export function CardHeader({ className, ...props }) {
  return (
    <div
      className={cn("flex flex-col space-y-1.5 pb-4", className)}
      {...props}
    />
  );
}

export function CardTitle({ className, ...props }) {
  return (
    <h3
      className={cn("text-lg font-semibold leading-none tracking-tight text-[#171717]", className)}
      {...props}
    />
  );
}

export function CardContent({ className, ...props }) {
  return (
    <div
      className={cn("pt-0", className)}
      {...props}
    />
  );
}


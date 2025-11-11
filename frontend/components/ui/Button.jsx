import Link from "next/link";
import { cn } from "@/lib/utils";

export function Button({ 
  children, 
  variant = "primary", 
  size = "default",
  href,
  onClick,
  className,
  ...props 
}) {
  const baseStyles = "inline-flex items-center justify-center rounded-lg font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none";
  
  const variants = {
    primary: "bg-[var(--color-primary)] text-white hover:bg-[var(--color-primary)]/90 focus:ring-[var(--color-primary)] shadow-sm hover:shadow-md",
    secondary: "bg-transparent border-2 border-[var(--color-primary)] text-[var(--color-primary)] hover:bg-[var(--color-primary)] hover:text-white focus:ring-[var(--color-primary)]",
    outline: "bg-transparent border-2 border-[var(--color-card-border)] text-[var(--color-foreground)] hover:border-[var(--color-primary)] hover:text-[var(--color-primary)] focus:ring-[var(--color-primary)]",
  };
  
  const sizes = {
    default: "px-6 py-3 text-base",
    sm: "px-4 py-2 text-sm",
    lg: "px-8 py-4 text-lg",
  };

  const classes = cn(
    baseStyles,
    variants[variant],
    sizes[size],
    className
  );

  if (href) {
    return (
      <Link href={href} className={classes} {...props}>
        {children}
      </Link>
    );
  }

  return (
    <button onClick={onClick} className={classes} {...props}>
      {children}
    </button>
  );
}


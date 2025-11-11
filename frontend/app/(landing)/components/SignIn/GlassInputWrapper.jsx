export default function GlassInputWrapper({ children }) {
  return (
    <div className="rounded-2xl border border-border bg-foreground/5 backdrop-blur-sm transition-colors focus-within:border-[var(--color-primary)]/70 focus-within:bg-[var(--color-primary)]/10">
      {children}
    </div>
  );
}

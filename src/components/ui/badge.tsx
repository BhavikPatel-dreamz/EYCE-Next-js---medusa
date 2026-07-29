import { cn } from "@/lib/utils";

export function Badge({
  className,
  variant = "default",
  ...props
}: React.HTMLAttributes<HTMLDivElement> & { variant?: "default" | "outline" | "accent" | "muted" | "amber" | "rose" | "violet" }) {
  const styles = {
    default: "badge-primary",
    outline: "border border-border text-foreground",
    accent: "badge-accent",
    muted: "bg-muted text-muted-foreground",
    amber: "badge-amber",
    rose: "badge-rose",
    violet: "badge-accent",
  }[variant];
  return (
    <div
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[10px] font-semibold tracking-wide uppercase shadow-sm",
        styles,
        className,
      )}
      {...props}
    />
  );
}

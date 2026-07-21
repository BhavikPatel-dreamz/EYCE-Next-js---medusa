import { cn } from "@/lib/utils";

export function Badge({
  className,
  variant = "default",
  ...props
}: React.HTMLAttributes<HTMLDivElement> & { variant?: "default" | "outline" | "accent" | "muted" }) {
  const styles = {
    default: "bg-primary text-primary-foreground",
    outline: "border border-border text-foreground",
    accent: "bg-primary text-primary-foreground",
    muted: "bg-muted text-muted-foreground",
  }[variant];
  return (
    <div
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] font-semibold tracking-wide uppercase",
        styles,
        className,
      )}
      {...props}
    />
  );
}

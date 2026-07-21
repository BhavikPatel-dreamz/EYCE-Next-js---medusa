import { cn } from "@/lib/utils";

export function Separator({ className, ...p }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("h-px w-full bg-border", className)} {...p} />;
}

import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="container-x flex min-h-[70vh] flex-col items-center justify-center text-center">
      <div className="font-display text-8xl text-primary">404</div>
      <h1 className="mt-4 font-display text-3xl font-bold">Page not found</h1>
      <p className="mt-2 max-w-md text-muted-foreground">
        The page you&apos;re looking for doesn&apos;t exist or was moved.
      </p>
      <Button asChild size="lg" className="mt-6"><Link href="/">Back home</Link></Button>
    </div>
  );
}

export default function Loading() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="relative size-8">
          <div className="absolute inset-0 rounded-full border-2 border-border" />
          <div className="absolute inset-0 animate-spin rounded-full border-2 border-transparent border-t-foreground" />
        </div>
        <p className="text-xs uppercase tracking-[0.15em] text-muted-foreground">Loading...</p>
      </div>
    </div>
  );
}

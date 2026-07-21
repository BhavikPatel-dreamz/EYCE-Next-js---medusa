export function AnnouncementBar() {
  return (
    <div className="border-b border-border">
      <div className="container-x flex h-9 items-center justify-center gap-4 font-mono text-[11px] uppercase tracking-widest text-muted-foreground">
        <span className="hidden sm:inline">Free ship over $60</span>
        <span className="hidden sm:inline">&middot;</span>
        <span>Lifetime warranty</span>
        <span className="hidden sm:inline">&middot;</span>
        <span className="hidden sm:inline">Ships in 24h</span>
        <span className="hidden md:inline">&middot;</span>
        <span className="hidden md:inline">Dishwasher safe</span>
      </div>
    </div>
  );
}

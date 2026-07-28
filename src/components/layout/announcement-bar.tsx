"use client";

const items = [
  "Free US shipping on orders over $60",
  "Lifetime warranty on all silicone gear",
  "Same-day dispatch before 2pm EST",
  "Dishwasher & freezer safe",
  "30-day hassle-free returns",
  "Designed & engineered in the USA",
];

export function AnnouncementBar() {
  const repeated = [...items, ...items, ...items];

  return (
    <div className="overflow-hidden border-b border-border/60 bg-background py-2">
      <div className="flex animate-marquee gap-0 whitespace-nowrap">
        {repeated.map((item, i) => (
          <span
            key={i}
            className="shrink-0 font-mono text-[11px] uppercase tracking-widest text-muted-foreground"
          >
            {item}
            <span className="mx-8 text-border">·</span>
          </span>
        ))}
      </div>
    </div>
  );
}

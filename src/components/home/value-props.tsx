import { Truck, ShieldCheck, Clock, Droplets } from "lucide-react";

const values = [
  { icon: Truck, title: "Free shipping", copy: "On orders over $60. Ships in 24 hours." },
  { icon: ShieldCheck, title: "Lifetime warranty", copy: "Every piece is built to last. We stand behind it." },
  { icon: Clock, title: "Ships in 24h", copy: "Order today, we ship tomorrow. Fast and reliable." },
  { icon: Droplets, title: "Dishwasher safe", copy: "Platinum-cured silicone. Toss it in the dishwasher." },
];

export function ValueProps() {
  return (
    <section className="container-x py-20">
      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
        {values.map((v) => (
          <div key={v.title} className="flex flex-col gap-3">
            <v.icon className="size-5 text-primary" />
            <div className="font-semibold">{v.title}</div>
            <p className="text-sm text-muted-foreground">{v.copy}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

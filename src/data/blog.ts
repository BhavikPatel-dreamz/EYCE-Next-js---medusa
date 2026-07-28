export type BlogPost = {
  id: number;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  image: string;
  category: string;
  date: string;
  readTime: string;
  author: {
    name: string;
    avatar: string;
    role: string;
  };
  tags: string[];
};

export const blogPosts: BlogPost[] = [
  {
    id: 1,
    slug: "why-silicone-over-glass",
    title: "Why Silicone Beats Glass: The Science Behind Durability",
    excerpt: "We break down the material science that makes platinum-cured silicone nearly indestructible compared to traditional borosilicate glass.",
    content: `
      <p>When it comes to smoking gear, the debate between silicone and glass has been ongoing for years. But the science is clear — platinum-cured silicone offers advantages that glass simply can't match.</p>

      <h2>What is Platinum-Cured Silicone?</h2>
      <p>Platinum-cured silicone is a high-purity elastomer that uses a platinum-based catalyst during the curing process. Unlike peroxide-cured silicone, it produces no byproducts, making it food-safe, medical-grade, and incredibly stable across extreme temperatures.</p>

      <h2>The Durability Factor</h2>
      <p>Glass breaks. It's not a matter of if, but when. A single drop from counter height can shatter a $200 piece into useless shards. Silicone, on the other hand, has a tear strength of over 100 kN/m — meaning it can withstand impacts that would destroy any glass piece.</p>

      <h2>Temperature Resistance</h2>
      <p>Platinum-cured silicone remains flexible and stable from -60°F to 450°F. Throw it in the freezer, toss it in the dishwasher, or leave it in a hot car — it performs the same every time. Glass is susceptible to thermal shock, which means rapid temperature changes can cause it to crack spontaneously.</p>

      <h2>The Verdict</h2>
      <p>When you factor in durability, safety, ease of cleaning, and lifetime value, silicone is the clear winner. That's why we've been silicone-first since 2013 — and why we back every piece with a lifetime warranty.</p>
    `,
    image: "https://images.unsplash.com/photo-1618354691792-d1d42acfd860?w=800&auto=format&fit=crop&q=85",
    category: "Material Science",
    date: "Jan 15, 2026",
    readTime: "5 min read",
    author: {
      name: "Alex Rivera",
      avatar: "https://i.pravatar.cc/80?img=12",
      role: "Head of Engineering",
    },
    tags: ["silicone", "durability", "materials", "science"],
  },
  {
    id: 2,
    slug: "how-to-clean-silicone",
    title: "The Ultimate Guide to Cleaning Silicone Gear",
    excerpt: "From dishwasher methods to deep-cleaning tips, keep your EYCE pieces looking brand new for years.",
    content: `
      <p>One of the biggest advantages of silicone gear is how easy it is to clean. Here's our complete guide to keeping your pieces in pristine condition.</p>

      <h2>The Dishwasher Method</h2>
      <p>Yes, you can actually put EYCE silicone pieces in the dishwasher. Place them on the top rack, use your regular detergent, and run a normal cycle. The high heat and soap will break down any residue without damaging the silicone.</p>

      <h2>Hand Washing</h2>
      <p>For a quick clean, use warm water and mild dish soap. A soft-bristle brush or pipe cleaner works great for getting into crevices. Avoid abrasive scrubbers — while silicone is tough, there's no need to push it.</p>

      <h2>Deep Cleaning</h2>
      <p>For stubborn buildup, soak your piece in isopropyl alcohol for 30 minutes, then scrub with a soft brush. Alternatively, a mixture of coarse salt and rubbing alcohol works as an effective abrasive cleaning solution.</p>

      <h2>Storage Tips</h2>
      <p>Store your pieces in a cool, dry place. Silicone doesn't degrade in sunlight like some plastics, but keeping it out of direct UV exposure will maintain its color vibrancy over time.</p>
    `,
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&auto=format&fit=crop&q=85",
    category: "Care Guide",
    date: "Jan 8, 2026",
    readTime: "4 min read",
    author: {
      name: "Jordan Kim",
      avatar: "https://i.pravatar.cc/80?img=32",
      role: "Product Specialist",
    },
    tags: ["cleaning", "maintenance", "care", "guide"],
  },
  {
    id: 3,
    slug: "modular-design-explained",
    title: "Modular Design: Why We Built Everything Interchangeable",
    excerpt: "Our engineering philosophy behind modular components and how it saves you money while reducing waste.",
    content: `
      <p>At EYCE, we believe in building things that last — and that means building things that can be repaired, upgraded, and customized. That's why every piece we make is modular.</p>

      <h2>What Does Modular Mean?</h2>
      <p>Modular design means every component of a piece — bowls, downstems, mouthpieces, bases — is a separate, interchangeable part. If one part breaks or wears out, you replace just that part, not the entire piece.</p>

      <h2>Why It Matters</h2>
      <p>The average smoker owns 5-10 pieces over their lifetime. With modular design, you buy one quality base and swap components as needed. This saves money, reduces waste, and means your setup evolves with your preferences.</p>

      <h2>The Engineering Challenge</h2>
      <p>Making modular components that fit together perfectly every time requires precision engineering. Each joint must be airtight, each connection must be secure, and each part must be manufactured to tolerances within 0.1mm.</p>

      <h2>Customization</h2>
      <p>Modular also means personal. Mix colors, swap bowl sizes, add accessories — your setup is uniquely yours. We release new components regularly so you can keep your piece fresh without starting over.</p>
    `,
    image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=600&auto=format&fit=crop&q=85",
    category: "Engineering",
    date: "Dec 28, 2025",
    readTime: "6 min read",
    author: {
      name: "Alex Rivera",
      avatar: "https://i.pravatar.cc/80?img=12",
      role: "Head of Engineering",
    },
    tags: ["modular", "design", "engineering", "sustainability"],
  },
  {
    id: 4,
    slug: "best-pipes-for-travel",
    title: "5 Best Travel-Friendly Pipes That Fit Any Adventure",
    excerpt: "Camping, hiking, or just hitting the road — these compact silicone pieces are built for life on the move.",
    content: `
      <p>Life doesn't stop when you leave the house. That's why we design pieces that go wherever you do — from the trailhead to the campsite to the backseat of your car.</p>

      <h2>1. The Hammer Pipe</h2>
      <p>Our most compact hand pipe fits in any pocket. The flat bottom means it stands upright on any surface, and the silicone body absorbs drops without a scratch.</p>

      <h2>2. The Mini Beaker</h2>
      <p>A scaled-down version of our classic beaker bong. It disassembles into three pieces that fit in a small pouch. Perfect for camping trips where space is at a premium.</p>

      <h2>3. The Spark Rig</h2>
      <p>Our dab rig designed for portability. The silicone body wraps around a quartz banger, protecting it during transport. It's the most travel-friendly rig on the market.</p>

      <h2>4. The Pocket Spoon</h2>
      <p>Simple, effective, and nearly indestructible. The Pocket Spoon has survived being run over by a car in our testing. It's the last pipe you'll ever need to pack.</p>

      <h2>5. The Travel Bundle</h2>
      <p>Our curated travel kit includes a Hammer Pipe, cleaning supplies, and a carrying case. It's everything you need in one compact package.</p>
    `,
    image: "https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=600&auto=format&fit=crop&q=85",
    category: "Lifestyle",
    date: "Dec 20, 2025",
    readTime: "3 min read",
    author: {
      name: "Sam Chen",
      avatar: "https://i.pravatar.cc/80?img=53",
      role: "Brand Director",
    },
    tags: ["travel", "lifestyle", "portable", "recommendations"],
  },
  {
    id: 5,
    slug: "lifetime-warranty-explained",
    title: "Our Lifetime Warranty: What It Actually Covers",
    excerpt: "No fine print, no receipts required. Here's exactly what our lifetime warranty covers and how to use it.",
    content: `
      <p>We talk a lot about our lifetime warranty, but what does it actually mean? Let's break down exactly what's covered and how to make a claim.</p>

      <h2>What's Covered</h2>
      <p>Every EYCE silicone piece is covered for life against manufacturing defects and normal-use breakage. If your piece cracks, chips, or breaks under normal conditions, we replace it — free of charge.</p>

      <h2>What's Not Covered</h2>
      <p>Intentional damage, misuse, or modifications void the warranty. If you melt it with a torch or run it over with a truck, that's on you. But if it breaks from a normal drop or regular use, we've got you.</p>

      <h2>How to Make a Claim</h2>
      <p>Send us an email with a photo of the damaged piece and your order number. No receipt? No problem — we can look up your purchase by name or shipping address. Most claims are processed within 48 hours.</p>

      <h2>The Fine Print (There Isn't Any)</h2>
      <p>No forms, no shipping fees, no questions. We believe a warranty should be simple because standing behind your product shouldn't be complicated.</p>
    `,
    image: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=600&auto=format&fit=crop&q=85",
    category: "Company",
    date: "Dec 15, 2025",
    readTime: "4 min read",
    author: {
      name: "Jordan Kim",
      avatar: "https://i.pravatar.cc/80?img=32",
      role: "Product Specialist",
    },
    tags: ["warranty", "support", "company", "policy"],
  },
  {
    id: 6,
    slug: "silicone-vs-plastic",
    title: "Silicone vs Plastic: Why Material Choice Matters",
    excerpt: "Not all flexible materials are created equal. Here's why silicone is safer, more durable, and better for the planet.",
    content: `
      <p>Many smoking accessories are made from plastic or low-grade silicone. Here's why we only use platinum-cured silicone and why it matters for your health and the environment.</p>

      <h2>Health Safety</h2>
      <p>Platinum-cured silicone is biologically inert — it doesn't leach chemicals, even at high temperatures. Plastic, on the other hand, can release BPA, phthalates, and other harmful compounds when heated.</p>

      <h2>Environmental Impact</h2>
      <p>Silicone lasts dramatically longer than plastic, reducing replacement waste. It's also more easily recyclable through specialized facilities, and it doesn't break down into microplastics.</p>

      <h2>Performance</h2>
      <p>Silicone maintains its shape, flexibility, and color for years. Plastic becomes brittle, fades, and degrades — especially when exposed to heat, UV light, or cleaning chemicals.</p>

      <h2>The Bottom Line</h2>
      <p>When you choose silicone over plastic, you're choosing a healthier, more sustainable, and longer-lasting product. It costs more to manufacture, but the value over time is unmatched.</p>
    `,
    image: "https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?w=600&auto=format&fit=crop&q=85",
    category: "Material Science",
    date: "Dec 8, 2025",
    readTime: "5 min read",
    author: {
      name: "Alex Rivera",
      avatar: "https://i.pravatar.cc/80?img=12",
      role: "Head of Engineering",
    },
    tags: ["silicone", "plastic", "health", "sustainability"],
  },
];

export function getBlogPost(slug: string): BlogPost | undefined {
  return blogPosts.find((p) => p.slug === slug);
}

export function getRelatedPosts(slug: string, limit = 3): BlogPost[] {
  const post = getBlogPost(slug);
  if (!post) return blogPosts.slice(0, limit);
  return blogPosts
    .filter((p) => p.slug !== slug && (p.category === post.category || p.tags.some((t) => post.tags.includes(t))))
    .slice(0, limit);
}

"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { ZoomIn } from "lucide-react";
import { cn } from "@/lib/utils";

export function ProductGallery({ images, alt }: { images: string[]; alt: string }) {
  const [active, setActive] = useState(0);
  const [zoomed, setZoomed] = useState(false);
  const [zoomPos, setZoomPos] = useState({ x: 50, y: 50 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setZoomPos({ x, y });
  };

  return (
    <div className="flex flex-col-reverse gap-4 md:flex-row">
      {/* Thumbnails */}
      <div className="flex gap-2.5 md:flex-col">
        {images.map((src, i) => (
          <button
            key={src}
            onClick={() => setActive(i)}
            className={cn(
              "relative aspect-square w-16 shrink-0 overflow-hidden rounded-lg border-2 transition-all duration-200 md:w-[72px]",
              i === active
                ? "border-primary shadow-sm shadow-primary/20"
                : "border-border/60 hover:border-border opacity-60 hover:opacity-100",
            )}
          >
            <Image src={src} alt="" fill sizes="72px" className="object-cover" />
          </button>
        ))}
      </div>

      {/* Main Image */}
      <div className="relative flex-1">
        <div
          className={cn(
            "relative aspect-[4/5] overflow-hidden rounded-2xl bg-surface cursor-crosshair",
            zoomed && "cursor-zoom-out",
          )}
          onClick={() => setZoomed(!zoomed)}
          onMouseMove={!zoomed ? handleMouseMove : undefined}
          onMouseLeave={() => setZoomed(false)}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={active}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="absolute inset-0"
            >
              <Image
                src={images[active]}
                alt={alt}
                fill
                priority
                sizes="(min-width: 1024px) 50vw, 100vw"
                className={cn(
                  "object-cover transition-transform duration-200",
                  zoomed && "scale-[2]",
                )}
                style={zoomed ? { transformOrigin: `${zoomPos.x}% ${zoomPos.y}%` } : undefined}
              />
            </motion.div>
          </AnimatePresence>

          {/* Zoom hint */}
          {!zoomed && (
            <div className="absolute bottom-4 right-4 flex items-center gap-1.5 rounded-full bg-background/80 backdrop-blur-sm px-3 py-1.5 text-[10px] font-medium text-muted-foreground">
              <ZoomIn className="size-3" />
              Hover to zoom
            </div>
          )}
        </div>

        {/* Thumbnail strip (mobile) */}
        <div className="mt-3 flex gap-2 overflow-x-auto scrollbar-none md:hidden">
          {images.map((src, i) => (
            <button
              key={src}
              onClick={() => setActive(i)}
              className={cn(
                "relative h-14 w-14 shrink-0 overflow-hidden rounded-md border",
                i === active ? "border-primary" : "border-border/60",
              )}
            >
              <Image src={src} alt="" fill sizes="56px" className="object-cover" />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";
import { EASE, SURE } from "./motion";

/**
 * Sayfa açılışında hero medyası 1.28 ölçekten 1'e oturur.
 * Tetik yok — sayfa yüklenir yüklenmez başlar (referans temadaki davranış).
 */
export default function HeroZoom({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  const reduced = useReducedMotion();
  return (
    <div className={`overflow-hidden ${className ?? ""}`}>
      <motion.div
        className="reveal h-full w-full"
        initial={reduced ? false : { scale: 1.28 }}
        animate={{ scale: 1 }}
        transition={{ duration: SURE.heroZoom, ease: EASE }}
      >
        {children}
      </motion.div>
    </div>
  );
}

"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";

const EASE = [0.32, 0.72, 0, 1] as const;

/**
 * Temadaki görsel açılış animasyonu: görünüme girerken görsel 1.12 ölçekten
 * yavaşça oturur (overflow gizli). kenburns=true ise oturduktan sonra da
 * sürekli çok yavaş zoom devam eder — ekibin "gif alanı" gibi statik
 * görsellere hayat vermek için.
 */
export default function MediaReveal({
  children,
  className,
  kenburns = false,
}: {
  children: ReactNode;
  className?: string;
  kenburns?: boolean;
}) {
  const reduced = useReducedMotion();

  if (reduced) {
    return <div className={className}>{children}</div>;
  }

  return (
    <div className={`overflow-hidden ${className ?? ""}`}>
      <motion.div
        initial={{ scale: 1.12, opacity: 0.6 }}
        whileInView={
          kenburns
            ? {
                scale: [1.12, 1, 1.06],
                opacity: 1,
                transition: {
                  scale: {
                    duration: 14,
                    times: [0, 0.12, 1],
                    ease: "linear",
                    repeat: Infinity,
                    repeatType: "reverse",
                  },
                  opacity: { duration: 1.1, ease: EASE },
                },
              }
            : {
                scale: 1,
                opacity: 1,
                transition: { duration: 1.3, ease: EASE },
              }
        }
        viewport={{ once: true, margin: "-80px" }}
      >
        {children}
      </motion.div>
    </div>
  );
}

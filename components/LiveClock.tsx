"use client";

import { useEffect, useState } from "react";

/** Footer'daki alan: "hiç bir metin yazmadan sadece güncel tarih ve saat akışı". */
export default function LiveClock() {
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    const raf = requestAnimationFrame(() => setNow(new Date()));
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => {
      cancelAnimationFrame(raf);
      clearInterval(t);
    };
  }, []);

  if (!now) return <span className="tabular-nums">&nbsp;</span>;

  const date = now.toLocaleDateString("tr-TR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
    weekday: "long",
  });
  const time = now.toLocaleTimeString("tr-TR", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });

  return (
    <span className="tabular-nums" suppressHydrationWarning>
      {date} — {time}
    </span>
  );
}

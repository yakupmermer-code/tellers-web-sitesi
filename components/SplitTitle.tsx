import type { ReactNode } from "react";

/**
 * Marka başlık dili: Avenir kalın lacivert + Didot italik vurgu.
 * Örn: <SplitTitle bold="Veri;" accent="anlamın" boldAfter="kökeni." />
 */
export default function SplitTitle({
  bold,
  accent,
  boldAfter,
  className = "",
  as: Tag = "h2",
}: {
  bold: string;
  accent?: string;
  boldAfter?: string;
  className?: string;
  as?: "h1" | "h2" | "h3";
}) {
  return (
    <Tag
      className={`text-navy font-bold leading-[1.05] tracking-tight ${className}`}
    >
      {bold}{" "}
      {accent && (
        <em className="font-didot font-normal italic">{accent}</em>
      )}
      {boldAfter && <> {boldAfter}</>}
    </Tag>
  );
}

/** Küçük üst etiket (eyebrow). */
export function Eyebrow({ children }: { children: ReactNode }) {
  return (
    <span className="inline-block rounded-full border hairline px-3 py-1 text-[10px] font-medium uppercase tracking-[0.22em] text-navy/70">
      {children}
    </span>
  );
}

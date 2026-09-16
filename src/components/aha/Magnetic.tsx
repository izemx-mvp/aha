import { useRef, useState, type ReactNode } from "react";

/** Wrapper that makes its child follow the cursor slightly (max ~6px). */
export function Magnetic({ children, className = "" }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  return (
    <span
      ref={ref}
      className={`inline-block ${className}`}
      style={{
        transform: `translate3d(${offset.x}px, ${offset.y}px, 0)`,
        transition: offset.x === 0 && offset.y === 0 ? "transform 260ms ease" : "transform 80ms ease",
      }}
      onMouseMove={(e) => {
        const el = ref.current;
        if (!el) return;
        const r = el.getBoundingClientRect();
        const dx = e.clientX - (r.left + r.width / 2);
        const dy = e.clientY - (r.top + r.height / 2);
        const max = 6;
        const norm = Math.max(1, Math.hypot(dx, dy) / 40);
        setOffset({
          x: Math.max(-max, Math.min(max, dx / norm / 3)),
          y: Math.max(-max, Math.min(max, dy / norm / 3)),
        });
      }}
      onMouseLeave={() => setOffset({ x: 0, y: 0 })}
    >
      {children}
    </span>
  );
}

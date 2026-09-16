import { useEffect, useState } from "react";

export function CountUp({
  value,
  duration = 1200,
  suffix = "",
  decimals = 0,
  className = "",
}: {
  value: number;
  duration?: number;
  suffix?: string;
  decimals?: number;
  className?: string;
}) {
  const [display, setDisplay] = useState(0);
  const [done, setDone] = useState(false);

  useEffect(() => {
    setDone(false);
    let raf = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const p = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - p, 3);
      setDisplay(value * eased);
      if (p < 1) raf = requestAnimationFrame(tick);
      else setDone(true);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [value, duration]);

  return (
    <span className={`${className} inline-block ${done ? "pop-once" : ""}`}>
      {display.toFixed(decimals)}
      {suffix}
    </span>
  );
}

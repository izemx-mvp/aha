export function Logo({
  size = 34,
  spin = false,
  className = "",
}: {
  size?: number;
  spin?: boolean;
  className?: string;
}) {
  return (
    <span className={`flex items-center gap-3 ${className}`}>
      <svg
        width={size}
        height={size}
        viewBox="0 0 40 40"
        fill="none"
        aria-hidden="true"
        className={spin ? "aha-spin" : ""}
      >
        <path
          d="M20 2 38 20 20 38 2 20Z"
          stroke="currentColor"
          strokeWidth="1.5"
          fill="none"
          opacity="0.85"
        />
        <circle cx="20" cy="20" r="1.9" fill="currentColor" />
      </svg>
      <span
        className="font-display text-[0.95rem] leading-none font-medium"
        style={{ letterSpacing: "0.42em" }}
      >
        AHA
      </span>
    </span>
  );
}

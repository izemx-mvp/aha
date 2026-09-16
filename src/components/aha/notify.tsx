import { toast } from "sonner";

function AnimatedCheck() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.4" opacity="0.35" />
      <path
        d="M7 12.5 10.5 16 17 8.5"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="draw-check"
      />
    </svg>
  );
}

export function notify(message: string, description?: string) {
  toast.success(message, {
    description,
    icon: <AnimatedCheck />,
  });
}

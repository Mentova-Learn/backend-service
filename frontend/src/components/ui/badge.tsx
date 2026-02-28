import { clsx } from "clsx";

interface BadgeProps {
  children: React.ReactNode;
  bg?: string;
  text?: string;
  className?: string;
}

export function Badge({ children, bg = "bg-violet-100", text = "text-violet-700", className }: BadgeProps) {
  return (
    <span
      className={clsx(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
        bg,
        text,
        className,
      )}
    >
      {children}
    </span>
  );
}

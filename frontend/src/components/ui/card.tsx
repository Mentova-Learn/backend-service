import { clsx } from "clsx";
import type { HTMLAttributes, ReactNode } from "react";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  hover?: boolean;
}

export function Card({ children, hover = false, className, ...props }: CardProps) {
  return (
    <div
      className={clsx(
        "rounded-2xl bg-white shadow-sm border border-gray-100",
        hover && "transition-all duration-200 hover:shadow-md hover:scale-[1.02] hover:border-violet-100",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}

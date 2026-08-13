import * as React from "react";
import { cn } from "@/lib/utils";

export interface ProgressProps extends React.HTMLAttributes<HTMLDivElement> {
  value?: number;
  max?: number;
  variant?: "default" | "emerald" | "amber" | "rose" | "riskGauge";
}

const Progress = React.forwardRef<HTMLDivElement, ProgressProps>(
  ({ className, value = 0, max = 100, variant = "default", ...props }, ref) => {
    const percentage = Math.min(100, Math.max(0, (value / max) * 100));

    const getBarColor = () => {
      if (variant === "emerald") return "bg-emerald-600";
      if (variant === "amber") return "bg-amber-500";
      if (variant === "rose") return "bg-coral-500";
      if (variant === "riskGauge") {
        if (percentage <= 33) return "bg-emerald-600";
        if (percentage <= 66) return "bg-amber-500";
        return "bg-coral-500";
      }
      return "bg-emerald-700";
    };

    return (
      <div
        ref={ref}
        className={cn(
          "relative h-3 w-full overflow-hidden rounded-full bg-slate-100 shadow-inner",
          className
        )}
        {...props}
      >
        <div
          className={cn(
            "h-full w-full flex-1 transition-all duration-500 ease-out rounded-full",
            getBarColor()
          )}
          style={{ transform: `translateX(-${100 - percentage}%)` }}
        />
      </div>
    );
  }
);
Progress.displayName = "Progress";

export { Progress };

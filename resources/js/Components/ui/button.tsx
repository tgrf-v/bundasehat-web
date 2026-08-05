import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-full text-sm font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 active:scale-[0.98]",
  {
    variants: {
      variant: {
        default:
          "bg-rose-500 text-white shadow-soft-sm hover:bg-rose-600 hover:shadow-soft-md",
        rose:
          "bg-rose-500 text-white shadow-soft-sm hover:bg-rose-600 hover:shadow-soft-md",
        emerald:
          "bg-emerald-600 text-white shadow-soft-sm hover:bg-emerald-700 hover:shadow-soft-md",
        pink:
          "bg-pink-500 text-white shadow-soft-sm hover:bg-pink-600 hover:shadow-soft-md",
        destructive:
          "bg-red-600 text-white shadow-soft-sm hover:bg-red-700 hover:shadow-soft-md",
        outline:
          "border border-slate-200 bg-white text-slate-700 shadow-soft-sm hover:bg-pink-50 hover:text-rose-700 hover:border-pink-200",
        secondary:
          "bg-pink-50 text-rose-700 hover:bg-pink-100 border border-pink-100/80",
        roseSecondary:
          "bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-100",
        ghost:
          "text-slate-600 hover:bg-pink-50 hover:text-rose-700",
        link: "text-rose-600 underline-offset-4 hover:underline p-0 h-auto font-medium",
      },
      size: {
        default: "h-11 px-5 py-2.5 rounded-full",
        sm: "h-9 px-4 text-xs rounded-full",
        lg: "h-12 px-7 text-base rounded-full",
        icon: "h-10 w-10 p-0 rounded-full",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  isLoading?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, isLoading = false, children, disabled, ...props }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        disabled={disabled || isLoading}
        {...props}
      >
        {isLoading ? (
          <span className="flex items-center gap-2">
            <Loader2 className="h-4 w-4 animate-spin text-current" />
            <span>Memproses...</span>
          </span>
        ) : (
          children
        )}
      </button>
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };

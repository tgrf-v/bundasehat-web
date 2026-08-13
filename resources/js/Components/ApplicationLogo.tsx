import React from 'react';

interface LogoProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "color" | "white";
}

export default function ApplicationLogo({
  className = "h-8 w-8",
  variant = "color",
  ...props
}: LogoProps) {
  return (
    <div
      className={`rounded-full aspect-square shrink-0 transition-all duration-300 ${
        variant === "white"
          ? "bg-white/30 border border-white/50"
          : "bg-slate-300/90 border border-slate-400/70 shadow-soft-xs"
      } ${className}`}
      {...props}
    />
  );
}

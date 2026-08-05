import React from 'react';

interface LogoProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  variant?: "color" | "white";
}

export default function ApplicationLogo({
  className = "h-10 w-auto",
  variant = "color",
  ...props
}: LogoProps) {
  return (
    <img
      src="/bundasehat-logo.png"
      alt="BundaSehat Logo"
      className={`${className} ${
        variant === "white" ? "brightness-0 invert drop-shadow-sm" : ""
      } transition-all duration-300`}
      {...props}
    />
  );
}

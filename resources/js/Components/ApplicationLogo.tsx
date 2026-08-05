import React from 'react';

export default function ApplicationLogo({ className = "h-10 w-auto", ...props }: React.ImgHTMLAttributes<HTMLImageElement>) {
    return (
        <img
            src="/bundasehat-logo.svg"
            alt="BundaSehat Logo"
            className={className}
            {...props}
        />
    );
}

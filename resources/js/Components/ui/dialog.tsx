import * as React from "react";
import { createPortal } from "react-dom";
import { cn } from "@/lib/utils";
import { X } from "lucide-react";

export interface DialogProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
  showCloseButton?: boolean;
}

const Dialog: React.FC<DialogProps> = ({
  isOpen,
  onClose,
  title,
  description,
  children,
  className,
  showCloseButton = true,
}) => {
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      document.body.style.overflow = "unset";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen || !mounted) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn"
      onClick={onClose}
    >
      <div
        className={cn(
          "relative w-full max-w-lg rounded-3xl bg-white p-6 sm:p-8 shadow-soft-lg border border-slate-100 animate-scaleUp max-h-[90vh] overflow-y-auto",
          className
        )}
        onClick={(e) => e.stopPropagation()}
      >
        {showCloseButton && (
          <button
            onClick={onClose}
            className="absolute right-4 top-4 sm:right-6 sm:top-6 rounded-full p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition-colors"
            aria-label="Tutup Dialog"
          >
            <X className="h-5 w-5" />
          </button>
        )}

        {title && (
          <div className="mb-4 pr-8 border-b border-slate-100 pb-3">
            <h3 className="text-base sm:text-lg font-bold text-slate-900">{title}</h3>
            {description && (
              <p className="mt-1 text-xs text-slate-500 font-medium leading-relaxed">
                {description}
              </p>
            )}
          </div>
        )}

        <div>{children}</div>
      </div>
    </div>,
    document.body
  );
};

export { Dialog };


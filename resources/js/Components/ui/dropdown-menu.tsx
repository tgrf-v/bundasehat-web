import * as React from "react";
import { cn } from "@/lib/utils";

interface DropdownMenuContextType {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const DropdownMenuContext = React.createContext<DropdownMenuContextType | undefined>(undefined);

export function useDropdownMenu() {
  const context = React.useContext(DropdownMenuContext);
  if (!context) {
    throw new Error("useDropdownMenu must be used within a DropdownMenu");
  }
  return context;
}

export interface DropdownMenuProps {
  children: React.ReactNode;
}

export function DropdownMenu({ children }: DropdownMenuProps) {
  const [isOpen, setIsOpen] = React.useState<boolean>(false);
  const containerRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleKeyDown);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  return (
    <DropdownMenuContext.Provider value={{ isOpen, setIsOpen }}>
      <div ref={containerRef} className="relative inline-block text-left">
        {children}
      </div>
    </DropdownMenuContext.Provider>
  );
}

export interface DropdownMenuTriggerProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  asChild?: boolean;
  children: React.ReactNode;
}

export function DropdownMenuTrigger({
  className,
  children,
  onClick,
  ...props
}: DropdownMenuTriggerProps) {
  const { isOpen, setIsOpen } = useDropdownMenu();

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    setIsOpen((prev) => !prev);
    if (onClick) {
      onClick(e);
    }
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-haspopup="true"
      aria-expanded={isOpen}
      className={cn("outline-none select-none", className)}
      {...props}
    >
      {children}
    </button>
  );
}

export interface DropdownMenuContentProps extends React.HTMLAttributes<HTMLDivElement> {
  align?: "start" | "center" | "end";
  children: React.ReactNode;
}

export function DropdownMenuContent({
  align = "start",
  className,
  children,
  ...props
}: DropdownMenuContentProps) {
  const { isOpen } = useDropdownMenu();

  if (!isOpen) return null;

  const alignmentClasses =
    align === "end"
      ? "right-0"
      : align === "center"
      ? "left-1/2 -translate-x-1/2"
      : "left-0";

  return (
    <div
      role="menu"
      className={cn(
        "absolute top-full mt-2 z-50 min-w-[200px] rounded-2xl bg-white p-1.5 text-slate-800 shadow-[0_10px_30px_rgba(0,0,0,0.08)] border border-slate-100/90 outline-none animate-fadeIn",
        alignmentClasses,
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export interface DropdownMenuItemProps extends React.HTMLAttributes<HTMLDivElement> {
  asChild?: boolean;
  children: React.ReactNode;
}

export function DropdownMenuItem({
  className,
  children,
  onClick,
  ...props
}: DropdownMenuItemProps) {
  const { setIsOpen } = useDropdownMenu();

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    setIsOpen(false);
    if (onClick) {
      onClick(e);
    }
  };

  return (
    <div
      role="menuitem"
      onClick={handleClick}
      className={cn(
        "relative flex cursor-pointer items-center rounded-xl px-3 py-2 text-xs font-semibold text-slate-700 outline-none select-none hover:bg-slate-50 hover:text-slate-900 transition-colors",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export function DropdownMenuSeparator({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      role="separator"
      className={cn("-mx-1 my-1 h-px bg-slate-100", className)}
      {...props}
    />
  );
}

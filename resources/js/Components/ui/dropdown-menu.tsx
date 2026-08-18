import * as React from "react";
import { createPortal } from "react-dom";
import { cn } from "@/lib/utils";

interface DropdownMenuContextType {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  triggerRect: DOMRect | null;
  setTriggerRect: (rect: DOMRect | null) => void;
  triggerRef: React.RefObject<HTMLButtonElement>;
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
  const [triggerRect, setTriggerRect] = React.useState<DOMRect | null>(null);
  const triggerRef = React.useRef<HTMLButtonElement>(null);

  React.useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    }

    function handleScrollOrResize() {
      if (isOpen) {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener("keydown", handleKeyDown);
      window.addEventListener("scroll", handleScrollOrResize, true);
      window.addEventListener("resize", handleScrollOrResize);
    }

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("scroll", handleScrollOrResize, true);
      window.removeEventListener("resize", handleScrollOrResize);
    };
  }, [isOpen]);

  return (
    <DropdownMenuContext.Provider
      value={{
        isOpen,
        setIsOpen,
        triggerRect,
        setTriggerRect,
        triggerRef,
      }}
    >
      <div className="relative inline-block text-left">{children}</div>
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
  const { isOpen, setIsOpen, setTriggerRect, triggerRef } = useDropdownMenu();

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (triggerRef.current) {
      setTriggerRect(triggerRef.current.getBoundingClientRect());
    }
    setIsOpen((prev) => !prev);
    if (onClick) {
      onClick(e);
    }
  };

  return (
    <button
      ref={triggerRef}
      type="button"
      onClick={handleClick}
      aria-haspopup="menu"
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
  const { isOpen, setIsOpen, triggerRect, triggerRef } = useDropdownMenu();
  const menuRef = React.useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  React.useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target as Node) &&
        triggerRef.current &&
        !triggerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, setIsOpen, triggerRef]);

  if (!isOpen || !mounted || !triggerRect) return null;

  // Cek apakah posisi dekat bagian bawah layar untuk otomatis buka ke atas
  const isNearBottom = triggerRect.bottom + 180 > window.innerHeight;

  const style: React.CSSProperties = {
    position: "fixed",
    zIndex: 9999,
  };

  if (isNearBottom) {
    style.bottom = `${window.innerHeight - triggerRect.top + 6}px`;
  } else {
    style.top = `${triggerRect.bottom + 6}px`;
  }

  if (align === "end") {
    style.right = `${Math.max(12, window.innerWidth - triggerRect.right)}px`;
  } else if (align === "center") {
    style.left = `${triggerRect.left + triggerRect.width / 2}px`;
    style.transform = "translateX(-50%)";
  } else {
    style.left = `${triggerRect.left}px`;
  }

  return createPortal(
    <div
      ref={menuRef}
      role="menu"
      style={style}
      className={cn(
        "min-w-[160px] rounded-2xl bg-white p-1.5 text-slate-800 shadow-[0_10px_35px_rgba(0,0,0,0.12)] border border-slate-200 outline-none animate-fadeIn",
        className
      )}
      {...props}
    >
      {children}
    </div>,
    document.body
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

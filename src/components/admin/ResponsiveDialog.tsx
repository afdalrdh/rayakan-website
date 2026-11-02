"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { X } from "lucide-react";

const MOBILE_QUERY = "(max-width: 767px)";

function subscribeMedia(callback: () => void) {
  const mq = window.matchMedia(MOBILE_QUERY);
  mq.addEventListener("change", callback);
  return () => mq.removeEventListener("change", callback);
}

/** true di layar HP (< 768px). Aman untuk SSR (server selalu false). */
export function useIsMobile() {
  return useSyncExternalStore(
    subscribeMedia,
    () => window.matchMedia(MOBILE_QUERY).matches,
    () => false,
  );
}

interface ResponsiveDialogProps {
  open: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
  /** Lebar maksimum popup di desktop. */
  widthClass?: string;
}

/**
 * Popup di tengah layar untuk desktop, bottom sheet (bisa ditarik ke bawah
 * untuk menutup) untuk HP.
 */
export function ResponsiveDialog({
  open,
  onClose,
  title,
  description,
  icon,
  children,
  widthClass = "max-w-md",
}: ResponsiveDialogProps) {
  const isMobile = useIsMobile();
  const [dragY, setDragY] = useState(0);
  const [dragging, setDragging] = useState(false);
  const startYRef = useRef<number | null>(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  const header = (
    <div className="flex items-start gap-3">
      {icon ? (
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[9px] bg-red-50 text-rk-bronze">
          {icon}
        </div>
      ) : null}
      <div className="min-w-0 flex-1 pt-0.5">
        <h2 className="text-[15px] font-bold leading-tight text-rk-ink">
          {title}
        </h2>
        {description ? (
          <p className="mt-0.5 truncate text-[12px] text-rk-mute">
            {description}
          </p>
        ) : null}
      </div>
      <button
        type="button"
        onClick={onClose}
        aria-label="Tutup"
        className="-mr-1 -mt-1 flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-rk-mute transition hover:bg-rk-cream cursor-pointer"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );

  if (!isMobile) {
    return (
      <div
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        role="dialog"
        aria-modal="true"
        aria-label={title}
      >
        <div
          className="absolute inset-0 bg-black/40 backdrop-blur-sm rk-fade-in"
          onClick={onClose}
        />
        <div
          className={`relative w-full ${widthClass} max-h-[90vh] overflow-y-auto rounded-[14px] bg-white p-5 shadow-2xl rk-sheet-in`}
        >
          {header}
          <div className="mt-4">{children}</div>
        </div>
      </div>
    );
  }

  const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if ((e.target as HTMLElement).closest("button")) return;
    startYRef.current = e.clientY;
    setDragging(true);
    e.currentTarget.setPointerCapture(e.pointerId);
  };
  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (startYRef.current === null) return;
    setDragY(Math.max(0, e.clientY - startYRef.current));
  };
  const onPointerUp = () => {
    if (startYRef.current === null) return;
    startYRef.current = null;
    setDragging(false);
    if (dragY > 80) onClose();
    setDragY(0);
  };

  return (
    <div className="fixed inset-0 z-50" role="dialog" aria-modal="true" aria-label={title}>
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-xs rk-fade-in"
        style={{ opacity: Math.max(0.15, 1 - dragY / 300) }}
        onClick={onClose}
      />
      <div
        style={{
          transform: `translateY(${dragY}px)`,
          transition: dragging ? "none" : "transform 0.25s cubic-bezier(0.2, 0.8, 0.2, 1)",
        }}
        className="fixed inset-x-0 bottom-0 z-50 max-h-[90vh] overflow-y-auto rounded-t-[22px] border-t border-rk-line bg-white px-5 pb-7 pt-2 shadow-2xl rk-sheet-in"
      >
        <div
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerCancel={onPointerUp}
          className="touch-none select-none cursor-grab active:cursor-grabbing"
        >
          <div className="flex justify-center pb-3 pt-1">
            <div className="h-1.5 w-12 rounded-full bg-rk-line" />
          </div>
          {header}
        </div>
        <div className="mt-4">{children}</div>
      </div>
    </div>
  );
}

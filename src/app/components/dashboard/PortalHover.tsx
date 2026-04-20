/**
 * PortalHover — shared portal-based hover card system.
 *
 * Renders hover content via createPortal into document.body so it is never
 * clipped by any ancestor overflow:hidden or stacking context.
 *
 * Smart horizontal placement:
 *   1. Try RIGHT of trigger element.
 *   2. If that overflows viewport → try LEFT.
 *   3. If that also overflows (e.g. full-width rows) → pin near right viewport edge.
 *
 * Vertical: centre on the trigger row, clamped to viewport.
 */

import { useState, useCallback } from "react";
import { createPortal } from "react-dom";
import type { ReactNode } from "react";

// ─── Constants ────────────────────────────────────────────────────────────────
const OFFSET = 12;   // gap between trigger edge and hover card
const MARGIN = 10;   // minimum distance from any viewport edge

// ─── Keyframe injected once ──────────────────────────────────────────────────
const ANIM_CSS = `
  @keyframes portalHoverIn {
    from { opacity: 0; transform: translateY(3px) scale(0.99); }
    to   { opacity: 1; transform: translateY(0)   scale(1);    }
  }
`;

// ─── Position helpers ─────────────────────────────────────────────────────────
export interface HoverPos {
  top: number;
  left: number;
}

function computePos(rect: DOMRect, cardW: number, cardH: number): HoverPos {
  const vw = window.innerWidth;
  const vh = window.innerHeight;

  // Horizontal ---
  const rightPos = rect.right + OFFSET;
  const leftPos  = rect.left  - cardW - OFFSET;

  let left: number;
  if (rightPos + cardW <= vw - MARGIN) {
    left = rightPos;                  // fits to the right
  } else if (leftPos >= MARGIN) {
    left = leftPos;                   // fits to the left
  } else {
    left = vw - cardW - MARGIN;       // fallback: pin near right viewport edge
  }

  // Vertical: centre on trigger row ---
  let top = rect.top + rect.height / 2 - cardH / 2;
  top = Math.max(MARGIN, Math.min(top, vh - cardH - MARGIN));

  return { top, left };
}

// ─── Hook ─────────────────────────────────────────────────────────────────────
interface UseHoverPortalOptions {
  /** Estimated rendered width of the hover card (px) */
  cardW: number;
  /** Estimated rendered height of the hover card (px) */
  cardH: number;
}

export function useHoverPortal({ cardW, cardH }: UseHoverPortalOptions) {
  const [visible, setVisible] = useState(false);
  const [pos, setPos] = useState<HoverPos>({ top: 0, left: 0 });

  const onMouseEnter = useCallback(
    (el: HTMLElement) => {
      setPos(computePos(el.getBoundingClientRect(), cardW, cardH));
      setVisible(true);
    },
    [cardW, cardH],
  );

  const onMouseLeave = useCallback(() => {
    setVisible(false);
  }, []);

  return { visible, pos, onMouseEnter, onMouseLeave };
}

// ─── Portal card ──────────────────────────────────────────────────────────────
interface PortalCardProps {
  visible: boolean;
  pos: HoverPos;
  width?: number;
  children: ReactNode;
}

export function PortalCard({ visible, pos, width = 240, children }: PortalCardProps) {
  if (!visible) return null;

  return createPortal(
    <div
      style={{
        position: "fixed",
        top: pos.top,
        left: pos.left,
        width,
        zIndex: 9999,
        background: "var(--dash-elevated)",
        border: "1px solid var(--dash-border-strong)",
        borderRadius: 14,
        padding: "12px 14px",
        fontSize: "0.72rem",
        boxShadow: "0 12px 40px rgba(0,0,0,0.26)",
        pointerEvents: "none",
        animation: "portalHoverIn 0.13s ease",
      }}
    >
      <style>{ANIM_CSS}</style>
      {children}
    </div>,
    document.body,
  );
}

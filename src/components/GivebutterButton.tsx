"use client";

import { useEffect, useRef } from "react";

/**
 * Wrapper for the Givebutter button widget.
 *
 * Renders `<givebutter-widget id="..." />`, which the Givebutter
 * loader script (see src/app/layout.tsx) hydrates into a branded
 * donate/register button. The loader may initialize asynchronously,
 * so this component does nothing special beyond mounting the element
 * — the script observes DOM changes and picks up new widgets.
 *
 * Since multiple instances of the same widget id can appear on one
 * page (e.g. a nav CTA + a hero CTA + tier cards), each <GivebutterButton>
 * renders its own <givebutter-widget> element. The loader handles each
 * instance independently.
 */

type Props = {
  /** Givebutter widget id (from the Givebutter dashboard) */
  id: string;
  /** Optional className on the outer wrapper (for sizing/positioning) */
  className?: string;
  /**
   * Visual variant. Default `inline` just drops the widget into the
   * normal document flow. `block` makes the wrapper full-width. The
   * widget itself handles its own visual styling via Givebutter's
   * shadow DOM.
   */
  variant?: "inline" | "block";
};

export default function GivebutterButton({
  id,
  className,
  variant = "inline",
}: Props) {
  const ref = useRef<HTMLDivElement | null>(null);

  // When the loader script is already present (e.g. from a previous
  // page in a client-side navigation), nudge it to scan for new
  // widgets after mount. This is a best-effort hook; the loader will
  // also auto-detect new elements.
  useEffect(() => {
    const w = window as unknown as {
      Givebutter?: { init?: () => void };
    };
    w.Givebutter?.init?.();
  }, []);

  return (
    <div
      ref={ref}
      className={className}
      style={{
        display: variant === "block" ? "block" : "inline-block",
        width: variant === "block" ? "100%" : "auto",
      }}
    >
      <givebutter-widget id={id} />
    </div>
  );
}

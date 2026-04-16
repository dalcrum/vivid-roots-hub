"use client";

import { useEffect, useState } from "react";

const WORDS = ["Come with us.", "Give hope.", "Live vividly."];
const INTERVAL_MS = 2800;
const EXIT_ANIM_MS = 500;

/**
 * Cycles through three italicized taglines in the hero. Renders all three
 * absolutely-positioned and swaps an "active"/"exit" state on a 2.8s timer.
 * The CSS transitions (opacity + translateY) live in the parent page styles.
 */
export default function HeroCycler() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [exitingIndex, setExitingIndex] = useState<number | null>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setExitingIndex((prev) => (prev === null ? activeIndex : prev));
      setActiveIndex((prev) => (prev + 1) % WORDS.length);
      const cleanup = setTimeout(() => setExitingIndex(null), EXIT_ANIM_MS);
      return () => clearTimeout(cleanup);
    }, INTERVAL_MS);
    return () => clearInterval(interval);
  }, [activeIndex]);

  return (
    <span className="cycle-wrap">
      {WORDS.map((word, i) => {
        const state =
          i === activeIndex ? "active" : i === exitingIndex ? "exit" : "";
        return (
          <span key={word} className={`cycle-word ${state}`}>
            <em>{word}</em>
          </span>
        );
      })}
    </span>
  );
}

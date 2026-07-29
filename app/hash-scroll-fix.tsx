"use client";

import { useEffect } from "react";

// Safari ignores scroll-margin-top when a fragment jump is animated by
// scroll-behavior: smooth, so targets land underneath the sticky topbar.
// Chrome honours both, which is why the menu only misbehaves in Safari.
// Scroll manually instead, reading each target's own scroll-margin-top so
// the offsets stay defined in globals.css rather than duplicated here.
export function HashScrollFix() {
  useEffect(() => {
    function handleClick(event: MouseEvent) {
      if (event.defaultPrevented || event.button !== 0) return;
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) {
        return;
      }

      const anchor = (event.target as HTMLElement | null)?.closest("a");
      const href = anchor?.getAttribute("href");
      if (!href || !href.startsWith("#") || href === "#") return;

      const target = document.getElementById(href.slice(1));
      if (!target) return;

      event.preventDefault();

      const offset =
        Number.parseFloat(window.getComputedStyle(target).scrollMarginTop) || 0;
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      const reduceMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;

      window.scrollTo({ top, behavior: reduceMotion ? "auto" : "smooth" });
      window.history.replaceState(null, "", href);
    }

    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, []);

  return null;
}

"use client";

import { useEffect } from "react";

// The topbar's "active" link was a static className on Overview — nothing
// ever updated it, so Systems/Research/Contact never got highlighted after
// being clicked or scrolled to. Track scroll position and toggle the class
// on whichever section's top has passed just below the sticky topbar.
const SECTION_IDS = ["overview", "systems", "research", "contact"];

export function NavActiveTracker() {
  useEffect(() => {
    const nav = document.querySelector('nav[aria-label="Main navigation"]');
    if (!nav) return;

    const links = new Map<string, HTMLAnchorElement>();
    nav.querySelectorAll<HTMLAnchorElement>('a[href^="#"]').forEach((link) => {
      const id = link.getAttribute("href")?.slice(1);
      if (id) links.set(id, link);
    });
    if (links.size === 0) return;

    const sections = SECTION_IDS.map((id) => document.getElementById(id)).filter(
      (el): el is HTMLElement => el !== null,
    );
    if (sections.length === 0) return;

    function setActive(id: string) {
      links.forEach((link, linkId) => {
        link.classList.toggle("active", linkId === id);
      });
    }

    function updateActiveSection() {
      // Compare against each section's own scroll-margin-top rather than a
      // shared header-height line: hash-scroll-fix lands a clicked section
      // at exactly that offset, so the two must agree or the newly active
      // section fails its own threshold right after the click.
      let current = sections[0].id;
      for (const section of sections) {
        const marginTop =
          Number.parseFloat(window.getComputedStyle(section).scrollMarginTop) ||
          0;
        if (section.getBoundingClientRect().top <= marginTop + 1) {
          current = section.id;
        }
      }

      // The last section can't always reach its own scroll-margin-top: if
      // the trailing content (footer) below it is shorter than the topbar
      // offset, the page hits its maximum scroll position first and the
      // section's rect.top never crosses the threshold above. Once the
      // page is scrolled as far as it can go, there's no content left to
      // prove otherwise, so force the last section active.
      const atBottom =
        window.scrollY + window.innerHeight >=
        document.documentElement.scrollHeight - 2;
      if (atBottom) {
        current = sections[sections.length - 1].id;
      }

      setActive(current);
    }

    let ticking = false;
    function onScroll() {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        updateActiveSection();
        ticking = false;
      });
    }

    updateActiveSection();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return null;
}

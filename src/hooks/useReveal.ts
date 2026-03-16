import { useEffect, useRef } from "react";

/**
 * Attaches an IntersectionObserver to a container ref.
 * Children with [data-reveal] start invisible and animate in when visible.
 * Supports stagger via --reveal-delay CSS variable.
 */
export function useReveal<T extends HTMLElement>(options?: { threshold?: number; stagger?: number }) {
  const ref = useRef<T>(null);
  const { threshold = 0.15, stagger = 100 } = options ?? {};

  useEffect(() => {
    const container = ref.current;
    if (!container) return;

    const elements = container.querySelectorAll<HTMLElement>("[data-reveal]");
    if (elements.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const el = entry.target as HTMLElement;
            // Find index among siblings for stagger
            const siblings = Array.from(elements);
            const index = siblings.indexOf(el);
            el.style.setProperty("--reveal-delay", `${index * stagger}ms`);
            el.classList.add("revealed");
            observer.unobserve(el);
          }
        });
      },
      { threshold, rootMargin: "0px 0px -50px 0px" }
    );

    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [threshold, stagger]);

  return ref;
}

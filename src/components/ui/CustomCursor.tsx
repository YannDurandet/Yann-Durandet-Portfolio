import { useEffect, useState } from "react";

export function CustomCursor() {
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [hovered, setHovered] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Don't render on touch devices
    if (window.matchMedia("(pointer: coarse)").matches) return;

    const move = (e: MouseEvent) => {
      setPos({ x: e.clientX, y: e.clientY });
      if (!visible) setVisible(true);
    };

    const addHover = () => setHovered(true);
    const removeHover = () => setHovered(false);

    window.addEventListener("mousemove", move);

    // Watch for interactive elements dynamically
    const observer = new MutationObserver(() => {
      document.querySelectorAll("a, button, [role='button'], input, textarea, select, [data-cursor-hover]").forEach((el) => {
        el.addEventListener("mouseenter", addHover);
        el.addEventListener("mouseleave", removeHover);
      });
    });

    observer.observe(document.body, { childList: true, subtree: true });

    // Initial pass
    document.querySelectorAll("a, button, [role='button'], input, textarea, select, [data-cursor-hover]").forEach((el) => {
      el.addEventListener("mouseenter", addHover);
      el.addEventListener("mouseleave", removeHover);
    });

    return () => {
      window.removeEventListener("mousemove", move);
      observer.disconnect();
    };
  }, [visible]);

  // Don't render on touch / SSR
  if (!visible) return null;

  return (
    <>
      {/* Inner dot */}
      <div
        className="custom-cursor-dot"
        style={{ left: pos.x, top: pos.y }}
      />
      {/* Outer ring */}
      <div
        className={`custom-cursor-ring ${hovered ? "custom-cursor-ring--hover" : ""}`}
        style={{ left: pos.x, top: pos.y }}
      />
    </>
  );
}

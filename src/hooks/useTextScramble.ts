import { useState, useEffect, useCallback } from "react";

const CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%&*";

/**
 * Returns a scrambled version of `text` that progressively resolves
 * to the real text over `duration` ms. Starts when `active` is true.
 */
export function useTextScramble(text: string, active: boolean, duration = 1200) {
  const [display, setDisplay] = useState(text);

  const scramble = useCallback(() => {
    if (!active) {
      setDisplay(text);
      return;
    }

    const length = text.length;
    const startTime = performance.now();

    const tick = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Number of characters resolved so far
      const resolved = Math.floor(progress * length);

      let result = "";
      for (let i = 0; i < length; i++) {
        if (text[i] === " ") {
          result += " ";
        } else if (i < resolved) {
          result += text[i];
        } else {
          result += CHARS[Math.floor(Math.random() * CHARS.length)];
        }
      }

      setDisplay(result);

      if (progress < 1) {
        requestAnimationFrame(tick);
      } else {
        setDisplay(text);
      }
    };

    requestAnimationFrame(tick);
  }, [text, active, duration]);

  useEffect(() => {
    scramble();
  }, [scramble]);

  return display;
}

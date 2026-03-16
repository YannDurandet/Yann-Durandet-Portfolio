import { motion, useMotionValue, useTransform, animate } from "motion/react";
import { useEffect } from "react";

export function LoadingScreen({ onComplete }: { onComplete: () => void }) {
  const count = useMotionValue(0);
  const rounded = useTransform(count, (latest) => Math.round(latest));

  useEffect(() => {
    const controls = animate(count, 4807, { duration: 4.0, ease: [0.22, 1, 0.36, 1] });
    const timer = setTimeout(onComplete, 4500);
    return () => { controls.stop(); clearTimeout(timer); };
  }, []);

  const mountainPath = "M0 100 C 20 100, 40 80, 60 80 L 80 90 L 120 40 L 150 70 L 190 20 L 230 60 L 265 85 L 300 15";

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, y: -50 }}
      transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-bg-secondary text-text-primary"
    >
      <div className="relative w-[300px] flex flex-col items-center">
        <div className="w-full flex justify-between text-xs mb-4 text-text-secondary tracking-wider font-cascadia">
          <span>[ SYSTEM_BOOT ]</span>
          <span>LAT: 45.832 N</span>
        </div>

        <div className="flex items-baseline gap-2 font-cascadia mb-2">
          <span className="text-sm font-bold text-accent self-start mt-2">ALT</span>
          <motion.span className="text-6xl font-bold tracking-tighter">
            {rounded}
          </motion.span>
          <span className="text-xl text-text-secondary">m</span>
        </div>

        <div className="w-full h-[1px] bg-text-primary/20 mb-8 relative overflow-hidden">
          <motion.div
            initial={{ x: "-100%" }}
            animate={{ x: "0%" }}
            transition={{ duration: 4.0, ease: [0.22, 1, 0.36, 1] }}
            className="absolute inset-0 bg-accent w-full h-full"
          />
        </div>

        <div className="relative w-full h-[100px] overflow-hidden">
          <svg viewBox="0 0 300 100" fill="none" preserveAspectRatio="none" className="w-full h-full">
            <motion.path
              d={mountainPath}
              stroke="var(--color-text-primary)"
              strokeWidth="2"
              strokeLinecap="square"
              fill="none"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={{ duration: 4.0, ease: [0.22, 1, 0.36, 1] }}
            />
            <motion.path
              d={mountainPath}
              stroke="var(--color-accent)"
              strokeWidth="1"
              strokeDasharray="4 4"
              fill="none"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 0.5 }}
              transition={{ duration: 4.0, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
            />
            <motion.path
              d={`${mountainPath} L 300 150 L 0 150 Z`}
              fill="url(#loader-gradient)"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 2.5, delay: 1.5 }}
            />
            <defs>
              <linearGradient id="loader-gradient" x1="150" y1="0" x2="150" y2="100" gradientUnits="userSpaceOnUse">
                <stop stopColor="var(--color-text-primary)" stopOpacity="0.1" />
                <stop offset="1" stopColor="var(--color-text-primary)" stopOpacity="0" />
              </linearGradient>
            </defs>
          </svg>
        </div>

        <div className="w-full flex justify-between text-xs mt-4 text-text-secondary font-cascadia uppercase">
          <span>Calibrating...</span>
          <motion.span animate={{ opacity: [1, 0, 1] }} transition={{ repeat: Infinity, duration: 0.8 }}>_</motion.span>
        </div>
      </div>
    </motion.div>
  );
}

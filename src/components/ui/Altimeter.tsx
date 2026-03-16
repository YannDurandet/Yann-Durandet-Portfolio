import { useScroll, useTransform } from "motion/react";
import { useState, useEffect } from "react";

export function Altimeter() {
  const { scrollYProgress } = useScroll();
  const altitude = useTransform(scrollYProgress, [0, 1], [1000, 4807]);
  const [rawAltitude, setRawAltitude] = useState(1000);
  const [unit, setUnit] = useState<'m' | 'ft'>('m');

  useEffect(() => {
    return altitude.on("change", (latest) => {
      setRawAltitude(latest);
    });
  }, [altitude]);

  const displayValue = unit === 'm'
    ? Math.round(rawAltitude)
    : Math.round(rawAltitude * 3.28084);

  return (
    <div
      className="fixed right-6 bottom-12 z-50 hidden md:flex flex-col items-end gap-1 font-cascadia cursor-pointer transition-transform hover:scale-105 active:scale-95"
      onClick={() => setUnit(prev => prev === 'm' ? 'ft' : 'm')}
    >
      <div className="flex items-center gap-2 mb-2 opacity-50">
        <div className="w-1 h-1 bg-accent rounded-full" />
        <div className="w-16 h-[1px] bg-text-primary" />
      </div>

      <div className="bg-bg-primary/90 backdrop-blur-sm border border-text-primary/10 p-3 rounded-lg shadow-lg flex flex-col items-end transition-colors hover:border-accent/30">
        <span className="text-[10px] uppercase tracking-widest text-accent font-bold">
          Elevation
        </span>
        <div className="flex items-baseline gap-1">
          <span className="text-2xl font-bold text-text-primary tabular-nums">
            {displayValue}
          </span>
          <span className="text-xs text-text-secondary font-medium w-4 text-right">{unit}</span>
        </div>
        <div className="w-full flex justify-between items-end mt-2 h-8 gap-1">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="w-[2px] bg-text-primary/20" style={{ height: `${(i + 1) * 20}%` }} />
          ))}
        </div>
      </div>
    </div>
  );
}

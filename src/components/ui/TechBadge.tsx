interface TechBadgeProps {
  text: string;
  align?: "left" | "center" | "right";
  className?: string;
}

export function TechBadge({ text, align = "left", className = "" }: TechBadgeProps) {
  return (
    <div
      className={`flex flex-col ${align === "center" ? "items-center" : align === "right" ? "items-end" : "items-start"} ${className}`}
    >
      <div className="font-cascadia text-xs text-accent tracking-widest uppercase mb-2 flex items-center gap-2">
        <span className="w-2 h-2 border border-accent block" />
        {text}
        <span className="w-8 h-[1px] bg-accent/50 block" />
      </div>
    </div>
  );
}

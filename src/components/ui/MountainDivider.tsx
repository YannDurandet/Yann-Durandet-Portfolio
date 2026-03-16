interface MountainDividerProps {
  fill: string;
  className?: string;
}

export function MountainDivider({ fill, className = "" }: MountainDividerProps) {
  return (
    <div className={`absolute left-0 w-full overflow-hidden leading-none z-20 ${className}`} style={{ bottom: -1 }}>
      <svg
        className="relative block w-[200%] md:w-full h-[40px] md:h-[60px]"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 500 100"
        preserveAspectRatio="none"
      >
        <path
          d="M0,50 L20,40 L40,60 L70,20 L100,50 L130,30 L160,70 L190,40 L220,60 L250,20 L280,50 L310,30 L340,60 L370,40 L400,70 L430,30 L460,60 L500,50 L500,100 L0,100 Z"
          fill={fill}
        />
      </svg>
    </div>
  );
}

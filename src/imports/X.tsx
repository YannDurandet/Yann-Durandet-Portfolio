import { xPath } from "./svg-paths";

export default function X(props: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div {...props}>
      <svg className="block w-full h-full" fill="none" viewBox="0 0 48 48">
        <path d={xPath} fill="currentColor" />
      </svg>
    </div>
  );
}

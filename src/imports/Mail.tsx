import { mailPath } from "./svg-paths";

export default function Mail(props: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div {...props}>
      <svg className="block w-full h-full" fill="none" viewBox="0 0 48 48">
        <path d={mailPath} stroke="currentColor" strokeLinejoin="round" strokeWidth="1.5" />
      </svg>
    </div>
  );
}

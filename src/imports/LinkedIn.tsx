import { linkedInPath } from "./svg-paths";

export default function LinkedIn(props: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div {...props}>
      <svg className="block w-full h-full" fill="none" viewBox="0 0 48 48">
        <path d={linkedInPath} fill="currentColor" />
      </svg>
    </div>
  );
}

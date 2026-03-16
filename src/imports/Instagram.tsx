import { instagramPaths } from "./svg-paths";

export default function Instagram(props: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div {...props}>
      <svg className="block w-full h-full" fill="none" viewBox="0 0 48 48">
        <path clipRule="evenodd" d={instagramPaths.outer} fill="currentColor" fillRule="evenodd" />
        <path clipRule="evenodd" d={instagramPaths.inner} fill="currentColor" fillRule="evenodd" />
      </svg>
    </div>
  );
}

import _imgLogo from "../assets/logo.png";

// Astro returns { src: string } objects for image imports; extract the URL
const imgLogo = typeof _imgLogo === "string" ? _imgLogo : _imgLogo.src;

export default function Logo() {
  return (
    <div className="w-full">
      <img alt="DRNDT Studio" className="block w-full" src={imgLogo} />
    </div>
  );
}

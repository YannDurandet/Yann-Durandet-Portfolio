import imgLogo from "../assets/logo.png";

export default function Logo() {
  return (
    <div className="w-full">
      <img alt="DRNDT Studio" className="block w-full" src={imgLogo} />
    </div>
  );
}

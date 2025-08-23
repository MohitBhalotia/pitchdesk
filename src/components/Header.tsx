import { type FC, } from "react";
import LogoLink from "./LogoLink";

interface Props {
  logoHref: string;
}

const Header: FC<Props> = ({ logoHref }) => {
  const title = "Pitch Desk";

  return (
    <>
      <header className="flex md:hidden m-4 items-center justify-between">
        <LogoLink href={logoHref} />
      </header>
      <header className="hidden md:flex mx-10 my-8 items-center justify-between">
        <div className="flex-1">
          <LogoLink href={logoHref} />
        </div>
        <div className="flex-1 md:block hidden text-center">
          <h2 className="h-10 leading-10 font-favorit align-middle text-gray-25">{title}</h2>
        </div>
      </header>
    </>
  );
};

export default Header;

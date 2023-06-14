import { FC } from "react";
import Link from "next/link";

const Menu: FC = () => {
  return (
    <nav className=" z-0 my-0 w-full h-14 bg-slate-900 text-slate-200 rounded-b-md flex content-center items-center justify-around">
      <Link className="p-2" href={"/about"}>
        About
      </Link>
      <Link className="p-2" href={"/"}>
        Home Page
      </Link>
      <Link className="p-2" href={"/connections"}>
        Connections
      </Link>
      <Link className="p-2" href={"/tickets"}>
        Tickets
      </Link>
    </nav>
  );
};

export default Menu;

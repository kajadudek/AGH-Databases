import { FC } from "react";
import Link from "next/link";

const Menu: FC = () => {
  return (
    <nav className=" z-0 my-0 w-full h-14 bg-slate-900 text-slate-200 rounded-b-md flex content-center items-center justify-around">
      <div className="p-2 ">About</div>
      <div className="p-2">Home Page</div>
      <Link className="p-2" href={"/example"}>
        Example Page
      </Link>
    </nav>
  );
};

export default Menu;

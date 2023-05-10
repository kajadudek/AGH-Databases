import { useUser } from "@auth0/nextjs-auth0/client";
import Link from "next/link";
import { FC, PropsWithChildren } from "react";
import Menu from "./Menu";
import { Dropdown } from "flowbite-react";

export const Layout: FC<PropsWithChildren> = ({ children }) => {
  const { user } = useUser();
  return (
    <div className="container mx-auto">
      <header className="mt-4 z-1 py-4 w-full flex justify-between items-center border-spacing-2 border-cyan-900 border-b-2 bg-inherit h-90 ">
        <h1 className="text-4xl font-logo">Podróżnicy</h1>

        {user ? (
          <div>
            <div className="mr-8 px-8">
              <span className="flex items-center space-x-2 mr-4">
                Hello {user.name}
              </span>
            </div>
            <span>{user.email}</span>
            <Link
              className="bg-slate-900 hover:bg-slate-700 text-white font-bold py-2 px-4 rounded my-0"
              href="/api/auth/logout"
            >
              Logout
            </Link>
          </div>
        ) : (
          <Link
            className="bg-orange-700 hover:bg-slate-900 text-white font-bold py-2 px-4 rounded my-0"
            href="/api/auth/login"
          >
            Login
          </Link>
        )}
      </header>
      <div className="z-0">
        <Menu />
      </div>
      <main>{children}</main>
    </div>
  );
};

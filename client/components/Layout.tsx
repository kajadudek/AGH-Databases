import { useUser } from "@auth0/nextjs-auth0/client";
import Link from "next/link";
import { FC, PropsWithChildren } from "react";

export const Layout: FC<PropsWithChildren> = ({ children }) => {
  const { user } = useUser();
  return (
    <div className="container mx-auto px-4">
      <header className="my-4 flex justify-between items-center">
        <h1 className="text-4xl font-bold">Next.js + Tailwind CSS</h1>
        {user ? (
          <div>
            <span className="flex items-center space-x-2">
              Hello {user.name}
            </span>
            <span>{user.email}</span>
            <Link
              className="rounded-sm p-1 bg-red-600 text-red-50"
              href="/api/auth/logout"
            >
              Logout
            </Link>
          </div>
        ) : (
          <Link
            className="rounded-sm bg-green-600 text-green-50"
            href="/api/auth/login"
          >
            Login
          </Link>
        )}
      </header>
      <main>{children}</main>
    </div>
  );
};

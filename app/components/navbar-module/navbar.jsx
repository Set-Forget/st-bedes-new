"use client";
import React, { useLayoutEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

const Navbar = () => {
  const router = useRouter();

  useLayoutEffect(() => {}, []);

  return (
    <div className="fixed top-0 left-0 w-full flex justify-between items-center px-16 py-8 shadow-sm">
      <div className="font-bold text-lg">St. Bede's College</div>
      <div className="flex space-x-8 items-center">
        <Link href="/" className="text-lg">
          Home
        </Link>
        <Link href="/dashboard" className="text-lg">
          Dashboard
        </Link>
        <button
          className="hidden rounded-md bg-white px-2.5 py-1.5 text-lg font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:block"
          onClick={() => {
            sessionStorage.removeItem("user");
            router.push("/login");
          }}
        >
          Log out
        </button>
      </div>
    </div>
  );
};

export default Navbar;

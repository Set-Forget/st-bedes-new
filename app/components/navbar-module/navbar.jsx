"use client";
import React, { useLayoutEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

const Navbar = () => {
  const router = useRouter();

  useLayoutEffect(() => {}, []);

  return (
    <div className="fixed top-0 left-0 w-full flex justify-between items-center px-16 py-8 shadow-sm">
      <div className="font-bold text-2xl">St. Bede's College</div>
      <div className="flex space-x-8 items-center">
        <Link href="/" className="text-xl">
          Home
        </Link>
        <Link href="/dashboard" className="text-xl">
          Dashboard
        </Link>
        <button
          className="px-4 py-2 rounded hover:bg-red-400 transition-colors text-red-500 text-xl font-bold"
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

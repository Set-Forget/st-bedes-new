"use client";
import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

const Navbar = () => {
  const router = useRouter();

  return (
    <div className="fixed top-0 left-0 w-full flex justify-between items-center px-16 py-8 shadow-sm">
      <div className="font-bold text-xl">St. Bede's College</div>
      <div className="flex space-x-8 items-center">
        <Link href="/">Home</Link>
        <Link href="/dashboard">Dashboard</Link>
        <button
          className="bg-red-600 px-4 py-2 rounded hover:bg-red-400 transition-colors text-white"
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

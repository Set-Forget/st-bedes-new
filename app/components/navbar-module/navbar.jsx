import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

const Navbar = () => {
  const router = useRouter();
  const [windowWidth, setWindowWidth] = useState(0);
  const [showSidebar, setShowSidebar] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    if (windowWidth < 1000) {
      setShowSidebar(true);
    } else {
      setShowSidebar(false);
      setIsSidebarOpen(false);
    }
  }, [windowWidth]);

  const handleLogout = () => {
    sessionStorage.removeItem("user");
    router.push("/login");
  };

  const toggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev);
  };

  if (showSidebar) {
    return (
      <div>
        <div
          className={`fixed top-0 right-0 h-full w-full backdrop-blur-lg  z-50 transform ${
            isSidebarOpen ? "translate-x-0" : "translate-x-full"
          } transition-transform duration-300`}
        >
          <div className="flex flex-col space-y-4 p-4 h-2/3 justify-center">
            <div className="font-bold text-2xl mb-4 self-center">
              St. Bede&apos;s College
            </div>
            <div className="flex flex-col h-1/3 justify-between">
              <Link href="/" className="text-2xl text-center">
                Home
              </Link>
              <Link href="/dashboard" className="text-2xl text-center">
                Dashboard
              </Link>
              <button
                className="rounded-md bg-white px-4 py-1.5 text-md font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 w-1/2 self-center"
                onClick={handleLogout}
              >
                Log out
              </button>
            </div>
          </div>
        </div>
        <button
          className="fixed top-4 right-4 z-50 bg-bedeblue text-white p-2 rounded"
          onClick={toggleSidebar}
        >
          Menu
        </button>
      </div>
    );
  }

  return (
    <div className="absolute z-50 top-0 left-0 w-full flex justify-center items-center px-16 py-8 shadow-sm">
      <div className="flex w-[1367px] justify-between">
        <div className="font-bold text-md">St. Bede&apos;s College</div>
        <div className="flex space-x-8 items-center">
          <Link href="/" className="text-md">
            Home
          </Link>
          <Link href="/dashboard" className="text-md">
            Dashboard
          </Link>
          <button
            className="rounded-md bg-white px-4 py-1.5 text-md font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
            onClick={handleLogout}
          >
            Log out
          </button>
        </div>
      </div>
    </div>
  );
};

export default Navbar;

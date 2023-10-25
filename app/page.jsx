'use client'
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Hero from "./components/home-module/hero";

export default function Home() {
  const [user, setUser] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const userData = JSON.parse(sessionStorage.getItem("user"));

    if (userData) {
      setUser(userData.full_name);
    } else {
      router.push("/login");
    }
  }, []);

  return (
    <main className="h-screen w-screen">
      <Hero username={user}/>
    </main>
  );
}

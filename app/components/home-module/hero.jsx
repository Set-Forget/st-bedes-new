import React, { useEffect, useRef } from "react";
import { arrowAnimation } from "./hero-anims";
import Image from "next/image";
import gradientAbs from "@/public/gradient-abs.png"

const Hero = ({ username }) => {
  const arrowRef = useRef(null);

  useEffect(() => {
    arrowAnimation(arrowRef);
  }, []);

  return (
    <div className="w-screen h-screen overflow-hidden flex flex-col justify-center items-center relative">
      <div className="z-20 hero-main flex flex-col items-center text-center relative">
        <h1 className="welcome-text lg:text-[16vh] text-[6vh] font-black leading-none">{`Welcome`}</h1>
        <h2 className="welcome-text lg:text-[6vh] text-[3.5vh] font-bold">{username}</h2>
        <h3 className="subtitle lg:text-[2vh] text-lg px-8 sm:px-0 mt-8">
          Head over to your dashboard to find your surveys
        </h3>
        {/* <div className="pointer-events-none shape01 absolute bottom-96 left-96 sm:w-[20vw] sm:h-[20vw] w-48 h-48 bg-bedeyellow rounded-full mix-blend-multiply filter blur-2xl opacity-20 animate-blob"></div>
        <div className="pointer-events-none shape02 absolute top-48 left-48 sm:w-[25vw] sm:h-[25vw] w-48 h-48 bg-bedeblue rounded-full mix-blend-multiply filter blur-2xl opacity-20 animate-blob animation-delay-2000"></div> */}
        <svg
          className="-z-10 absolute -top-2 right-20 scale-50 2xl:top-0 2xl:right-20 3xl:scale-100 hidden sm:block"
          xmlns="http://www.w3.org/2000/svg"
          width="630"
          height="379"
          viewBox="0 0 630 379"
          fill="none"
        >
          <path
            ref={arrowRef}
            className="arrow-anim"
            d="M1 373C294.5 335.5 429.919 275.495 306.5 180.5C224 117 168.5 316 367 310C525.8 305.2 611 113.5 611 0"
            fill="none"
            stroke="#D51F1F" 
            strokeWidth="8" 
          />
        </svg>
      </div>
      <Image src={gradientAbs} className="absolute z-10 glowing-effect sm:scale-100 scale-[200%]"/>
    </div>
  );
};

export default Hero;

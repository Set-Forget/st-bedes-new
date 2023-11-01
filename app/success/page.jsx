import Image from "next/image";
import React from "react";
import illustration from "@/public/success-page-illustration.svg";
import Link from "next/link";

const Page = () => {
  return (
    <div className="relative flex flex-col justify-center items-center h-screen overflow-hidden">
      <h1 className="text-2xl lg:text-[6vh] leading-tight text-center mb-4 font-bold">
        Survey Submitted Successfully!
      </h1>
      <p className="text-[2vh] text-center">
        Thank you for taking the time to complete the survey.
      </p>
      <Link className="mt-8 px-4 py-2 bg-bedeblue text-white rounded" href='/dashboard'>
        Return to Dashboard
      </Link>
      <Image
        height={0}
        width={1000}
        src={illustration}
        className="absolute -bottom-8 -right-9 pointer-events-none lg:w-[40vw]"
      />
    </div>
  );
};

export default Page;

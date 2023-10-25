import React from "react";

const Hero = ({username}) => {
  return (
    <div className="w-full h-full flex flex-col justify-center items-center">
      <h1 className="text-[10vh]">
        {`Welcome ${username}`}
      </h1>
      <h2 className="text-[3vh]">
        Head over to your dashboard to find your surveys
      </h2>
      <span className="loading loading-spinner loading-lg"></span>
    </div>
  );
};

export default Hero;

import React, { useEffect, useState } from "react";
import ringSpinner from "@/public/ring-resize-black.svg";
import Image from "next/image";

const SpinnerBlack = () => {
  const [show, setShow] = useState(false);
  useEffect(() => {
    const timer = setTimeout(() => {
      setShow(true);
    }, 4000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center space-y-4">
      <Image height={24} width={24} src={ringSpinner} alt="loading spinner"></Image>
      <div className="h-5">
        <p
          className={`${
            show ? "opacity-100" : "opacity-0"
          } transition-opacity duration-500 text-center`}
        >
          This might take longer than expected, <br/> please wait!
        </p>
      </div>
    </div>
  );
};

export default SpinnerBlack;

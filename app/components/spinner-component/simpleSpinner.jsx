import React, { useEffect, useState } from "react";
import ringSpinner from "@/public/ring-resize-black.svg";
import Image from "next/image";

const SimpleSpinner = () => {

  return (
    <div className="flex flex-col items-center justify-center">
      <Image height={24} width={24} src={ringSpinner}></Image>
    </div>
  );
};

export default SimpleSpinner;

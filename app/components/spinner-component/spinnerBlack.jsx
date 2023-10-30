import React from "react";
import ringSpinner from '@/public/ring-resize-black.svg'
import Image from "next/image";

const SpinnerBlack = () => {
  return (
    <Image height={24} width={24} src={ringSpinner}></Image>
  );
};

export default SpinnerBlack;

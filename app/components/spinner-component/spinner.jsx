import React from "react";
import ringSpinner from '@/public/ring-resize.svg'
import Image from "next/image";

const Spinner = () => {
  return (
    <Image height={24} width={24} src={ringSpinner}></Image>
  );
};

export default Spinner;

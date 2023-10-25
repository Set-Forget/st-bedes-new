import React from "react";

const Hero = ({username}) => {
  return (
    <div>
      <h1>
        {`Welcome, ${username}`}
      </h1>
    </div>
  );
};

export default Hero;

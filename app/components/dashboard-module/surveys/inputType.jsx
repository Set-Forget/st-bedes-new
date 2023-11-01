import React from "react";

const InputType = ({ type, options, register, name }) => {
  switch (type) {
    case "text":
      return <input type="text" {...register(name)} />;
      
    case "select":
      return (
        <select {...register(name)}>
          {options.map((option, index) => (
            <option key={index} value={option}>
              {option}
            </option>
          ))}
        </select>
      );

    default:
      return null;
  }
};

export default InputType;

import React from "react";

const InputType = ({ type, options }) => {
  switch (type) {
    case "text":
      return <input type="text" />;

    case "select":
      return (
        <select>
          {JSON.parse(options).map((option, index) => (
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

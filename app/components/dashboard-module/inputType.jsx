import { useParseOptions } from "@/app/core/hooks/useParseOptions";
import React from "react";

const InputType = ({ type, options }) => {
  const parsedOptions = useParseOptions(options);

  switch (type) {
    case "text":
      return <input type="text" />;

    case "select":
      return (
        <select>
          {parsedOptions.map((option, index) => (
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

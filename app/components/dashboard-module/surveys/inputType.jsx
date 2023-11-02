import React from "react";

const resizeTextarea = (event) => {
  event.target.style.height = "auto";
  event.target.style.height = `${event.target.scrollHeight}px`;
};

const InputType = ({ type, options, register, name }) => {
  switch (type) {
    case "text":
      return (
        <textarea
          {...register(name)}
          className="min-w-[600px] resize-none overflow-hidden transition-all block py-1.5 px-3 border border-gray-300 rounded-md shadow-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-bedeblue sm:text-sm"
          onInput={resizeTextarea}
        />
      );

    case "select":
      return (
        <div className="relative mt-2">
          <select
            {...register(name, { required: "This field is required." })}
            className="block w-full py-1.5 pl-3 pr-10 text-gray-900 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-bedeblue sm:text-sm"
          >
            <option value="" disabled selected>
              Please, select an option
            </option>
            {options.map((option, index) => (
              <option
                key={index}
                value={option}
                className="text-gray-900 cursor-pointer"
              >
                {option}
              </option>
            ))}
          </select>
        </div>
      );

    default:
      return null;
  }
};

export default InputType;

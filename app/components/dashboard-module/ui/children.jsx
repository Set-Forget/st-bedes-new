import React, {useState, useEffect} from "react";

const Children = ({ surveys, onSelect }) => {
  const [children, setChildren] = useState([]);

  useEffect(() => {
    if (Array.isArray(surveys)) {
      const children = surveys.map((survey) => survey.student_full_name);
      setChildren([...new Set(children)]);
    }
  }, [surveys]);

  return (
    <div className="flex flex-col">
      {children.map((child, index) => (
        <button key={index} onClick={() => onSelect(child)}>
          {child}
        </button>
      ))}
    </div>
  );
};
export default Children;

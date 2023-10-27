import React, { useState, useEffect } from "react";

const Subjects = ({ surveys, onSelect }) => {
  const [subjects, setSubjects] = useState([]);

  useEffect(() => {
    if (Array.isArray(surveys)) {
      const schoolSubjects = surveys.map((survey) => survey.subject_name);
      setSubjects([...new Set(schoolSubjects)]);
    }
  }, [surveys]);

  return (
    <div className="flex flex-col">
      {subjects.map((subject, index) => (
        <button key={index} onClick={() => onSelect(subject)}>
          {subject}
        </button>
      ))}
    </div>
  );
};

export default Subjects;

import React, { useEffect, useState } from "react";

export const Teachers = ({ subject, surveys, onSelect }) => {
  const [teachers, setTeachers] = useState([]);

  useEffect(() => {
    if (Array.isArray(surveys)) {
      const relevantSurveys = surveys.filter(
        (survey) => survey.subject_name === subject
      );
      const teacherNames = relevantSurveys.map(
        (survey) => survey.teacher_full_name
      );

      setTeachers([...new Set(teacherNames)]);
    }
  }, [subject, surveys]);

  return (
    <div className="flex flex-col">
      {teachers.map((teacher, index) => (
        <button key={index} onClick={() => onSelect(teacher)}>
          {teacher}
        </button>
      ))}
    </div>
  );
};

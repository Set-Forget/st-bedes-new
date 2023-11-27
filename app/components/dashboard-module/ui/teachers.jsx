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

  const isTeacherSurveyCompleted = (subject, teacher) => {
    const relatedSurveys = surveys.filter(
      (s) => s.subject_name === subject && s.teacher_full_name === teacher
    );
    return relatedSurveys.every((s) => s.is_answered);
  };

  return (
    <ul role="list" className="divide-y divide-gray-200">
      {teachers.map((teacher, index) => (
        <li
          key={index}
          style={{ animationDelay: `${index * 0.125}s` }}
          className="animate-fadeIn flex items-center justify-between sm:gap-x-96 gap-x-36 py-5 opacity-0"
        >
          <div className="min-w-0">
            <div className="flex flex-col items-start gap-x-3">
              <p className="text-sm font-semibold leading-6 text-gray-900">{teacher}</p>
              <div className="flex flex-col">
                <p className="mt-1 text-xs leading-5 text-gray-500">Teacher</p>
                {isTeacherSurveyCompleted(subject, teacher) ? (
                  <span className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs">
                    Completed
                  </span>
                ) : (
                  <span className="bg-yellow-100 text-yellow-700 px-2 py-1 rounded text-xs">
                    Pending
                  </span>
                )}
              </div>
            </div>
          </div>
          <div className="flex flex-none items-center gap-x-4">
            <button
              className="rounded-md bg-white px-2.5 py-1.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 disabled:cursor-not-allowed disabled:bg-gray-100 disabled:text-gray-300"
              onClick={() => onSelect(teacher)}
              disabled={isTeacherSurveyCompleted(subject, teacher)}
            >
              Choose<span className="sr-only">, {teacher}</span>
            </button>
          </div>
        </li>
      ))}
    </ul>
  );
};

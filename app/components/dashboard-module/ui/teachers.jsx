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
    <ul role="list" className="divide-y divide-gray-100">
      {teachers.map((teacher, index) => (
        <li
          key={index}
          className="flex items-center justify-between gap-x-96 py-5"
        >
          <div className="min-w-0">
            <div className="flex items-start gap-x-3">
              <p className="text-sm font-semibold leading-6 text-gray-900">
                {teacher}
              </p>
            </div>
            <p className="mt-1 flex items-center gap-x-2 text-xs leading-5 text-gray-500">
              Teacher
            </p>
            {isTeacherSurveyCompleted(subject, teacher) ? (
              <span className="ml-2 bg-green-100 text-green-700 px-2 py-1 rounded text-xs">
                Completed
              </span>
            ) : (
              <span className="ml-2 bg-yellow-100 text-yellow-700 px-2 py-1 rounded text-xs">
                Pending
              </span>
            )}
          </div>
          <div className="flex flex-none items-center gap-x-4">
            <button
              className="hidden rounded-md bg-white px-2.5 py-1.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:block disabled:cursor-not-allowed disabled:bg-gray-100 disabled:text-gray-300"
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

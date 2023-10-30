import useSurveyStatus from "@/app/core/hooks/useSurveyStatus";
import React, { useState, useEffect } from "react";

export const Subjects = ({ surveys, onSelect }) => {
  const { completeSurveys } = useSurveyStatus(surveys);
  const [subjects, setSubjects] = useState([]);

  useEffect(() => {
    if (Array.isArray(surveys)) {
      const schoolSubjects = surveys.map((survey) => survey.subject_name);
      setSubjects([...new Set(schoolSubjects)]);
    }
  }, [surveys]);

  const isSubjectSurveyCompleted = (subject) => {
    const relatedSurveys = surveys.filter((s) => s.subject_name === subject);
    return relatedSurveys.every((s) => s.is_answered);
  };

  return (
    <ul role="list" className="divide-y divide-gray-100">
      {subjects.map((subject, index) => (
        <li
          key={index}
          className="flex items-center justify-between gap-x-96 py-5"
        >
          <div className="min-w-0">
            <div className="flex items-start gap-x-3">
              <p className="text-sm font-semibold leading-6 text-gray-900">
                {subject}
              </p>
            </div>
            <p className="mt-1 flex items-center gap-x-2 text-xs leading-5 text-gray-500">
              School subject
            </p>
            {isSubjectSurveyCompleted(subject) ? (
              <span className="ml-2 bg-green-200 text-green-800 px-2 py-1 rounded text-xs">
                Completed
              </span>
            ) : (
              <span className="ml-2 bg-yellow-200 text-yellow-800 px-2 py-1 rounded text-xs">
                Pending
              </span>
            )}
          </div>
          <div className="flex flex-none items-center gap-x-4">
            <button
              className="hidden rounded-md bg-white px-2.5 py-1.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:block"
              onClick={() => onSelect(subject)}
            >
              Choose<span className="sr-only">, {subject}</span>
            </button>
          </div>
        </li>
      ))}
    </ul>
  );
};

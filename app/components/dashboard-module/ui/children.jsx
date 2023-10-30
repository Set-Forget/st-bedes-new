import React from "react";

export const Children = ({ surveys, onSelect, pendingSurveys, completedSurveys }) => {
  // Determine the survey status for each child
  const getSurveyStatus = (childId) => {
    if (completedSurveys.some(survey => survey.student_id === childId)) {
      return (
        <span className="ml-2 bg-green-200 text-green-800 px-2 py-1 rounded text-xs">
          Completed
        </span>
      );
    } else if (pendingSurveys.some(survey => survey.student_id === childId)) {
      return (
        <span className="ml-2 bg-yellow-200 text-yellow-800 px-2 py-1 rounded text-xs">
          Pending
        </span>
      );
    }
  };

  return (
    <ul role="list" className="divide-y divide-gray-100">
      {surveys.map((child) => (
        <li
          key={child.id}
          className="flex items-center justify-between gap-x-96 py-5"
        >
          <div className="min-w-0">
            <div className="flex items-start gap-x-3">
              <p className="text-sm font-semibold leading-6 text-gray-900">
                {child.name}
              </p>
            </div>
            <p className="mt-1 flex items-center gap-x-2 text-xs leading-5 text-gray-500">
              Student
            </p>
            {getSurveyStatus(child.id)}
          </div>
          <div className="flex flex-none items-center gap-x-4">
            <button
              className="rounded-md bg-white px-2.5 py-1.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
              onClick={() => onSelect(child)}
            >
              Choose<span className="sr-only">, {child.name}</span>
            </button>
          </div>
        </li>
      ))}
    </ul>
  );
};

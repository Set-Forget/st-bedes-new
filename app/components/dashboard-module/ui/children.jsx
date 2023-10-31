import React from "react";

export const Children = ({
  surveys,
  onSelect,
  pendingSurveys,
  completedSurveys,
}) => {
  // Determine the survey status for each child
  const getSurveyStatus = (childId) => {
    if (completedSurveys.some((survey) => survey.student_id === childId)) {
      return (
        <span className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs text-center">
          Completed
        </span>
      );
    } else if (pendingSurveys.some((survey) => survey.student_id === childId)) {
      return (
        <span className="bg-yellow-100 text-yellow-700 px-2 py-1 rounded text-xs text-center">
          Pending
        </span>
      );
    }
  };

  return (
    <ul role="list" className="divide-y divide-gray-200">
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
            <div className="flex flex-col space-y-8">
              <p className="mt-1 flex items-center gap-x-2 text-xs leading-5 text-gray-500">
                Student
              </p>
              {getSurveyStatus(child.id)}
            </div>
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

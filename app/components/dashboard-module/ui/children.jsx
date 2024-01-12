import React, { useEffect } from "react";

export const Children = ({
  surveys,
  onSelect,
  pendingSurveys,
  completedSurveys,
}) => {
  // Determine if any category has open surveys
  const isAnyCategoryOpen = () => {
    return (
      pendingSurveys.some((survey) => survey.is_open) ||
      completedSurveys.some((survey) => survey.is_open)
    );
  };

  useEffect(() => {
    console.log('SURVEYS IN CHILDREN COMPONENT', surveys);
    console.log('pending', pendingSurveys);
    console.log('completed', completedSurveys);
  }, [surveys])

  const isChildSurveyCompletelyCompleted = (childId) => {
    const sections = ["Section A: Safety, Welfare and Personal Development", "Section B: The quality of education", "Section C"];
    return sections.every(section => {
      const sectionSurveys = [...pendingSurveys, ...completedSurveys].filter(
        survey => survey.student_id === childId && survey.section === section
      );
      // If no surveys are found for this section, it's not completed
      if (sectionSurveys.length === 0) {
        return false;
      }
      // Check if every survey in this section is completed
      return sectionSurveys.every(survey => survey.is_answered);
    });
  };

  const getSurveyStatus = (childId) => {
    return isChildSurveyCompletelyCompleted(childId) ? (
      <span className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs text-center">Completed</span>
    ) : (
      <span className="bg-yellow-100 text-yellow-700 px-2 py-1 rounded text-xs text-center">Pending</span>
    );
  };

  return (
    <div>
      {isAnyCategoryOpen() ? (
        <ul role="list" className="divide-y divide-gray-200">
          {surveys.map((child) => (
            <li
              key={child.id}
              className="flex items-center justify-between sm:gap-x-96 gap-x-36 py-5"
            >
              <div className="min-w-0">
                <div className="flex items-start gap-x-3">
                  <p className="text-sm font-semibold leading-6 text-gray-900">
                    {child.full_name}
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
                  className="rounded-md bg-white px-2.5 py-1.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 disabled:cursor-not-allowed disabled:bg-gray-100 disabled:text-gray-300"
                  onClick={() => onSelect(child)}
                  disabled={isChildSurveyCompletelyCompleted(child.id)}
                >
                  Choose<span className="sr-only">, {child.full_name}</span>
                </button>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <div className="text-center text-sm py-5 bg-gray-100 ring-1 ring-inset ring-gray-300 rounded-md my-12 px-4">
          Surveys are not open
        </div>
      )}
    </div>
  );
};

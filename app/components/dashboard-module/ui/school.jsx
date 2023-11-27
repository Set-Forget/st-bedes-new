export const School = ({ survey, onSelect, filterType }) => {
  const isCompleted = survey.every((question) => question.is_answered);

  // Render condition based on filter type
  if (filterType === 'completed' && !isCompleted) return null;
  if (filterType === 'pending' && isCompleted) return null;

  const getSurveyStatus = () => {
    return isCompleted ? (
      <span className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs">
        Completed
      </span>
    ) : (
      <span className="bg-yellow-100 text-yellow-700 px-2 py-1 rounded text-xs">
        Pending
      </span>
    );
  };

  return (
    <ul role="list" className="divide-y divide-gray-200">
      <li className="flex items-center justify-between sm:gap-x-96 gap-x-36 py-5">
        <div className="min-w-0">
          <div className="flex flex-col items-start gap-x-3">
            <p className="text-sm font-semibold leading-6 text-gray-900">
              School Survey
            </p>
            <div className="flex flex-col">
              <p className="mt-1 text-xs leading-5 text-gray-500">Survey</p>
              {getSurveyStatus()}
            </div>
          </div>
        </div>
        <div className="flex flex-none items-center gap-x-4">
          <button
            className="rounded-md bg-white px-2.5 py-1.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 disabled:cursor-not-allowed disabled:bg-gray-100 disabled:text-gray-300"
            onClick={() => onSelect()}
            disabled={survey.every((question) => question.is_answered)}
          >
            Choose
          </button>
        </div>
      </li>
    </ul>
  );
};

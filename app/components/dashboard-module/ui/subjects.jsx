import React, { useState, useEffect } from "react";

export const Subjects = ({ surveys, onSelect, filterType, isAcademicOpen }) => {
  const [subjects, setSubjects] = useState([]);

  useEffect(() => {
    if (Array.isArray(surveys) && isAcademicOpen) {
      // Group surveys by subject name
      const subjectsMap = surveys.reduce((acc, survey) => {
        const { subject_name } = survey;
        if (subject_name) {
          if (!acc[subject_name]) {
            acc[subject_name] = { questions: [] };
          }
          acc[subject_name].questions.push(survey);
        }
        return acc;
      }, {});
  
      const filteredSubjects = Object.keys(subjectsMap).filter(subject => {
        const subjectData = subjectsMap[subject];
        if (filterType === 'completed') {
          return subjectData.questions.every(q => q.is_answered);
        } else if (filterType === 'pending') {
          return subjectData.questions.some(q => !q.is_answered);
        }
        return true; 
      });
  
      setSubjects(filteredSubjects);
    } else {
      setSubjects([]);
    }
  }, [surveys, filterType, isAcademicOpen]);
  

  const calculateTeacherSurveys = (subject) => {
    const relatedSurveys = surveys.filter((s) => s.subject_name === subject);
    const surveysByTeacher = relatedSurveys.reduce((acc, current) => {
      const { teacher_id, is_answered } = current;
      if (!acc[teacher_id]) {
        acc[teacher_id] = {
          completedQuestions: 0,
          totalQuestions: 0,
        };
      }
      acc[teacher_id].totalQuestions += 1;
      if (is_answered) {
        acc[teacher_id].completedQuestions += 1;
      }
      return acc;
    }, {});

    const completedTeacherSurveys = Object.values(surveysByTeacher).filter(
      (teacher) => teacher.completedQuestions === teacher.totalQuestions
    ).length;

    const totalTeachers = Object.keys(surveysByTeacher).length;

    return { completedTeacherSurveys, totalTeachers };
  };

  const countCompletedSurveys = (subject) => {
    const { completedTeacherSurveys, totalTeachers } =
      calculateTeacherSurveys(subject);
    return `${completedTeacherSurveys}/${totalTeachers}`;
  };

  const isSubjectSurveyCompleted = (subject) => {
    const relatedSurveys = surveys.filter((s) => s.subject_name === subject);
    return relatedSurveys.every((s) => s.is_answered);
  };

  return (
    <div>
      {!isAcademicOpen ? (
        <div className="text-center text-sm py-5 bg-gray-100 ring-1 ring-inset ring-gray-300 rounded-md my-12 px-4">
          Academic surveys are not available right now
        </div>
      ) : (
        <ul role="list" className="divide-y divide-gray-200">
          {subjects.map((subject, index) => {
            if (!subject) return null;

            return (
              <li
                key={index}
                style={{ animationDelay: `${index * 0.125}s` }}
                className="animate-fadeIn flex items-center justify-between sm:gap-x-96 gap-x-36 py-5 opacity-0"
              >
                <div className="min-w-0">
                  <div className="flex flex-col items-start gap-x-3">
                    <p className="text-sm font-semibold leading-6 text-gray-900">
                      {subject}
                    </p>
                    <div className="flex flex-col">
                      <p className="mt-1 text-xs leading-5 text-gray-500">
                        School subject
                      </p>
                      <div className="flex space-x-2 items-center">
                        {isSubjectSurveyCompleted(subject) ? (
                          <span className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs">
                            Completed
                          </span>
                        ) : (
                          <>
                            <span className="bg-yellow-100 text-yellow-700 px-2 py-1 rounded text-xs text-center">
                              Pending
                            </span>
                            <span className="text-xs leading-5 text-gray-500">
                              {countCompletedSurveys(subject)}
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex flex-none items-center gap-x-4">
                  <button
                    className="rounded-md bg-white px-2.5 py-1.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset 
              ring-gray-300  hover:bg-gray-50 disabled:cursor-not-allowed disabled:bg-gray-100 disabled:text-gray-300"
                    onClick={() => onSelect(subject)}
                    disabled={isSubjectSurveyCompleted(subject)}
                  >
                    Choose<span className="sr-only">, {subject}</span>
                  </button>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};

import { useState, useEffect } from "react";

const useSurveyStatus = (surveys) => {
  const [pendingSurveys, setPendingSurveys] = useState([]);
  const [completedSurveys, setCompletedSurveys] = useState([]);

  useEffect(() => {
    const pending = [];
    const completed = [];

    surveys.forEach((survey) => {
      if (survey.type === "select" && !survey.is_answered) {
        pending.push(survey);
      } else if (survey.is_answered) {
        completed.push(survey);
      }
    });

    setPendingSurveys(pending);
    setCompletedSurveys(completed);
  }, [surveys]);

  return { pendingSurveys, completedSurveys };
};

export default useSurveyStatus;

import { useFilterQuestions } from "@/app/core/hooks/useFilterQuestions";

export const SurveyContainer = ({
  selectedSubject,
  selectedTeacher,
  surveys,
}) => {
  const filteredSurveys = useFilterQuestions(selectedSubject, selectedTeacher, surveys);

  return (
    <div>
      <h2>Academic Survey</h2>
      <Questionnaire questions={filteredSurveys} />
    </div>
  );
};

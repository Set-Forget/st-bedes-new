'use client';
import { useDecodedSurveyId } from "@/app/core/hooks/useDecodedSurveyId";
import { useState, useEffect } from "react";
import { getStudentQuestion, getParentQuestion } from "@/app/core/services/api/questions";
import Questionnaire from "@/app/components/dashboard-module/surveys/questionnaire";
import { useCategorizedQuestions } from "@/app/core/hooks/useCategorizedQuestions";
import { useFilterQuestions } from "@/app/core/hooks/useFilterQuestions";

const SurveyPage = () => {
  const { subject, teacher, child } = useDecodedSurveyId(); // Assuming child might be a variable in the URL for parents
  const user = JSON.parse(sessionStorage.getItem("user"));
  const userType = user.student_id ? "student" : "parent";
  const userId = user.student_id || user.parent_id;

  const [questions, setQuestions] = useState([]);

  useEffect(() => {
    async function fetchData() {
      let data;

      if (userType === "student") {
        data = await getStudentQuestion(userId);
      } else if (userType === "parent") {
        data = await getParentQuestion(userId);
      }

      if (data && data.response && data.response.questions) {
        setQuestions(data.response.questions);
      } else {
        console.error("Unexpected data structure:", data);
      }
    }
    fetchData();
  }, [userId, userType]);

  const categorizedQuestions = useCategorizedQuestions(questions, userType);

  let filteredQuestions = [];
  if (userType === "student") {
    const academicSurveys = categorizedQuestions.studentSurveys.academicSurveys;
    filteredQuestions = useFilterQuestions(subject, teacher, academicSurveys);
  } else if (userType === "parent") {
    // This assumes you might have a filtering mechanism for parents. If not, adjust accordingly.
    // For instance, you might filter by child's name or another criteria specific to parents.
    const parentSurveys = [
      ...categorizedQuestions.parentSurveys.sectionA,
      ...categorizedQuestions.parentSurveys.sectionB,
      ...categorizedQuestions.parentSurveys.sectionC,
    ];
    filteredQuestions = parentSurveys; // Add filtering logic here if necessary, e.g., by child's name
  }

  console.log(filteredQuestions);

  return (
    <div>
      <Questionnaire questions={filteredQuestions} />
    </div>
  );
};

export default SurveyPage;

"use client";
import { useDecodedSurveyId } from "@/app/core/hooks/useDecodedSurveyId";
import { useState, useEffect } from "react";
import {
  getStudentQuestion,
  getParentQuestion,
} from "@/app/core/services/api/questions";
import Questionnaire from "@/app/components/dashboard-module/surveys/questionnaire";
import { useCategorizedQuestions } from "@/app/core/hooks/useCategorizedQuestions";
import { useFilterQuestions } from "@/app/core/hooks/useFilterQuestions";

const SurveyPage = () => {
  const { subject, teacher, child } = useDecodedSurveyId();
  const [user, setUser] = useState(() =>
    JSON.parse(sessionStorage.getItem("user"))
  );
  const userType = user.student_id ? "student" : "parent";
  const userId = user.student_id || user.parent_id;

  const [questions, setQuestions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

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
        setIsLoading(false);
      } else {
        console.error("unexpected data structure:", data);
        setIsLoading(false);
      }
    }

    fetchData();
  }, [userId, userType]);

  const categorizedQuestions = useCategorizedQuestions(questions, userType);

  // Initialization
  let filteredQuestions = [];
  let sectionA = [];
  let sectionB = [];
  let sectionC = [];

  if (isLoading) return <div>Loading...</div>;

  // Handling for student and parent user types
  if (userType === "student") {
    const academicSurveys = categorizedQuestions.studentSurveys.academicSurveys;
    filteredQuestions = useFilterQuestions(subject, teacher, academicSurveys);
  } else if (userType === "parent") {
    const childQuestions = questions.filter(
      (question) =>
        question.student_id && question.student_id.toString() === child
    );

    console.log(
      "question id:",
      questions.map((question) => question.student_id)
    );

    sectionA = childQuestions.filter((question) =>
      question.section.startsWith("Section A")
    );
    sectionB = childQuestions.filter((question) =>
      question.section.startsWith("Section B")
    );
    sectionC = childQuestions.filter((question) =>
      question.section.startsWith("Section C")
    );

    filteredQuestions = [...sectionA, ...sectionB, ...sectionC];
  }

  // renders determined content based on type of user currently logged in
  const content =
    userType === "student" ? (
      <Questionnaire questions={filteredQuestions} />
    ) : (
      <>
        <h1>should only be visible to parents</h1>
        {sectionA.length > 0 && (
          <div className="mb-4">
            <h2 className="text-xl font-semibold mb-2">Section A</h2>
            <Questionnaire questions={sectionA} />
          </div>
        )}
        {sectionB.length > 0 && (
          <div className="mb-4">
            <h2 className="text-xl font-semibold mb-2">Section B</h2>
            <Questionnaire questions={sectionB} />
          </div>
        )}
        {sectionC.length > 0 && (
          <div className="mb-4">
            <h2 className="text-xl font-semibold mb-2">Section C</h2>
            <Questionnaire questions={sectionC} />
          </div>
        )}
      </>
    );

  return <div>{content}</div>;
};

export default SurveyPage;

"use client";
import React, { useEffect, useState } from "react";
import {
  getParentQuestion,
  getStudentQuestion,
} from "../core/services/api/questions";
import { useCategorizedQuestions } from "../core/hooks/useCategorizedQuestions";
import Questionnaire from "../components/dashboard-module/surveys/questionnaire";

const Page = () => {
  const user = JSON.parse(sessionStorage.getItem("user"));
  const userType = user.student_id ? "student" : "parent";
  const userId = user.student_id || user.parent_id;
  const [questions, setQuestions] = useState([]);

  useEffect(() => {
    const fetchQuestions = async () => {
      let fetchedQuestions = [];
      if (userType === "student") {
        const data = await getStudentQuestion(userId);
        if (
          data.status === 200 &&
          data.response &&
          Array.isArray(data.response.questions)
        ) {
          fetchedQuestions = data.response.questions;
        }
      } else if (userType === "parent") {
        const data = await getParentQuestion(userId);
        if (
          data.status === 200 &&
          data.response &&
          Array.isArray(data.response.questions)
        ) {
          fetchedQuestions = data.response.questions;
        }
      }
      setQuestions(fetchedQuestions);
    };
    fetchQuestions();
  }, []);

  const categorizedQuestions = useCategorizedQuestions(questions, userType);
  console.log("Categorized Questions:", categorizedQuestions);

  return (
    <div className="flex w-full min-h-screen justify-center items-center">
      <h1>Dashboard</h1>
      <div className="dashboard-content">
        {userType === "student" && (
          <>
            <h2>School Survey</h2>
            <Questionnaire
              questions={categorizedQuestions.studentSurveys.schoolSurvey}
            />

            <h2>Academic Surveys</h2>
            <Questionnaire
              questions={categorizedQuestions.studentSurveys.academicSurveys}
            />
          </>
        )}
        {userType === "parent" && (
          <>
            <h2>Parent Surveys</h2>
            <Questionnaire
              questions={categorizedQuestions.parentSurveys.sectionA}
              title="Section A"
            />
            <Questionnaire
              questions={categorizedQuestions.parentSurveys.sectionB}
              title="Section B"
            />
            <Questionnaire
              questions={categorizedQuestions.parentSurveys.sectionC}
              title="Section C"
            />
          </>
        )}
      </div>
    </div>
  );
};

export default Page;

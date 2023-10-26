import { useCategorizedQuestions } from "@/app/core/hooks/useCategorizedQuestions";
import {
  getParentQuestion,
  getStudentQuestion,
} from "@/app/core/services/api/questions";
import React, { useState, useEffect } from "react";

const Questionnaire = ({ userType, userId }) => {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);

  const categorizedQuestions = useCategorizedQuestions(questions, userType);

  // fetches questions 4 times, must check this useEffect
  // fetch certain questions array depending on current logged user
  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        let questions = [];
        if (userType === "student") {
          const response = await getStudentQuestion(userId);
          questions = response.response.questions;
        } else if (userType === "parent") {
          const response = await getParentQuestion(userId);
          questions = response.response.questions;
        }
        setQuestions(questions);
        setLoading(false);
      } catch (error) {
        console.error("error fetching questions:", error);
        setLoading(false);
      }
    };
    fetchQuestions();
  }, []);

  console.log(questions)

  if (loading) {
    return <div>Loading questions...</div>
  }

  return (
    <div className="questionnaire-container">
      {userType === 'student' ? (
        <>
          <h2>School Survey</h2>
          {categorizedQuestions.schoolSurvey.map((question, index) => (
            <div key={index}>{question.title}</div>
          ))}
          
          <h2>Academic Surveys</h2>
          {categorizedQuestions.academicSurveys.map((question, index) => (
            <div key={index}>{question.title}</div>
          ))}
        </>
      ) : (
        <>
          <h2>Parent Survey - Section A</h2>
          {categorizedQuestions.parentSurveys.sectionA.map((question, index) => (
            <div key={index}>{question.title}</div>
          ))}
  
          <h2>Parent Survey - Section B</h2>
          {categorizedQuestions.parentSurveys.sectionB.map((question, index) => (
            <div key={index}>{question.title}</div>
          ))}
  
          <h2>Parent Survey - Section C</h2>
          {categorizedQuestions.parentSurveys.sectionC.map((question, index) => (
            <div key={index}>{question.title}</div>
          ))}
        </>
      )}
    </div>
  );
};

export default Questionnaire;

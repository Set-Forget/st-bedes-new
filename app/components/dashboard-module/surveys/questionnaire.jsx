import React from "react";
import Question from "./question";
import InputType from "../inputType";

const Questionnaire = ({ questions }) => {
  const renderQuestion = (question) => {
    console.log("Question Options:", question.options);
    console.log("Type of Question Options:", typeof question.options);

    return (
      <div key={question.question_id} className="question-container">
        <Question content={question.content} />
        <InputType type={question.type} options={question.options} />
      </div>
    );
  };

  return (
    <div className="questionnaire-container">
      {questions.map(renderQuestion)}
    </div>
  );
};

export default Questionnaire;

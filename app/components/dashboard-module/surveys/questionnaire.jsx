import React from "react";
import Question from "./question";
import InputType from "./inputType";

const Questionnaire = ({ questions }) => {
  if (!Array.isArray(questions)) {
    return null && console.error("a question may not be the correct format"); 
  }

  const renderQuestion = (question) => {
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

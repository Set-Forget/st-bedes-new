import React, { useState } from "react";
import { useForm } from "react-hook-form";
import Question from "./question";
import InputType from "./inputType";
import {
  postParentAnswers,
  postStudentAnswers,
} from "@/app/core/services/api/save";

const Questionnaire = ({ questions }) => {
  const { register, handleSubmit, getValues } = useForm({ shouldUnregister: false });
  const [user, setUser] = useState(() =>
    JSON.parse(sessionStorage.getItem("user"))
  );
  const userType = user.student_id ? "student" : "parent";
  const [feedbackMessage, setFeedbackMessage] = useState(null);

  const parseOptions = (options) => {
    try {
      return JSON.parse(options);
    } catch (err) {
      console.error("Failed to parse options:", options);
      return [];
    }
  };

  const onSubmit = (data) => {
    console.log("Form values before transform:", getValues());
    const transformedData = questions.map((question) => ({
      row_number: question.row_number,
      student_id: question.student_id,
      question_id: question.question_id,
      answer: data[question.question_id.toString()],
      // Include teacher_id and set_id only for academic surveys and if user is a student
      ...(userType === "student" &&
        question.section !== "School" && {
          teacher_id: question.teacher_id,
          set_id: question.set_id,
        }),
    }));

    console.log("transformed data:", transformedData);

    // Depending on the userType, select the appropriate save function and action string
    const saveFunction =
      userType === "student" ? postStudentAnswers : postParentAnswers;
    const actionString =
      userType === "student" ? "saveStudentAnswers" : "saveParentAnswers";

    const payload = {
      action: actionString,
      data: transformedData,
    };

    console.log("Payload to save:", payload);

    saveFunction(payload)
      .then((response) => {
        if (response.success) {
          setFeedbackMessage("Answers successfully saved!");
        } else {
          setFeedbackMessage(
            "There was an issue saving your answers. Please try again later."
          );
        }
      })
      .catch((error) => {
        console.error(`Couldn't save ${userType} answers:`, error.message);
        setFeedbackMessage(
          "There was an error saving your answers. Please try again later."
        );
      });
  };

  const renderQuestion = (question) => {
    return (
      <div key={question.question_id} className="question-container flex flex-col justify-center space-y-4 mb-8">
        <Question content={question.content} />
        <InputType
          type={question.type}
          // avoid trying to parse null options (text field input)
          options={question.options ? parseOptions(question.options) : []}
          register={register}
          name={question.question_id.toString()}
        />
      </div>
    );
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="questionnaire-container">
      {questions.map(renderQuestion)}
      <button type="submit" className="rounded-md bg-white px-2.5 py-1.5 text-lg font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50">Submit</button>
    </form>
  );
};

export default Questionnaire;

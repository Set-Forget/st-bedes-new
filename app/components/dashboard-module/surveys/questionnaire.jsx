import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import Question from "./question";
import InputType from "./inputType";
import {
  postParentAnswers,
  postStudentAnswers,
} from "@/app/core/api/save";
import SimpleSpinner from "../../spinner-component/simpleSpinner";

const Questionnaire = ({ questions, onSubmitSuccess, allQuestionsForSubject }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ shouldUnregister: false });
  const [user, setUser] = useState(null);

  const hasMultipleTeachers = (questions) => {
    // Check if questions is defined and is an array before proceeding
    if (!questions || !Array.isArray(questions)) {
      return false;  // or handle this scenario appropriately
    }
  
    const teacherIds = questions
      .filter(q => q.teacher_id !== null && q.teacher_id !== undefined)
      .map(q => q.teacher_id);
    
    return new Set(teacherIds).size > 1;
  };
  
  useEffect(() => {
    const storedUser = JSON.parse(sessionStorage.getItem("user"));
    setUser(storedUser || {});
  }, []);

  const userType = user?.student_id ? "student" : "parent";
  const [feedbackMessage, setFeedbackMessage] = useState(null);
  const [loading, setLoading] = useState(false);

  const parseOptions = (options) => {
    try {
      return JSON.parse(options);
    } catch (err) {
      console.error("Failed to parse options:", options);
      return [];
    }
  };

  const onSubmit = (data) => {
    setLoading(true);
    
    const transformedData = questions.map((question) => ({
      row_number: question.row_number,
      student_id: question.student_id,
      question_id: question.question_id,
      answer: data[question.question_id.toString()],
      ...(userType === "student" && question.section !== "School" && {
        teacher_id: question.teacher_id,
        set_id: question.set_id,
      }),
    }));
  
    if (hasMultipleTeachers(allQuestionsForSubject)) {
      const subjectName = questions[0]?.subject_name; 
      sessionStorage.setItem('lastSubmittedSubject', subjectName);
    }
  
    const actionString = userType === "student" ? "saveStudentAnswers" : "saveParentAnswers";
    const jsonValue = JSON.stringify({ action: actionString, data: transformedData });
  
    const payload = {
      triggerId: "api_trigger/RunAPI_API_1",
      inputParameters: {
        postData: {
          jsonValue: jsonValue  // Ensure this is a string
        }
      }
    };
  
    const saveFunction = userType === "student" ? postStudentAnswers : postParentAnswers;
  
    saveFunction(payload)
      .then((response) => {
        // ... handle response
      })
      .catch((error) => {
        // ... handle error
      })
      .finally(() => {
        setLoading(false);
      });
  };
  
  

  const renderQuestion = (question) => {
    return (
      <div
        key={question.question_id}
        className="question-container flex flex-col justify-center space-y-4 mb-8"
      >
        <Question content={question.content} />
        <InputType
          type={question.type}
          // avoid trying to parse null options (text field input)
          options={question.options ? parseOptions(question.options) : []}
          register={register}
          name={question.question_id.toString()}
        />
        {errors[question.question_id.toString()] && (
          <p className="text-sm text-red-500">
            {errors[question.question_id.toString()].message}
          </p>
        )}
      </div>
    );
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="questionnaire-container py-16 sm:px-0 sm:py-0 flex flex-col justify-center"
    >
      {questions.map(renderQuestion)}
      <button
        type="submit"
        className="rounded-md bg-white px-2.5 py-1.5 text-lg font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 self-center mb-16"
      >
        {loading ? <SimpleSpinner /> : "Submit"}
      </button>
    </form>
  );
};

export default Questionnaire;

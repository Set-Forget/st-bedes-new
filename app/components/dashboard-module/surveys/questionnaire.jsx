import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import Question from "./question";
import InputType from "./inputType";
import {
  postParentAnswers,
  postStudentAnswers,
} from "@/app/core/services/api/save";
import { useRouter } from "next/navigation";
import SimpleSpinner from "../../spinner-component/simpleSpinner";

const Questionnaire = ({ questions, onSubmitSuccess }) => {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors },
  } = useForm({ shouldUnregister: false });
  const [user, setUser] = useState();

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
      // Include teacher_id and set_id only for academic surveys and if user is a student
      ...(userType === "student" &&
        question.section !== "School" && {
          teacher_id: question.teacher_id,
          set_id: question.set_id,
        }),
    }));

    // Depending on the userType, select the appropriate save function and action string
    const saveFunction =
      userType === "student" ? postStudentAnswers : postParentAnswers;
    const actionString =
      userType === "student" ? "saveStudentAnswers" : "saveParentAnswers";

    const payload = {
      action: actionString,
      data: transformedData,
    };

    saveFunction(payload)
      .then((response) => {
        if (response.status === 200 || response.status === 201) {
          setFeedbackMessage("Answers successfully saved!");
          if (onSubmitSuccess) onSubmitSuccess();
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
      className="questionnaire-container px-8 py-16 sm:px-0 sm:py-0 flex flex-col"
    >
      {questions.map(renderQuestion)}
      <button
        type="submit"
        className="rounded-md bg-white px-2.5 py-1.5 text-lg font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 self-center"
      >
        {loading ? <SimpleSpinner /> : "Submit"}
      </button>
    </form>
  );
};

export default Questionnaire;

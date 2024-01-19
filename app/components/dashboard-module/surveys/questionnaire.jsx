import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import Question from "./question";
import InputType from "./inputType";
import { postParentAnswers, postStudentAnswers } from "@/app/core/api/save";
import SimpleSpinner from "../../spinner-component/simpleSpinner";
import { Toaster, toast } from "sonner";

const Questionnaire = ({
  questions,
  onSubmitSuccess,
  allQuestionsForSubject,
}) => {
  const [unsavedAnswers, setUnsavedAnswers] = useState({});
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ shouldUnregister: false, defaultValues: unsavedAnswers });
  const [user, setUser] = useState(null);

  const hasMultipleTeachers = (questions) => {
    // Check if questions is defined and is an array before proceeding
    if (!questions || !Array.isArray(questions)) {
      return false; // or handle this scenario appropriately
    }

    const teacherIds = questions
      .filter((q) => q.teacher_id !== null && q.teacher_id !== undefined)
      .map((q) => q.teacher_id);

    return new Set(teacherIds).size > 1;
  };

  useEffect(() => {
    const storedUser = JSON.parse(sessionStorage.getItem("user"));
    setUser(storedUser || {});

    const unsavedAnswers = JSON.parse(localStorage.getItem("unsavedAnswers"));
    if (unsavedAnswers) {
      setUnsavedAnswers(unsavedAnswers);
    }
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

    const answers = questions.map((question) => ({
      row_number: question.row_number,
      student_id: question.student_id,
      question_id: question.question_id,
      set_id: question.set_id,
      teacher_id: question.teacher_id,
      answer: data[question.question_id.toString()],
    }));

    // Prepare the payload as expected by the server
    const payload = {
      action:
        userType === "student" ? "saveStudentAnswers" : "saveParentAnswers",
      data: answers,
    };

    const saveFunction =
      userType === "student" ? postStudentAnswers : postParentAnswers;

    saveFunction(payload.action, payload)
      .then((response) => {
        localStorage.removeItem("unsavedAnswers");
        if (response.status === 200 || response.status === 201) {
          setFeedbackMessage("Answers successfully saved!");
          if (onSubmitSuccess) onSubmitSuccess();
        } else {
          toast.error("Oops! Your answers could not be saved, please refresh and try again");
        }
      })
      .catch((error) => {
        console.error(`Couldn't save ${userType} answers:`, error);
        localStorage.setItem("unsavedAnswers", JSON.stringify(data));
        toast.error("Oops! Your answers could not be saved, please refresh and try again");
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
          options={question.options ? parseOptions(question.options) : []}
          register={register}
          name={question.question_id.toString()}
          answer={question.answer}
        />
        {errors[question.question_id.toString()] && (
          <p className="text-sm text-red-500">
            {errors[question.question_id.toString()].message}
          </p>
        )}
      </div>
    );
  };

  const sortedQuestions = [...questions].sort(
    (a, b) => a.row_number - b.row_number
  );
  console.log(sortedQuestions, "SORTED");
  console.log(questions, "NOT SORTED");

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="questionnaire-container py-16 sm:px-0 sm:py-0 flex flex-col justify-center"
    >
      {sortedQuestions.map(renderQuestion)}
      <button
        type="submit"
        className="rounded-md bg-white px-2.5 py-1.5 text-lg font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 self-center mb-16"
      >
        {loading ? <SimpleSpinner /> : "Submit"}
      </button>
      <Toaster richColors position="bottom-center" />
    </form>
  );
};

export default Questionnaire;

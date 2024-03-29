"use client";
import { useDecodedSurveyId } from "@/app/core/hooks/useDecodedSurveyId";
import { useState, useEffect } from "react";
import {
  getStudentQuestion,
  getParentQuestion,
} from "@/app/core/api/questions";
import Questionnaire from "@/app/components/dashboard-module/surveys/questionnaire";
import { useCategorizedQuestions } from "@/app/core/hooks/useCategorizedQuestions";
import { useFilterQuestions } from "@/app/core/hooks/useFilterQuestions";
import SpinnerBlack from "@/app/components/spinner-component/spinnerBlack";
import Navbar from "@/app/components/navbar-module/navbar";
import { useRouter } from "next/navigation";
import { Breadcrumbs } from "@/app/components/dashboard-module/ui/breadcrumbs";

const SurveyPage = () => {
  const isBrowser = typeof window !== "undefined";

  const [user, setUser] = useState(() => {
    if (isBrowser) {
      const storedUser = sessionStorage.getItem("user");
      return storedUser ? JSON.parse(storedUser) : {};
    }
    return {};
  });

  const router = useRouter();
  const userType = user.student_id ? "student" : "parent";
  const userId = user.student_id || user.parent_id;
  const { subject, teacher, child } = useDecodedSurveyId();
  const [questions, setQuestions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState("A");

  useEffect(() => {
    if (isBrowser) {
      const storedUser = sessionStorage.getItem("user");
      // ff there's no user in sessionStorage, redirect to the login page
      if (!storedUser) {
        router.push("/login");
      }
    }
  }, [isBrowser, router]);

  useEffect(() => {
    // ignore parent accounts
    if (userType === "parent") {
      return;
    }

    // splits url
    const pathParts = window.location.pathname.split("/");

    if (
      pathParts[1] === "dashboard" &&
      pathParts.length === 3 &&
      pathParts[2].includes("-")
    ) {
      return; // This URL is to be ignored for 'student' type
    }

    // ff userType is student, ensure the userId from the session matches the userId in the URL
    if (userType === "student") {
      const userIdFromUrl = pathParts[2]; // Assuming the user ID is the last part of the path
      if (userId.toString() !== userIdFromUrl) {
        alert("You do not have permission to view this survey.");
        router.push("/dashboard");
      }
    }
  }, [userId, userType, router]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        let response;

        if (userType === "student") {
          response = await getStudentQuestion(userId);
        } else if (userType === "parent") {
          response = await getParentQuestion(userId);
        }

        console.log("Response from API:", response);

        let questions;
        if (
          userType === "student" &&
          response &&
          response.response &&
          response.response.questions
        ) {
          questions = response.response.questions;
        } else if (userType === "parent" && response && response.length) {
          questions = response; // Use response directly for parent questions
        } else {
          // Handle any case where the response is not as expected
          setQuestions([]);
          console.error("Unexpected API response structure:", response);
          return;
        }

        setQuestions(questions);
      } catch (error) {
        console.error("SurveyPage fetch data error:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [userId, userType]);

  const categorizedQuestions = useCategorizedQuestions(questions, userType);
  const schoolSurvey = categorizedQuestions.studentSurveys.schoolSurvey;
  const academicSurveys = categorizedQuestions.studentSurveys.academicSurveys;
  let filteredQuestions = useFilterQuestions(subject, teacher, academicSurveys);
  const allQuestionsForSubject = questions.filter(
    (q) => q.subject_name === subject
  );
  let sectionA = [];
  let sectionB = [];
  let sectionC = [];

  // Handling for student and parent user types
  if (userType === "student") {
    console.log("Filtered Questions for Academic Surveys:", filteredQuestions);
  } else if (userType === "parent") {
    const childQuestions = questions.filter(
      (question) =>
        question.student_id && question.student_id.toString() === child
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

  // handles parent user pagination, upon submit of the last section, push to /success page
  const handleQuestionnaireSubmit = (section) => {
    if (section === "A") {
      setCurrentPage("B");
    } else if (section === "B") {
      setCurrentPage("C");
    } else if (section === "C") {
      router.push("/success");
    }
    window.scrollTo(0, 0);
  };

  const handleStudentQuestionnaireSubmit = () => {
    router.push("/success");
  };

  let sectionQuestions;
  if (currentPage === "A") {
    sectionQuestions = sectionA;
  } else if (currentPage === "B") {
    sectionQuestions = sectionB;
  } else if (currentPage === "C") {
    sectionQuestions = sectionC;
  }

  const sectionTitles = {
    A: "Safety, Welfare and Personal Development",
    B: "The quality of education",
    C: "Additional comments",
  };

  // renders determined content based on type of user currently logged in
  let content;

  if (subject === "School" && userType === "student") {
    content = (
      <div>
        <h2
          className={`text-4xl font-bold my-8 p-8 sm:p-0`}
        >{`School Survey`}</h2>
        <h3 className="text-2xl mb-8 p-8">
          Choose an option that best describes your feelings
        </h3>
        <Questionnaire
          questions={schoolSurvey}
          onSubmitSuccess={() => handleStudentQuestionnaireSubmit()}
        />
      </div>
    );
  } else if (subject !== "School" && userType === "student") {
    content = (
      <div>
        <h2
          className={`text-4xl font-bold sm:my-8 py-8`}
        >{`${teacher} - ${subject}`}</h2>
        <h3 className="text-2xl sm:mb-8 font-semibold">
          Choose an option that best describes your feelings
        </h3>
        <Questionnaire
          questions={filteredQuestions}
          onSubmitSuccess={() => handleStudentQuestionnaireSubmit()}
          allQuestionsForSubject={allQuestionsForSubject}
        />
      </div>
    );
  } else if (userType === "parent") {
    content = (
      <div className="">
        <h2 className={`text-4xl font-bold sm:my-8 py-8`}>
          Section {currentPage}
        </h2>
        <h3 className="text-2xl sm:mb-8 font-semibold underline">
          {sectionTitles[currentPage]}
        </h3>
        <div className="self-center">
          <Questionnaire
            questions={sectionQuestions}
            onSubmitSuccess={() => handleQuestionnaireSubmit(currentPage)}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen w-full flex flex-col justify-center items-center overscroll-x-hidden px-8">
      <Navbar />
      {isLoading && <SpinnerBlack />}
      {!isLoading && (
        <div className="h-full mt-48">
          {userType === "parent" && (
            <div className="flex flex-col">
              <p className="self-center">{localStorage.getItem("childName")}</p>
              <Breadcrumbs currentPage={currentPage} />
            </div>
          )}
          {content}
        </div>
      )}
    </div>
  );
};

export default SurveyPage;

"use client";
import React, { useEffect, useState, useMemo } from "react";
import { Subjects } from "../components/dashboard-module/ui/subjects";
import { Teachers } from "@/app/components/dashboard-module/ui/teachers";
import { Children } from "../components/dashboard-module/ui/children";
import {
  getStudentQuestion,
  getParentQuestion,
} from "@/app/core/api/questions";
import { useRouter } from "next/navigation";
import { useCategorizedQuestions } from "../core/hooks/useCategorizedQuestions";
import Navbar from "../components/navbar-module/navbar";
import SpinnerBlack from "../components/spinner-component/spinnerBlack";
import useSurveyStatus from "../core/hooks/useSurveyStatus";
import { School } from "../components/dashboard-module/ui/school";
import { Toaster, toast } from "sonner";

const DashboardPage = () => {
  const [user, setUser] = useState({});

  useEffect(() => {
    localStorage.removeItem("childName");
    const storedUser = JSON.parse(sessionStorage.getItem("user"));
    if (storedUser) {
      setUser(storedUser || {});
    } else {
      router.push("/login");
    }
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const lastSubject = sessionStorage.getItem("lastSubmittedSubject");
      if (lastSubject) {
        setSelectedSubject(lastSubject);
        sessionStorage.removeItem("lastSubmittedSubject");
      }
    }
  }, []);

  const userType = user?.student_id ? "student" : "parent";
  const userId = user?.student_id || user?.parent_id;

  const router = useRouter();

  const [surveys, setSurveys] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [selectedTeacher, setSelectedTeacher] = useState(null);
  const [selectedChild, setSelectedChild] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filterType, setFilterType] = useState("all");
  const [isAcademicOpen, setIsAcademicOpen] = useState(true);
  const [isSchoolOpen, setIsSchoolOpen] = useState(true);

  const categorizedQuestions = useCategorizedQuestions(surveys, userType);
  const academicSurveys = categorizedQuestions.studentSurveys.academicSurveys;
  const { schoolSurvey } = categorizedQuestions.studentSurveys;
  const allParentSurveys = useMemo(
    () => [
      ...categorizedQuestions.parentSurveys.sectionA,
      ...categorizedQuestions.parentSurveys.sectionB,
      ...categorizedQuestions.parentSurveys.sectionC,
    ],
    [categorizedQuestions]
  );

  console.log("All student surveys", surveys);

  const uniqueChildren = useMemo(() => {
    const allChildren = allParentSurveys.map((survey) => ({
      id: survey.student_id,
      full_name: survey.full_name,
    }));
    const uniqueIds = Array.from(new Set(allChildren.map((child) => child.id)));
    return uniqueIds.map((id) => {
      const foundChild = allChildren.find((child) => child.id === id);
      return {
        id,
        full_name: foundChild ? foundChild.full_name : "Name not found",
      };
    });
  }, [allParentSurveys]);

  // fetch all questions based on the type of user logged in
  useEffect(() => {
    if (!userId) return;

    const fetchData = async () => {
      try {
        setLoading(true);
        let response;

        if (userType === "student") {
          response = await getStudentQuestion(userId);
          console.log("NEW RESPONSE", response);
          setIsAcademicOpen(response.response.is_academic_open);
          setIsSchoolOpen(response.response.is_school_open);
        } else if (userType === "parent") {
          response = await getParentQuestion(userId);
        }

        let questions;
        if (
          userType === "student" &&
          response &&
          response.response &&
          response.response.questions
        ) {
          questions = response.response.questions;
        } else if (userType === "parent" && response && response.length) {
          questions = response;
        } else {
          // Handle any case where the response is not as expected
          setSurveys([]);
          console.error("Unexpected API response structure:", response);
          return;
        }

        setSurveys(questions);
        toast.info("Remember, all surveys are anonymous!");
      } catch (error) {
        setError(error.message);
        console.error("Dashboard fetch data error:", error);
      } finally {
        setLoading(false);
      }
    };

    if (userId && userType) {
      fetchData();
    }
  }, [userId, userType]);

  const { pendingSurveys, completedSurveys } = useSurveyStatus(surveys);
  const hasCompletedSurveys = completedSurveys.length > 0;

  // groups questions by set id, for progress bar counter
  const groupQuestionsBySetId = (questions) => {
    return questions.reduce((acc, question) => {
      const setId = question.set_id;
      if (!acc[setId]) {
        acc[setId] = [];
      }
      acc[setId].push(question);
      return acc;
    }, {});
  };

  // Determine if a survey (group of questions) is completed
  const isSurveyCompleted = (questions) => {
    return questions.every((question) => question.is_answered);
  };

  // Group the surveys by set_id
  const groupedSurveys = groupQuestionsBySetId(surveys);

  // Count completed and total surveys
  const totalSurveysCount = Object.keys(groupedSurveys).length;
  const completedSurveysCount =
    Object.values(groupedSurveys).filter(isSurveyCompleted).length;

  // Display text for the progress bar
  const progressBarDisplay = `${completedSurveysCount}/${totalSurveysCount} surveys completed`;

  // handles routing to dynamic survey page depending on the user type and their selections
  useEffect(() => {
    if (selectedSubject === "School" && userType === "student") {
      router.push(`/dashboard/School-${userId}`);
    } else if (selectedSubject && selectedTeacher) {
      const surveyId = `${selectedSubject}-${selectedTeacher}`;
      router.push(`/dashboard/${surveyId}`);
    } else if (userType === "parent" && selectedChild) {
      router.prefetch(`/dashboard/${selectedChild.id}`);
      router.push(`/dashboard/${selectedChild.id}`);
      localStorage.setItem("childName", selectedChild.name);
    }
  }, [selectedTeacher, selectedSubject, selectedChild]);

  // reset selection handler for simpler navigation
  const resetSubjectSelection = () => {
    setSelectedSubject(null);
    setSelectedTeacher(null);
  };

  // checks if the school survey is completed, only for design purposes
  const isSchoolSurveyCompleted = schoolSurvey.every(
    (question) => question.is_answered
  );

  // rendered content based on user type
  const content = useMemo(() => {
    let displayedSurveys;
    if (filterType === "completed") {
      displayedSurveys = surveys.filter((survey) => survey.is_answered);
    } else if (filterType === "pending") {
      displayedSurveys = surveys.filter((survey) => !survey.is_answered);
    } else {
      displayedSurveys = surveys;
    }

    const showSchoolHeader =
      filterType === "all" ||
      (filterType === "completed" && isSchoolSurveyCompleted) ||
      (filterType === "pending" && !isSchoolSurveyCompleted);

    if (userType === "student") {
      return (
        <div className="flex flex-col overflow-x-hidden py-32">
          {userType === "student" && !selectedSubject && showSchoolHeader && (
            <h2 className="font-bold text-2xl">School</h2>
          )}

          {userType === "student" && !selectedSubject && (
            <School
              survey={schoolSurvey}
              onSelect={() => setSelectedSubject("School")}
              filterType={filterType}
              isSchoolOpen={isSchoolOpen}
            />
          )}

          <h2
            className={`font-bold text-2xl ${
              selectedTeacher ? "opacity-0" : "opacity-100"
            }`}
          >
            Academic
          </h2>
          {!selectedSubject && (
            <>
              {loading && <SpinnerBlack />}
              <Subjects
                surveys={displayedSurveys}
                onSelect={setSelectedSubject}
                filterType={filterType}
                isAcademicOpen={isAcademicOpen}
              />
            </>
          )}

          {selectedSubject && !selectedTeacher && (
            <>
              <Teachers
                subject={selectedSubject}
                surveys={academicSurveys}
                onSelect={setSelectedTeacher}
              />
              <button
                onClick={resetSubjectSelection}
                className="hidden rounded-md bg-white px-2.5 py-1.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:block mt-4 self-center"
              >
                Choose a different subject
              </button>
            </>
          )}
        </div>
      );
    } else if (userType === "parent") {
      return (
        <div className="overflow-x-hidden">
          <h2 className="font-bold text-2xl">Your children&apos;s surveys</h2>
          <Children
            surveys={uniqueChildren}
            onSelect={setSelectedChild}
            pendingSurveys={pendingSurveys}
            completedSurveys={completedSurveys}
          />
        </div>
      );
    }
  }, [
    filterType,
    surveys,
    userType,
    selectedSubject,
    selectedTeacher,
    uniqueChildren,
    completedSurveysCount,
    totalSurveysCount,
    isSchoolSurveyCompleted,
  ]);

  if (error) return <p>Oops, something unexpected happened: {error}</p>;

  return (
    <div className="relative w-full min-h-screen flex flex-col items-center overscroll-x-hidden">
      <Navbar />
      {loading && (
        <div className="absolute top-0 left-0 flex justify-center items-center min-h-screen w-full">
          <SpinnerBlack />
        </div>
      )}
      {!loading && (
        <>
          <div
            className={`flex flex-col items-center w-full ${
              userType === "parent" ? "pt-48" : ""
            }`}
          >
            {userType === "student" && (
              <div className=" top-0 w-4/5 sm:w-[548px] pt-48">
                {!selectedSubject && (
                  <div className="max-w-screen-lg mx-auto">
                    {/* progress bar */}
                    <div className="mb-4">
                      <p className="text-xs">{progressBarDisplay}</p>
                      <div className="w-full bg-gray-300 rounded-full h-2">
                        <div
                          className="bg-gray-700 h-2 rounded-full"
                          style={{
                            width: `${
                              (completedSurveysCount / totalSurveysCount) * 100
                            }%`,
                          }}
                        ></div>
                      </div>
                    </div>

                    {/* filter buttons */}
                    <div className="flex space-x-2 text-xs">
                      <button
                        onClick={() => setFilterType("all")}
                        className={`px-3 py-1 rounded ${
                          filterType === "all"
                            ? "bg-bedeblue text-white"
                            : "bg-gray-200"
                        }`}
                      >
                        All
                      </button>
                      <button
                        onClick={() => setFilterType("completed")}
                        className={`px-3 py-1 rounded disabled:cursor-not-allowed disabled:bg-gray-100 disabled:text-gray-300 ${
                          filterType === "completed"
                            ? "bg-bedeblue text-white"
                            : "bg-gray-200"
                        }`}
                        disabled={!hasCompletedSurveys}
                      >
                        Completed
                      </button>
                      <button
                        onClick={() => setFilterType("pending")}
                        className={`px-3 py-1 rounded ${
                          filterType === "pending"
                            ? "bg-bedeblue text-white"
                            : "bg-gray-200"
                        }`}
                      >
                        Pending
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            <div className="flex flex-col w-full">
              <div className="max-w-screen-lg mx-auto p-4">{content}</div>
            </div>
          </div>
        </>
      )}
      <Toaster position="bottom-center" />
    </div>
  );
};

export default DashboardPage;

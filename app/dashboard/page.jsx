"use client";
import React, { useEffect, useState, useMemo } from "react";
import { Subjects } from "../components/dashboard-module/ui/subjects";
import { Teachers } from "@/app/components/dashboard-module/ui/teachers";
import { Children } from "../components/dashboard-module/ui/children";
import {
  getStudentQuestion,
  getParentQuestion,
} from "@/app/core/services/api/questions";
import { useRouter } from "next/navigation";
import { useCategorizedQuestions } from "../core/hooks/useCategorizedQuestions";
import Navbar from "../components/navbar-module/navbar";
import SpinnerBlack from "../components/spinner-component/spinnerBlack";
import useSurveyStatus from "../core/hooks/useSurveyStatus";
import { School } from "../components/dashboard-module/ui/school";

const DashboardPage = () => {
  const [user, setUser] = useState({});

  useEffect(() => {
    const storedUser = JSON.parse(sessionStorage.getItem("user"));
    setUser(storedUser || {});
  }, []);

  const userType = user?.student_id ? "student" : "parent";
  const userId = user?.student_id || user?.parent_id;

  console.log("user id:", userId);
  const router = useRouter();

  const [surveys, setSurveys] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [selectedTeacher, setSelectedTeacher] = useState(null);
  const [selectedChild, setSelectedChild] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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

  const uniqueChildren = useMemo(() => {
    const allChildren = allParentSurveys.map((survey) => ({
      id: survey.student_id,
      name: survey.student_full_name,
    }));
    return Array.from(new Set(allChildren.map((child) => child.id))).map((id) =>
      allChildren.find((child) => child.id === id)
    );
  }, [allParentSurveys]);

  // fetch all questions based on the type of user logged in
  useEffect(() => {
    const fetchData = async () => {
      try {
        let data;
        if (userType === "student") {
          data = await getStudentQuestion(userId);
        } else if (userType === "parent") {
          data = await getParentQuestion(userId);
        }

        setSurveys(data.response.questions || []);
        setLoading(false);
      } catch (error) {
        setError(error.message);
        setLoading(false);
        console.error("dashboard fetch data error:", error);
      }
    };

    fetchData();
  }, [userId, userType]);

  const { pendingSurveys, completedSurveys } = useSurveyStatus(surveys);

  // console.log("surveys before using the useSurveyStatus:", surveys);
  // console.log("pending surveys:", pendingSurveys);
  // console.log("completed surveys:", completedSurveys);
  // console.log("school survey", {schoolSurvey});
  // console.log("school survey", schoolSurvey);

  useEffect(() => {
    if (selectedSubject === "School" && userType === "student") {
      router.push(`/dashboard/School-${userId}`);
    } else if (selectedSubject && selectedTeacher) {
      const surveyId = `${selectedSubject}-${selectedTeacher}`;
      router.push(`/dashboard/${surveyId}`);
    } else if (userType === "parent" && selectedChild) {
      router.push(`/dashboard/${selectedChild.id}`);
    }
  }, [
    userType,
    selectedTeacher,
    selectedSubject,
    selectedChild,
    router,
    userId,
  ]);

  // reset selection handler for simpler navigation
  const resetSubjectSelection = () => {
    setSelectedSubject(null);
    setSelectedTeacher(null);
  };
  // rendered content based on user type
  const content = useMemo(() => {
    if (userType === "student") {
      return (
        <div className="flex flex-col overflow-x-hidden py-64">
          {!selectedSubject && (
            <>
              <h2 className="font-bold text-2xl">School</h2>
              <School
                survey={schoolSurvey}
                onSelect={() => setSelectedSubject("School")}
              />
            </>
          )}

          <h2 className="font-bold text-2xl">Academic</h2>
          {!selectedSubject && (
            <Subjects surveys={academicSurveys} onSelect={setSelectedSubject} />
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
          <h2 className="font-bold text-2xl">Select a Child</h2>
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
    userType,
    academicSurveys,
    selectedSubject,
    selectedTeacher,
    uniqueChildren,
  ]);

  if (error) return <p>Oops, something unexpected happened: {error}</p>;

  return (
    <div className="relative flex flex-col justify-center items-center w-full min-h-screen overscroll-x-hidden">
      <Navbar />
      {loading && <SpinnerBlack />}
      {!loading && <div className="content-container">{content}</div>}
    </div>
  );
};

export default DashboardPage;

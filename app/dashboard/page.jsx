"use client";
import React, { useEffect, useState } from "react";
import Subjects from "@/app/components/dashboard-module/ui/subjects";
import { Teachers } from "@/app/components/dashboard-module/ui/teachers";
import Children from "../components/dashboard-module/ui/children";
import {
  getStudentQuestion,
  getParentQuestion,
} from "@/app/core/services/api/questions";
import { useRouter } from "next/navigation";
import { useCategorizedQuestions } from "../core/hooks/useCategorizedQuestions";

const DashboardPage = () => {
  const user = JSON.parse(sessionStorage.getItem("user"));
  const userType = user.student_id ? "student" : "parent";
  const userId = user.student_id || user.parent_id;

  const router = useRouter();

  const [surveys, setSurveys] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [selectedTeacher, setSelectedTeacher] = useState(null);
  const [selectedChild, setSelectedChild] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const categorizedQuestions = useCategorizedQuestions(surveys, userType);
  const academicSurveys = categorizedQuestions.studentSurveys.academicSurveys;
  const schoolSurveys = categorizedQuestions.studentSurveys.schoolSurvey;
  const allParentSurveys = [
    ...categorizedQuestions.parentSurveys.sectionA,
    ...categorizedQuestions.parentSurveys.sectionB,
    ...categorizedQuestions.parentSurveys.sectionC,
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        let data;
        if (userType === "student") {
          data = await getStudentQuestion(userId);
        } else if (userType === "parent") {
          data = await getParentQuestion(userId);
          console.log("parent data", data);
        }

        setSurveys(data.response.questions || []);
        setLoading(false);
      } catch (error) {
        setError(error.message);
        setLoading(false);
        console.error("Dashboard fetch data error:", error);
      }
    };

    fetchData();
  }, [userId, userType]);

  useEffect(() => {
    if (selectedSubject && selectedTeacher) {
      const subjectName = selectedSubject;
      const teacherFullName = selectedTeacher;
      const surveyId = `${subjectName}-${teacherFullName}`;
      router.push(`/dashboard/${surveyId}`);
    }
  }, [selectedTeacher, selectedSubject, router]);

  useEffect(() => {
    if (userType === "parent" && selectedChild) {
      router.push(`/dashboard/${selectedChild}`);
    }
  }, [userType, selectedChild, router]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  if (userType === "student") {
    return (
      <div className="flex flex-col justify-center items-center">
        <h2 className="font-bold text-2xl">School</h2>
        <button>School survey</button>

        <h2 className="font-bold text-2xl">Academic</h2>
        {!selectedSubject && (
          <Subjects surveys={academicSurveys} onSelect={setSelectedSubject} />
        )}
        {selectedSubject && !selectedTeacher && (
          <Teachers
            subject={selectedSubject}
            surveys={academicSurveys}
            onSelect={setSelectedTeacher}
          />
        )}
      </div>
    );
  } else if (userType === "parent") {
    return (
      <div className="flex flex-col justify-center items-center">
        <h2 className="font-bold text-2xl">Select a Child</h2>
        <Children surveys={allParentSurveys} onSelect={setSelectedChild} />
      </div>
    );
  }
};

export default DashboardPage;

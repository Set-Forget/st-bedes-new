"use client";
import React, { useEffect, useState } from "react";
import Subjects from "@/app/components/dashboard-module/ui/subjects";
import { Teachers } from "@/app/components/dashboard-module/ui/teachers";
import { getStudentQuestion } from "@/app/core/services/api/questions";
import { useRouter } from "next/navigation";

const DashboardPage = () => {
  const user = JSON.parse(sessionStorage.getItem("user"));
  const userType = user.student_id ? "student" : "parent";
  const userId = user.student_id || user.parent_id;

  const router = useRouter();

  const [surveys, setSurveys] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [selectedTeacher, setSelectedTeacher] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getStudentQuestion(userId);
        setSurveys(data.response.questions || []);
        setLoading(false);
      } catch (error) {
        setError(error.message);
        setLoading(false);
        console.error("Dashboard fetch data error:", error);
      }
    };

    fetchData();
  }, [userId]);

  useEffect(() => {
    if (selectedSubject && selectedTeacher) {
      const subjectName = selectedSubject;
      const teacherFullName = selectedTeacher;
      const surveyId = `${subjectName}-${teacherFullName}`;

      // Upon both selections being made, push to the dynamic survey route
      router.push(`/dashboard/${surveyId}`);
    }
  }, [selectedTeacher, selectedSubject, router]);

  console.log(surveys);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  console.log("teachers and subjects components", Teachers, Subjects);
  console.log("surveys:", surveys);

  return (
    <div>
      {!selectedSubject && (
        <Subjects surveys={surveys} onSelect={setSelectedSubject} />
      )}
      {selectedSubject && !selectedTeacher && (
        <Teachers
          subject={selectedSubject}
          surveys={surveys}
          onSelect={setSelectedTeacher}
        />
      )}
    </div>
  );
};

export default DashboardPage;

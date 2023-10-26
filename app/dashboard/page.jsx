'use client'
import React from "react";
import Questionnaire from "../components/dashboard-module/surveys/questionnaire";

const Page = () => {
    const user = JSON.parse(sessionStorage.getItem("user"));
    const userType = user.student_id ? 'student' : 'parent';
    const userId = user.student_id || user.parent_id;

  console.log(userId, userType);
  return (
    <div className="flex w-full min-h-screen justify-center items-center">
      <h1>Dashboard</h1>
      <Questionnaire userType={userType} userId={userId}/>
    </div>
  );
};

export default Page;

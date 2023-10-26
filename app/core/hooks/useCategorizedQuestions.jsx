import { useState, useEffect } from "react";

export const useCategorizedQuestions = (questions, userType) => {
  const [categorized, setCategorized] = useState({
    studentSurveys: {
      schoolSurvey: [],
      academicSurveys: [],
    },
    parentSurveys: {
      sectionA: [],
      sectionB: [],
      sectionC: [],
    },
  });

  useEffect(() => {
    let schoolSurvey = [];
    let academicSurveys = [];
    let parentSectionA = [];
    let parentSectionB = [];
    let parentSectionC = [];

    questions.forEach((question) => {
      if (userType === "student" && question.section === "School") {
        schoolSurvey.push(question);
      } else if (userType === "student" && question.section === "Academic") {
        academicSurveys.push(question);
      } else if (userType === "parent") {
        if (question.section.startsWith("Section A")) {
          parentSectionA.push(question);
        } else if (question.section.startsWith("Section B")) {
          parentSectionB.push(question);
        } else if (question.section.startsWith("Section C")) {
          parentSectionC.push(question);
        }
      }
    });

    setCategorized({
      studentSurveys: {
        schoolSurvey: schoolSurvey,
        academicSurveys: academicSurveys,
      },
      parentSurveys: {
        sectionA: parentSectionA,
        sectionB: parentSectionB,
        sectionC: parentSectionC,
      },
    });
  }, [questions, userType]);

  return categorized;
};

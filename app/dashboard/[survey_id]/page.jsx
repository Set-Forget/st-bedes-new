'use client'
import { useDecodedSurveyId } from '@/app/core/hooks/useDecodedSurveyId';
import { useState, useEffect } from 'react';
import { getStudentQuestion } from '@/app/core/services/api/questions';
import Questionnaire from '@/app/components/dashboard-module/surveys/questionnaire';

const SurveyPage = () => {
  const { subject, teacher } = useDecodedSurveyId();
  
  const [questions, setQuestions] = useState([]);
  const user = JSON.parse(sessionStorage.getItem("user"));
  // const userType = user.student_id ? "student" : "parent";
  // const userId = user.student_id || user.parent_id;
  const studentId = user.student_id
  
  useEffect(() => {
    async function fetchData() {
      const data = await getStudentQuestion(studentId);
      setQuestions(data.response.questions);
    }
    
    fetchData();
  }, [studentId]);

  const filteredQuestions = questions.filter(q => 
    q.subject_name === subject && q.teacher_full_name === teacher
  );

  return (
    <div>
      <Questionnaire questions={filteredQuestions} />
    </div>
  );
};

export default SurveyPage;

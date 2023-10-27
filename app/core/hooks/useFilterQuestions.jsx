export const useFilterQuestions = (subject, teacher, questions) => {
    return questions.filter(
      (question) =>
        (subject === "All Subjects" || question.subject_name === subject) &&
        (teacher === "All Teachers" || question.teacher_full_name === teacher)
    );
  };
  
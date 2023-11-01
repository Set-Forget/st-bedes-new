import { fetchApi } from "./fetchApi";

export const postStudentAnswers = (answers) => {
    return fetchApi("SaveStudentAnswers", answers, "POST");
};
  
export const postParentAnswers = (answers) => {
    return fetchApi("SaveParentAnswers", answers, "POST");
};

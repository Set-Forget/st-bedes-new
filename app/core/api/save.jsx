import { fetchApi } from "./fetchApi";

export const postStudentAnswers = (action, answers) => {
  return fetchApi(action, answers, "POST");
};

export const postParentAnswers = (action, answers) => {
  return fetchApi(action, answers, "POST");
};

import { fetchApi } from "./fetchApi";

export const getStudentQuestion = async (studentId) => {
  return fetchApi("getStudentQuestion", {
    studentId: studentId
  }, "GET");
};

export const getParentQuestion = async (parentId) => {
  return fetchApi("getParentQuestion", {
    parentId: parentId
  }, "GET");
};

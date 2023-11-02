import { fetchApi } from "./fetchApi";

export const getStudentQuestion = async (studentId) => {
  return fetchApi("getStudentQuestion", {
    studentId: studentId,
  });
};

export const getParentQuestion = async (parentId) => {
  return fetchApi("getParentQuestion", {
    parentId: parentId,
  });
};

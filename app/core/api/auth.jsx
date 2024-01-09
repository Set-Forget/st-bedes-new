import { fetchApi } from "./fetchApi";

export const authenticateStudent = async (email, password) => {
  return fetchApi("authenticateStudent", {
    studentEmail: email,
    studentPassword: password
  }, "GET"); 
};

export const authenticateParent = async (email, password) => {
  return fetchApi("authenticateParent", {
    parentEmail: email,
    parentPassword: password
  }, "GET"); 
};

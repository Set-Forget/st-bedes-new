import { useState } from "react";
import { fetchData } from "../hooks/getBearer";

const PROXY_URL = "https://happy-mixed-gaura.glitch.me/";
const CLOUD_FUNCTION_URL =
  "https://integrations.googleapis.com/v1/projects/st-bedes/locations/us-central1/integrations/RunAPI:execute";

export const fetchApi = async (action, data = {}) => {

  let bearer = await fetchData();
  const bearerString = JSON.stringify(bearer)

  const requestBody = {
    "triggerId": "api_trigger/RunAPI_API_1",
    "inputParameters": {
      "postData": {
        "jsonValue": JSON.stringify({
          "action": action,
          "data": data
        })
      }
    }
  };

  const requestOptions = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      // Replace with dynamic token in production
      "Authorization": `Bearer ${bearer}`
    },
    body: JSON.stringify(requestBody)
  };

  const response = await fetch(CLOUD_FUNCTION_URL, requestOptions);
  console.log("Raw Response:", response);

  if (!response.ok) {
    throw new Error(`HTTP error, status: ${response.status}`);
  }

  const contentType = response.headers.get("content-type");
  if (contentType && contentType.includes("application/json")) {
    const responseData = await response.text();
    return JSON.parse(responseData);
  } else {
    throw new Error("Unexpected content type received.");
  }
};
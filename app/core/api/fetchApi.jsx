const BASE_URL = "https://europe-west2-st-bedes.cloudfunctions.net/st-bedes-deploy-test";
const PROXY_URL = "https://happy-mixed-gaura.glitch.me/"

export const fetchApi = async (action, data = {}, method = "GET") => {
  let url = `${PROXY_URL}${BASE_URL}?action=${action}`;

  const requestOptions = {
    method: method,
    headers: {}
  };

  if (method === "POST") {
    requestOptions.headers["Content-Type"] = "application/json";
    requestOptions.body = JSON.stringify(data);
  } else if (method === "GET" && data) {
    // Append data as query parameters for GET request
    const queryParams = new URLSearchParams(data).toString();
    url += `&${queryParams}`;
  }

  try {
    const response = await fetch(url, requestOptions);
    console.log("Raw Response:", response);

    if (!response.ok) {
      const errorBody = await response.text();
      console.error('HTTP Error Response Body:', errorBody);
      throw new Error(`HTTP error, status: ${response.status}`);
    }

    try {
      const responseData = await response.json();
      return responseData;
    } catch (jsonError) {
      const rawResponse = await response.text();
      console.error('Failed to parse response as JSON. Raw Response Body:', rawResponse);
      throw new Error("Failed to parse response as JSON.");
    }
  } catch (error) {
    console.error("Fetch Error:", error.message);
    throw error; 
  }
};

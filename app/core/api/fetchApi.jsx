// const BASE_URL =
//   "https://script.google.com/macros/s/AKfycbzOQ-TAlZ5No2x2Hr8x6yLViRbwRhIMvv4v7d3hQa0n8FYjZEBZPSci0vT74m5l-kYU2g/exec";
const PROXY_URL = "https://happy-mixed-gaura.glitch.me/";

const CLOUD_FUNCTION_URL =
  "https://integrations.googleapis.com/v1/projects/st-bedes/locations/us-central1/integrations/RunAPI:execute";

// Update fetchApi to handle new Google Cloud POST request format
export const fetchApi = async (action, data = {}) => {
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
      "Authorization": "Bearer ya29.a0AfB_byBmepX3VjdOXl5M6qlNC0MA9z9jH4OWiWmZo77YyNoARjRbylg8clZenzRWRi-eoezqRCreJXu7z8p_0_iWEIYbHPLiVjv5H4alQDgzuZHg2YpREGS_D610AjO0SdCp4pWm3fJ7gh0keNNajb3VbiWfkoRVbqvWw_AmlQNOpXdKxLsaSyMDCT4rXacCLKImGyCt9wEDBBFQVRnHeW77DCLSxqbPMAIiaz2zWZaE-crrlaaAp4a9zuBDpGgYEwaLncg36UzubTP_6W7EE3-YVRJGegJEsof8o5GggkAY9d4Q_1OAMMYAoGeSoMw0MWEhaD8THAtVd98r_HqMWXx0D7LmyTB6Omsn9lO2qIrYslLZaNB90NxEfl30b_4bgGu8aOSSKqKB2a2NeNFgtCxkiQpblXIwjwaCgYKAaESARASFQHGX2Mi3sy23IsvvgcmpDC-dOAxYw0425"
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
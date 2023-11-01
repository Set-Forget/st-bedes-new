const BASE_URL = "https://script.google.com/macros/s/AKfycbzOQ-TAlZ5No2x2Hr8x6yLViRbwRhIMvv4v7d3hQa0n8FYjZEBZPSci0vT74m5l-kYU2g/exec";
const PROXY_URL = "https://happy-mixed-gaura.glitch.me/";

export const fetchApi = async (action, params = {}, method = "GET") => {
  const url = new URL(`${PROXY_URL}${BASE_URL}`);
  url.searchParams.append("action", action);

  let requestOptions = {};

  if (method === "GET") {
    for (let key in params) {
      url.searchParams.append(key, params[key]);
    }
  } else if (method === "POST") {
    requestOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-requested-with": "XMLHttpRequest"
      },
      body: JSON.stringify(params),
    };
  }

  console.log(`Sending ${method} request to: ${url.toString()}`, requestOptions);

  const response = await fetch(url.toString(), requestOptions);
  console.log("Raw Response:", response);

  if (!response.ok) {
    throw new Error(`HTTP error, status: ${response.status}`);
  }

  const contentType = response.headers.get("content-type");
  if (contentType && contentType.includes("application/json")) {
    const responseData = await response.text();
    console.log("Response Data:", responseData);
    return JSON.parse(responseData);
  } else {
    throw new Error("Unexpected content type received.");
  }
};

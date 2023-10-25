const BASE_URL =
  "https://script.google.com/macros/s/AKfycbzOQ-TAlZ5No2x2Hr8x6yLViRbwRhIMvv4v7d3hQa0n8FYjZEBZPSci0vT74m5l-kYU2g/exec";

export const fetchApi = async (action, params = {}) => {
  const url = new URL(BASE_URL);
  url.searchParams.append("action", action);

  for (let key in params) {
    url.searchParams.append(key, params[key]);
  }

  const response = await fetch(url.toString());

  if (!response.ok) {
    throw new Error(`HTTP error, status: ${response.status}`);
  }
  return await response.json();
};
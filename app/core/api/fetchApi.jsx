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
      "Authorization": "Bearer ya29.c.c0AY_VpZhMGa9PYR1YnBHDzGOuRJKAyPkCq2kQbhaVH2cIggvkMk_eskOhdzh5kTdeuVMrBwKfcKPnGcAfwphb1cAzAguJsJI0f9FMN0GnbxjhtKbn9X-2VSWnPGqpjVXLto23_Dx__fFuNKfrpxP8DAN-6afS03dTsE8bIh4GdkyCzhIJoEkEBx-3iljB3L9V4nKOYlEGV23RHRXdanWCXeGnlArJb_idAaZF-RlFLZ1GQJS_tgMKJpOtyeIFHvlfX-9xQzbRQOxYvcZgoPz7cHSUM4wdlmeO5DCgPudpAcGQNkL-rm7HE8I1KNVvG815HfDOCdtcheulIp1VyL3gARjGAzz0fP9Nqt4EF2J9y-EymJXoReELeQo84AE387CeSXpXynUYmVgjW3rFZvZS_J1B3Vadb1Ud4c0q1gV-pc1moIjr2ZRQr3B2mghqgkbiv1UFb6pI2lOrc8QQ_J6k7Yhf_dWafkBnaOcu2aqVU2kU6VrZVoIQQOk0uybIkWavrJzQz8ku6Fy5dUlhmRlY6ozq0MBQaprfQ_nl8RpyJzOFRh8_0VVd_x86ImQV9iz8oX_QfxVt2Y5O0FI7YJx-wQttmXd1zqIl6llV0Oa2dozec2rqkpxfgQz_oZSm8okJa9XBBy-ya_i5d2R7I2j5phh-67SZ9JsetS6pa9-liu5XWngS46wXh2SZSIywIth5Q2vOSq3uVwwYnni6h6Yc3xivFd9z9Jk1OsRV7hQ2JjWdysV9eWd5Z1nx52xXaOdZvZgaz7zW_V4lIoBW0SlW-XdMORlxW-72XjXnMgr8MZfuIptyMIXW5l6ntoi8s4xIluW8SY6wk_09hl31piUol3-0t_MlBfgMunp55w93BlsYYmrniIe5IqlRjFuJeczxsFn9604O7mqw68pjm5m0qa65aqBup4RBWSeQ3hYdl2ncMvZ92pv1U3si-vyny9go5slkofj_OJMs6IgJO_uZ2aVdJZS7sO-jJsfzrZB9RgFFyOzgegm9OOB"
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
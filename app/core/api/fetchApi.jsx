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
      "Authorization": "Bearer ya29.c.c0AY_VpZhNlmHxRl8eaKA4uMOxS4cFj4pXDRsDH5a9VOitgAu8MMmtIN0_qEmVFuhEBDDhaAdLqTCSFRsh02ucjqyPBdL2nGmlGP-kLPD-Ds_1Fa-Jy49DV72KJHBLGb8zlWRv2q6bB8JXnQU5ujK4feCjNJGfTT9itg-DNwMDOw0R_e3KyXekHcI7Zu1eJ2Ocg0zqrwOEBR9qZgcvGl2bB97QYsiDkCpA5RIsINb4CGpRFvCmy03yyrJZdQFCbVKCokGUDe-LYdfu_0AfZHgXuMcnXRkrE8qPunoCIAfxiuS-sv__90dbByu8QaAHh6imAOj4DyipWrBL6jHY1kuk4L_HYbnFrWjxUSzutHt9iQT0aVIdC52DhKEL384Dl0Xk1w-lpnaZi__wfRqvBm8il6IYsc3zOMVMdY7IQZ1U4hOO_JMlUIe7Yoyo9SZ83ojofRIykW1q0xJaByMF-IVj5bcQ9QR4irciFXZJ4mv6ch8MvbMxyzOScUbR9v74-fUIYlVI2w-_kjMmzJlxXkU3VxIa86O8RO5ofxQVX6l70n5rspsX6OmaxSJBvbn1uI_td5fs2-566knM1YW2sV18tqVbQze1mOMU0YrdfvihqShpSzZ9cx2MkQ4sqtUmw67nBqvs_n_cfMXeBdXqrBtf_2rFev5lq6Sd8piw8UQVxkzW3Ig69v4dX045Rjk4lMW2YJyzI_VFf26SMY3r4m9WcgnulmrunMhhsIaB0csOd0qsVVJ9nrythMZw-V7tcoWs71Xd_6dWtUrdkZOtq3inIRjucmfodwwcihv-mf4YV797FkkyzMV4b-RzZ6VQ6bO8uUlw003MSMMoZ3v-Wi2Blj28w3VshpappwjeJSBz65MaSJ2ihFWwogeuV9aY7sk_6VSXldRI9UOk_Wc3-9Bme8961pgMz7e4kuyhwd9Fw6fU1MvxSlv_U-b65IBZ2nMbv_RWuIcmr1Qn_pl-J6VijxjUieoBVbrjm1vinmjmvyWppF40ZphIhic"
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
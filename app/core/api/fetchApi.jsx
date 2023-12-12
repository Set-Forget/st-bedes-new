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
      "Authorization": "Bearer ya29.c.c0AY_VpZihGPwNzn7U95baRy9_fZm62lLyooTRHZey0SfZG7dM__KQBbjEtBFIjngbRu8Cc5gYWwM5bL7SABgUFVqOKTSVwT6Py7KcQ-2cEQqhgOq5vpE0dpBHXy7B2t2V5ejUEacWGAJl3a4LmgHqS11p0fMUIIedlweQsYw2RFQD3mnGF1s8nCWtDUneuOgefAZL51BeUZoaHKkCvOjxzR6WWVmYHvw0fCUL7Xgp9QBt6VNRpEB0eIP9twPTmzWDF8FBT7K_FuHLzGLWlVP7Myvja7-0oP_w8-DY9PmzN_7J5_L3CV3DZUZmUL_yQh-sSl1JVXNvP9SbU7FwaQkRizY6NXKfnSQ84IFQ56zHuqso1EVwISwHYBnfvgL387CJsftIhubkwI-_9zeQekkezWu0eq_b-1tJy3jR9_Uorqfhy-Wop4sYuhBfZwW44-R--ZO1cUw8YFBmnavR4Vei_f5mkrqlk7d8cV3ed0IhQ2hbcYtlWhfOfnbrBojxyu6cao4Rd2V0yu-rddB56ac_8Y8g42Y9oe_yQn2Mm9keWQU-XufJvbIraeM7MyR2FMeRUOJQ98Bf7dgd6p8ZQmi2Qx6IIOUqdy_Yal2qRo_5axvOtq8_Ul5aU4tRF_gVbsgBWkrS0-nSa15MVYz8zuqUc0OBudImtU_jBSOBfh1p--F0cWM1MXsvlt0953o-BeRcmYb30udbe8Jq_OhsdxFFjkg91s9IqIZiWmY1Xrm1t1BF7lmpgXBSflvMQiwyYz8sShiganVujp3Fcpk7d6xa9gWfiWweFovr4bpB76ryI5qQ-0_uuik0x15pipqwmVpWlSwWnX9uiefB44hursugY2xl3t0-Wze-3UigUtXiI585g2s_pqkj50aJ9-X3qFUfXgz1ZB7RdhqxleIMSrtYRhk6pg3gh3xjS1B8sku3hg6_gr9WOfU7FwUloRedkf0jFWbX0MwadOufFXbBkfk-xmFRqSn-FpzeVvsScQ9SBu5ORn_vvX2hhvh"
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
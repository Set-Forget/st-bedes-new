import { useGoogleLogin } from "@react-oauth/google";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Spinner from "../spinner-component/spinner";
import { Toaster, toast } from "sonner";
import { fetchData } from "@/app/core/hooks/getBearer";

const GoogleAuth = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const login = useGoogleLogin({
    onSuccess: async (response) => {
      let bearer = await fetchData();

      const userInfoResponse = await fetch(
        "https://www.googleapis.com/oauth2/v3/userinfo",
        {
          headers: {
            Authorization: `Bearer ${response.access_token}`,
          },
        }
      );

      if (userInfoResponse.ok) {
        setIsLoading(true);
        const userInfo = await userInfoResponse.json();
        const email = userInfo.email;

        if (email) {
          const cloudFunctionUrl = 'https://integrations.googleapis.com/v1/projects/st-bedes/locations/us-central1/integrations/RunAPI:execute';
          const requestBody = {
            "triggerId": "api_trigger/RunAPI_API_1",
            "inputParameters": {
              "postData": {
                "jsonValue": JSON.stringify({
                  "action": "checkValidStudentEmail",
                  "data": { "studentEmail": email }
                })
              }
            }
          };

          try {
            const emailCheckResponse = await fetch(cloudFunctionUrl, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                // Replace with dynamic token in production
                "Authorization": bearer
              },
              body: JSON.stringify(requestBody)
            });

            const emailCheckData = await emailCheckResponse.json();

            if (emailCheckData.status === 200) {
              sessionStorage.setItem(
                "user",
                JSON.stringify(emailCheckData.response)
              );
              router.push("/");
            } else {
              console.error("User is not authorized or email is invalid");
              toast.error("Your account is not on St Bede's Database");
            }
          } catch (error) {
            console.error("Error checking email:", error);
          } finally {
            setIsLoading(false);
          }
        } else {
          console.error("Email not found in user info response");
        }
      } else {
        console.error("Failed to fetch user info");
      }
    },
    onError: (error) => console.error(`Login Failed: ${error}`),
  });

  return (
    <div>
      <a
        onClick={login}
        className={`mt-2 cursor-pointer flex w-full justify-center rounded-md bg-gray-800 px-4 py-2 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-gray-600 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 ${
          isLoading ? "cursor-wait opacity-90" : ""
        }`}
      >
        {isLoading ? (
          <Spinner />
        ) : (
          <>
            <svg
              id="googleIcon"
              className="h-5 w-5 ml-2"
              xmlns="http://www.w3.org/2000/svg"
              width="600px"
              height="600px"
              viewBox="-0.5 0 48 48"
              version="1.1"
            >
              {" "}
              <title>Google-color</title> <desc>Created with Sketch.</desc>{" "}
              <defs> </defs>{" "}
              <g
                id="Icons"
                stroke="none"
                strokeWidth="1"
                fill="none"
                fillRule="evenodd"
              >
                {" "}
                <g id="Color-" transform="translate(-401.000000, -860.000000)">
                  {" "}
                  <g id="Google" transform="translate(401.000000, 860.000000)">
                    {" "}
                    <path
                      d="M9.82727273,24 C9.82727273,22.4757333 10.0804318,21.0144 10.5322727,19.6437333 L2.62345455,13.6042667 C1.08206818,16.7338667 0.213636364,20.2602667 0.213636364,24 C0.213636364,27.7365333 1.081,31.2608 2.62025,34.3882667 L10.5247955,28.3370667 C10.0772273,26.9728 9.82727273,25.5168 9.82727273,24"
                      id="Fill-1"
                      fill="#FBBC05"
                    >
                      {" "}
                    </path>{" "}
                    <path
                      d="M23.7136364,10.1333333 C27.025,10.1333333 30.0159091,11.3066667 32.3659091,13.2266667 L39.2022727,6.4 C35.0363636,2.77333333 29.6954545,0.533333333 23.7136364,0.533333333 C14.4268636,0.533333333 6.44540909,5.84426667 2.62345455,13.6042667 L10.5322727,19.6437333 C12.3545909,14.112 17.5491591,10.1333333 23.7136364,10.1333333"
                      id="Fill-2"
                      fill="#EB4335"
                    >
                      {" "}
                    </path>{" "}
                    <path
                      d="M23.7136364,37.8666667 C17.5491591,37.8666667 12.3545909,33.888 10.5322727,28.3562667 L2.62345455,34.3946667 C6.44540909,42.1557333 14.4268636,47.4666667 23.7136364,47.4666667 C29.4455,47.4666667 34.9177955,45.4314667 39.0249545,41.6181333 L31.5177727,35.8144 C29.3995682,37.1488 26.7323182,37.8666667 23.7136364,37.8666667"
                      id="Fill-3"
                      fill="#34A853"
                    >
                      {" "}
                    </path>{" "}
                    <path
                      d="M46.1454545,24 C46.1454545,22.6133333 45.9318182,21.12 45.6113636,19.7333333 L23.7136364,19.7333333 L23.7136364,28.8 L36.3181818,28.8 C35.6879545,31.8912 33.9724545,34.2677333 31.5177727,35.8144 L39.0249545,41.6181333 C43.3393409,37.6138667 46.1454545,31.6490667 46.1454545,24"
                      id="Fill-4"
                      fill="#4285F4"
                    >
                      {" "}
                    </path>{" "}
                  </g>{" "}
                </g>{" "}
              </g>{" "}
            </svg>
            <span id="buttonText" className="ml-4">
              Sign in with Google
            </span>
          </>
        )}
      </a>
      <Toaster position="bottom-center" />
    </div>
  );
};

export default GoogleAuth;

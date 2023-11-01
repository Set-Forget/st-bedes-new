"use client";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import {
  authenticateParent,
  authenticateStudent,
} from "@/app/core/services/api/auth";
import useCheckLoginStatus from "@/app/core/hooks/useCheckLoginStatus";
import { useRouter } from "next/navigation";
import Image from "next/image";
import errorPic from "@/public/error-page-illustration.svg";
import Spinner from "../spinner-component/spinner";

const LoginForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const [loginType, setLoginType] = useState("student"); // login page defaults as student
  const [error, setError] = useState("");
  const isLoggedIn = useCheckLoginStatus();
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();

  // handles login logic, student and parent logins are separated
  const onSubmit = async ({ email, password }) => {
    setError("");
    setIsLoading(true);

    if (!email.trim() || !password.trim()) {
      setError("Please complete all fields.");
      setIsLoading(false);
      return;
    }
    try {
      let response;

      // wether its a student or parent, it uses a different api endpoint
      if (loginType === "student") {
        response = await authenticateStudent(email, password);
      } else if (loginType === "parent") {
        response = await authenticateParent(email, password);
      }

      if (response && response.status === 200) {
        sessionStorage.setItem("user", JSON.stringify(response.response));
        router.push("/");
      } else if (
        response &&
        response.status === 404 &&
        response.message === "Email not in the database."
      ) {
        setError("Email not found");
      } else {
        setError("Wrong credentials");
      }
    } catch (error) {
      setError("An error occurred during login. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // toggle wether its a parent or a student (default) login in
  const toggleLoginType = () => {
    if (loginType === "student") {
      setLoginType("parent");
    } else {
      setLoginType("student");
    }
  };

  if (isLoggedIn) {
    return (
      <div className="relative flex h-screen w-screen justify-center items-start overflow-hidden">
        <div className="flex flex-col">
          <h1 className="font-black text-[6vh] sm:text-[15vh] text-center leading-none mt-96 pointer-events-none">
            You shouldn&apos;t be here!
          </h1>
          <button
            className="text-[3vh] sm:text-[5vh] hover:underline self-center mt-16"
            onClick={() => router.push("/")}
          >
            Go back
          </button>
        </div>
        <Image
          className="absolute -bottom-48 sm:left-0 pointer-events-none"
          width={1000}
          height={0}
          src={errorPic}
          alt="error picture"
        />
      </div>
    );
  }

  return (
    <>
      <div className="flex min-h-full w-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <h2 className="mt-10 text-center text-2xl leading-9 tracking-tight text-gray-900">
            Sign in as a <b className="text-bedeblue">{loginType}</b>
          </h2>
        </div>

        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Email address
              </label>
              <div className="mt-2">
                <input
                  type="email"
                  {...register("email", { required: "Email is required." })}
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-bedeblue sm:text-sm sm:leading-6"
                />
              </div>
              {errors.email && (
                <p className="text-sm text-red-500 animate-pulse">
                  {errors.email.message}
                </p>
              )}
            </div>

            <div>
              <div className="flex items-center justify-between">
                <label
                  htmlFor="password"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Password
                </label>
              </div>
              <div className="mt-2">
                <input
                  type="password"
                  {...register("password", {
                    required: "Password is required.",
                  })}
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-bedeblue sm:text-sm sm:leading-6"
                />
              </div>
              {errors.password && (
                <p className="text-sm text-red-500 animate-pulse">
                  {errors.password.message}
                </p>
              )}
            </div>

            {error && (
              <p className="text-sm text-red-500 animate-pulse">{error}</p>
            )}

            <div>
              <button
                type="submit"
                className={`flex w-full justify-center rounded-md bg-bedeblue px-4 py-2 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-blue-800 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 ${
                  isLoading ? "cursor-wait opacity-90" : ""
                }`}
              >
                {isLoading ? <Spinner /> : "Sign in"}
              </button>
            </div>
          </form>

          <p className="mt-10 text-center text-sm text-gray-500">
            {`Im a ${loginType === "student" ? "parent" : "student"}. `}
            <button
              onClick={toggleLoginType}
              className={`font-semibold leading-6 text-bedeblue hover:text-blue-800 transition-colors ${
                isLoading ? "opacity-90 pointer-events-none" : ""
              }`}
            >
              Switch role
            </button>
          </p>
        </div>
      </div>
    </>
  );
};

export default LoginForm;

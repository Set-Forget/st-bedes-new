"use client";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import {authenticateParent, authenticateStudent} from "@/app/core/services/api/auth";
import { useCheckLoginStatus } from "@/app/core/hooks/useCheckLoginStatus";
import { useRouter } from "next/navigation";
import Image from "next/image";
import errorPic from "@/public/error-page-illustration.svg";
import Spinner from "../spinner-component/spinner";

const LoginForm = () => {
  const {register, handleSubmit, formState: { errors }} = useForm();

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
        console.log("Logged in successfully", response);
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
          <h1 className="font-black text-[15vh] text-center leading-none mt-96 pointer-events-none">
            You shouldn&apos;t be here!
          </h1>
          <button
            className="text-[5vh] hover:underline self-center mt-16"
            onClick={() => router.push("/")}
          >
            Go back
          </button>
        </div>
        <Image
          className="absolute -bottom-48 left-0 pointer-events-none"
          width={1000}
          height={0}
          src={errorPic}
        />
      </div>
    );
  }

  return (
    <div className="form-container p-12 flex flex-col items-center shadow-lg py-24 rounded-lg">
      <h1 className="text-4xl p-3 font-bold">{`Logging in as a ${loginType}`}</h1>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col justify-center items-start space-y-12 my-24"
      >
        <input
          type="email"
          {...register("email", { required: "Email is required." })}
          placeholder="email"
          className="border-b text-2xl w-[500px] p-6"
        />
        {errors.email && <p className="text-sm text-red-500 animate-pulse">{errors.email.message}</p>}
        <input
          type="password"
          {...register("password", { required: "Password is required." })}
          placeholder="password"
          className="border-b text-2xl w-[500px] p-6"
        />
        {errors.password && <p className="text-sm text-red-500 animate-pulse">{errors.password.message}</p>}
        {error && <p className="text-sm text-red-500 animate-pulse">{error}</p>}
        <button
          type="submit"
          className="self-center text-2xl font-bold bg-bedeblue text-white px-24 py-2 rounded-lg opacity-90 hover:opacity-100 transition-all"
        >
          {isLoading ? <Spinner /> : "Login"}
        </button>
      </form>
      <button
        onClick={toggleLoginType}
        className={`text-lg self-end hover:font-bold transition-all ${
          isLoading ? "opacity-50 pointer-events-none" : ""
        }`}
      >
        {`I'm a ${loginType === "student" ? "parent" : "student"}`}
      </button>
    </div>
  );
};

export default LoginForm;

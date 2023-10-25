"use client";
import React, { useState } from "react";
import { fetchApi } from "@/app/core/services/api/fetchApi";
import {
  authenticateParent,
  authenticateStudent,
} from "@/app/core/services/api/auth";
import { useRouter } from "next/navigation";

const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginType, setLoginType] = useState("student"); // defaults as student
  const [error, setError] = useState("");

  const router = useRouter();

  // handles login logic, student and parent logins are separated
  const handleLogin = async () => {
    setError("");

    // Check if email and password fields are filled
    if (!email.trim() || !password.trim()) {
      setError("Please complete all fields.");
      return;
    }

    try {
      let response;

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
        if (loginType === "student") {
          console.error(
            "Tried logging in with a parent account in the student login"
          );
          setError("Email not found");
        } else {
          console.error(
            "Tried logging in with a student account in the parent login"
          );
          setError("Email not found");
        }
      } else {
        console.error("Unexpected API response:", response);
        setError("Wrong credentials");
      }
    } catch (error) {
      console.error("Error during login", error);
      setError("An error occurred during login. Please try again.");
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

  return (
    <div className="form-container p-12 flex flex-col items-center shadow-lg bg-white">
      <h1 className="text-4xl p-3 font-bold">{`Logging in as a ${loginType}`}</h1>
      <form
        onSubmit={(e) => e.preventDefault()}
        className="flex flex-col justify-center items-start space-y-12 my-24"
      >
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="email"
          className="border-b text-2xl w-[500px]"
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="password"
          className="border-b text-2xl w-[500px]"
        />
        {error && <p className="text-sm text-red-500 animate-pulse">{error}</p>}
        <button
          onClick={handleLogin}
          className="self-center text-2xl font-bold bg-bedeblue text-white px-24 py-2 rounded-lg opacity-90 hover:opacity-100 transition-all"
        >
          Login
        </button>
      </form>
      <button onClick={toggleLoginType} className="text-lg self-end hover:font-bold transition-all">
        {`I'm a ${loginType === "student" ? "parent" : "student"}`}
      </button>
    </div>
  );
};

export default LoginForm;

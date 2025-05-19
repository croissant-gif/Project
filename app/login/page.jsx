"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const storedUsername = localStorage.getItem("username");
    if (storedUsername) {
      router.push("/rooms");
    }
  }, [router]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    const credentials = { username, password };

    try {
      const response = await fetch("/api/todos/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(credentials),
      });

      const data = await response.json();

      if (response.ok) {
        const { name, lastName } = data;
        localStorage.setItem("username", username);
        localStorage.setItem("name", name);
        localStorage.setItem("lastName", lastName);
        router.push("/rooms");
      } else {
        setMessage(data.message || "An error occurred");
      }
    } catch (error) {
      setMessage("Error: Could not reach the server. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateAccount = () => {
    router.push("/create");
  };

  return (
    <section className="relative w-full font-poppins h-screen flex justify-center items-center text-primary sm:px-0 px-6">
      <div className="absolute top-0 left-0 w-full h-1/2 z-0 overflow-hidden sm:p-5 p-2">
        <div className="w-full h-full bg-main sm:rounded-2xl rounded-xl">
          <img
            src="/images/bg-wave.png"
            alt="wave"
            className="w-full h-full object-cover"
          />
        </div>
      </div>

      <div className="z-20 w-full sm:max-w-[450px] bg-white sm:rounded-3xl rounded-2xl shadow-lg py-10 sm:px-10 px-6">
        <div className="flex justify-center mb-8">
          <Image
            src="/images/logo.svg"
            alt="App Logo"
            width={140}
            height={140}
            priority
            className="sm:w-48 w-40 object-contain"
          />
        </div>

        {message && (
          <div className="mb-4 text-center text-base font-semibold text-[#9C2B23]">
            {message}
          </div>
        )}
        <form onSubmit={handleLogin} className="space-y-4">
          <div className="flex flex-col gap-2">
            <p className="text-sm">Username</p>
            <input
              type="text"
              placeholder="Enter your username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="transition-all duration-300 ease-out text-sm w-full sm:px-4 sm:py-4 px-4 py-3 border border-gray-300 rounded-xl outline-none active:border-main focus:border-main"
            />
          </div>
          <div className="flex flex-col gap-2">
            <p className="text-sm">Password</p>
            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="transition-all duration-300 ease-out text-sm w-full sm:px-4 sm:py-4 px-4 py-3 border border-gray-300 rounded-xl outline-none active:border-main focus:border-main"
            />
          </div>
          <div className="flex justify-center">
            <button
              type="submit"
              className={`w-full py-3 sm:mt-4 mt-2 ${
                loading ? "bg-gray-400" : "bg-main"
              } rounded-xl text-white text-sm hover:bg-[#0080FF] transition-all duration-300 ease-out`}
              disabled={loading}
            >
              {loading ? "Logging in..." : "Login"}
            </button>
          </div>
        </form>

        <div className="h-[1px] w-full bg-gradient-to-r from-[#E2E8F0]/10 via-[#D7DBE1] to-[#E2E8F0]/10 sm:my-8 my-6"></div>

        <div className="flex justify-center items-center text-sm gap-2">
          <p>Don’t have an account?</p>
          <button
            onClick={handleCreateAccount}
            className="text-main hover:underline"
          >
            Sign up
          </button>
        </div>
      </div>
    </section>
  );
}

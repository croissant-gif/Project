'use client'

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';  
import { FaEye, FaEyeSlash } from 'react-icons/fa';

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const storedUsername = localStorage.getItem("username");
    if (storedUsername) {
      router.push('/rooms');
    }
  }, [router]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");  

    const credentials = { username, password };

    try {
      const response = await fetch('/api/todos/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
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
    <section className="w-full font-montserrat">
      <section className="flex justify-center items-center min-h-screen bg-gradient-to-r  from-customgreen to-customBlue">
        <div className="bg-white p-8 rounded-lg shadow-lg w-full sm:w-96 max-w-sm">
          <div className="flex justify-center mb-4">
            <Image
              src="/logo.png"
              alt="App Logo"
              width={200}
              height={200}
              priority
            />
          </div>

          <h2 className="text-3xl font-semibold text-center text-black mb-6">Login</h2>

          {message && (
            <div className="mb-4 text-center text-lg font-semibold text-red-600">
              {message}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <input
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="text-black w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="text-black w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 pr-10"
              />
           <span
  onClick={() => setShowPassword(!showPassword)}
  className="absolute right-3 top-3 cursor-pointer text-gray-500 select-none"
>
  {showPassword ? <FaEyeSlash size={20} /> : <FaEye size={20} />}
</span> 
            </div>

            <div className="flex justify-center">
              <button
                type="submit"
                className={`w-full py-3 mt-4 ${loading ? 'bg-gray-400' : 'bg-blue-600'} text-white font-semibold rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500`}
                disabled={loading}
              >
                {loading ? 'Logging in...' : 'Login'}
              </button>
            </div>
          </form>
        </div>
      </section>
    </section>
  );
}

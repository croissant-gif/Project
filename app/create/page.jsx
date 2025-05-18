'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

const AddAccount = () => {
  const [name, setName] = useState('');
  const [lastName, setLastName] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');  // State to store success/error messages
  const [loading, setLoading] = useState(false);  // State to track if the request is in progress
  const router = useRouter();

  const addAccount = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');  // Reset message before submitting
  
    const newAccount = { name, lastName, username, password };
  
    try {
      const response = await fetch('/api/todos/account', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newAccount),
      });
  
      // Parse the response data
      const addedAccount = await response.json();
  
      if (response.ok) {
        setMessage('Account added successfully!');
        // Reset the form fields
        setName('');
        setLastName('');
        setUsername('');
        setPassword('');
      } else {
        // Handle errors from the backend
        setMessage(`Error: ${addedAccount.message || 'An error occurred'}`);
      }
    } catch (error) {
      // Handle network errors or if the server is unreachable
      setMessage('Error: Could not reach the server. Please try again later.');
    } finally {
      setLoading(false);  // Reset loading state after the request is finished
    }
  };
  const handleLoginAccount = () => {
    router.push("/login");
  };
  return (
    <section className="w-full font-montserrat">
       <section className="flex justify-center items-center min-h-screen bg-gradient-to-r  from-customgreen to-customBlue">
        <div className="bg-white p-8 rounded-lg shadow-lg w-full sm:w-96 max-w-sm">
          <h2 className="text-3xl font-semibold text-center  text-black mb-6">Add Account</h2>
          
          {/* Display success or error message */}
          {message && (
            <div className="mb-4 text-center text-lg font-semibold text-green-600">
              {message}
            </div>
          )}
          
          <form onSubmit={addAccount} className="space-y-4">
            <div>
              <input
                type="text"
                placeholder="First Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="text-black w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <input
                type="text"
                placeholder="Last Name"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="text-black w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <input
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="text-black w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="text-black w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div className="flex justify-center">
              <button
                type="submit"
                className={`w-full py-3 mt-4 ${loading ? 'bg-gray-400' : 'bg-blue-600'} text-white font-semibold rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500`}
                disabled={loading}
              >
                {loading ? 'Adding Account...' : 'Add Account'}
              </button>
            </div>
          </form>

          {/* Optional Link to a Login page or other actions */}
          <div className="mt-4 text-center">
          <button
              onClick={handleLoginAccount}
              className="text-blue-600 hover:underline"
            >
              Go to Login page
            </button>
          </div>
        </div>
      </section>
    </section>
  );
};

export default AddAccount;

'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

const AddAccount = () => {
  const [name, setName] = useState('');
  const [lastName, setLastName] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');   
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);   
    const [showPassword, setShowPassword] = useState(false);
    const router = useRouter();

  useEffect(() => {
    const username = localStorage.getItem("username");

    if (!username) {
      setMessage("You need to log in first.");
      router.push("/login");
      return;
    }
  
    const fetchPresetItems = async () => {
      try {
        const response = await fetch('/api/todos/presetitem');
        if (!response.ok) {
          throw new Error('Failed to fetch preset items');
        }
        const data = await response.json();
        setDynamicPresetItems(data);  
      } catch (err) {
        setError(err.message);  
      } finally {
        setLoading(false); 
      }
    };

    fetchPresetItems(); 
  }, []); 


  const addAccount = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage(''); 
  
    const newAccount = { name, lastName, username, password };
    
  
    try {
      const response = await fetch('/api/todos/account', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newAccount),
      });
   
      const addedAccount = await response.json();
  
      if (response.ok) {
        setMessage('Account added successfully!');
        
        setName('');
        setLastName('');
        setUsername('');
        setPassword('');
      } else {
     
        setMessage(`Error: ${addedAccount.message || 'An error occurred'}`);
      }
    } catch (error) {
     
      setMessage('Error: Could not reach the server. Please try again later.');
    } finally {
      setLoading(false);   
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
                {loading ? 'Adding Account...' : 'Add Account'}
              </button>
            </div>
          </form>

          
          <div className="mt-4 text-center">
          <button
          
              onClick={handleLoginAccount}
              className="text-blue-600 hover:underline"
            >
              Go back
            </button>
          </div>
        </div>
      </section>
    </section>
  );
};

export default AddAccount;
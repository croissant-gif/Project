'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
 

export default function ManageAccount() {
  const [user, setUser] = useState(null);
  const [showPasswords, setShowPasswords] = useState({ current: false, new: false });

  const [formData, setFormData] = useState({});
  const [passwordForm, setPasswordForm] = useState({ currentPassword: '', newPassword: '' });
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const username = typeof window !== 'undefined' ? localStorage.getItem('username') : null;

  useEffect(() => {
    if (!username) {
      setError("No user logged in.");
      return;
    }

    const fetchUser = async () => {
      const res = await fetch(`/api/todos/account?username=${username}`);
      const data = await res.json();

      if (res.ok) {
        setUser(data);
        setFormData(data); 
      } else {
        setError(data.message || "Failed to load user data.");
      }
    };

    fetchUser();
  }, [username]);

  const handleCreateAccount = () => {
    router.push('/create');
  }
 
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

 
  const handlePasswordChange = (e) => {
    setPasswordForm({ ...passwordForm, [e.target.name]: e.target.value });
  };

 
 const handleUpdate = async () => {
  setError('');
  setMessage('');

  const res = await fetch('/api/todos/account', {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      currentUsername: username,
      newUsername: formData.username,
      name: formData.name,
      lastName: formData.lastName,
    }),
  });

  const data = await res.json();

  if (res.ok) {
    setMessage('Account updated successfully.');
    setError('');
    localStorage.setItem('username', formData.username);
    setUser(data);
  } else {
    setError(data.message || 'Update failed.');
    setMessage('');
  }
};

  
 const handlePasswordUpdate = async () => {
 
  setError('');
  setMessage('');

  const res = await fetch('/api/todos/account', {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      username,
      currentPassword: passwordForm.currentPassword,
      newPassword: passwordForm.newPassword,
    }),
  });

  const data = await res.json();

  if (res.ok) {
    setMessage('Password updated successfully.');
    setError('');  
    setPasswordForm({ currentPassword: '', newPassword: '' });  
  } else {
    setError(data.message || 'Password update failed.');
    setMessage(''); 
  }
};
 

  if (!user) return <p className="p-4">Loading...</p>;

  return (
    <div className="max-w-xl mx-auto p-6 font-montserrat text-black">
      <h1 className="text-2xl font-bold mb-4">Manage My Account</h1>

      {error && <p className="text-red-600 mb-2">{error}</p>}
      {message && <p className="text-green-600 mb-2">{message}</p>}

      {/* Update Info Form */}
      <div className="space-y-6">
       
        <div>
          <label htmlFor="name" className="block text-sm font-semibold text-gray-700">First Name</label>
          <input
            name="name"
            id="name"
            placeholder="Enter your first name"
            value={formData.name || ''}
            onChange={handleChange}
            className="w-full p-2 border rounded mt-1"
          />
        </div> 
        <div>
          <label htmlFor="lastName" className="block text-sm font-semibold text-gray-700">Last Name</label>
          <input
            name="lastName"
            id="lastName"
            placeholder="Enter your last name"
            value={formData.lastName || ''}
            onChange={handleChange}
            className="w-full p-2 border rounded mt-1"
          />
        </div>
 
        <div>
          <label htmlFor="username" className="block text-sm font-semibold text-gray-700">Username</label>
          <input
            name="username"
            id="username"
            placeholder="Enter your username"
            value={formData.username || ''}
            onChange={handleChange}
            className="w-full p-2 border rounded mt-1"
          />
        </div>

        <button
          onClick={handleUpdate}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 mt-4"
        >
          Update Info
        </button>
      </div>

 
      <div className="mt-6 space-y-6">
        <h2 className="text-lg font-semibold">Change Password</h2>
        
    <div className="flex space-x-4">
  {/* Current Password */}
  <div className="w-1/2 relative">
    <label htmlFor="currentPassword" className="block text-sm font-semibold text-gray-700">Current Password</label>
    <input
      name="currentPassword"
      type={showPasswords.current ? "text" : "password"}
      id="currentPassword"
      placeholder="Enter your current password"
      value={passwordForm.currentPassword}
      onChange={handlePasswordChange}
      className="w-full p-2 pr-10 border rounded mt-1"
    />
    <span
      onClick={() => setShowPasswords(prev => ({ ...prev, current: !prev.current }))}
      className="absolute right-3 top-9 cursor-pointer text-gray-500 select-none"
    >
      {showPasswords.current ? <FaEyeSlash size={18} /> : <FaEye size={18} />}
    </span>
  </div>

   
  <div className="w-1/2 relative">
    <label htmlFor="newPassword" className="block text-sm font-semibold text-gray-700">New Password</label>
    <input
      name="newPassword"
      type={showPasswords.new ? "text" : "password"}
      id="newPassword"
      placeholder="Enter your new password"
      value={passwordForm.newPassword}
      onChange={handlePasswordChange}
      className="w-full p-2 pr-10 border rounded mt-1"
    />
    <span
      onClick={() => setShowPasswords(prev => ({ ...prev, new: !prev.new }))}
      className="absolute right-3 top-9 cursor-pointer text-gray-500 select-none"
    >
      {showPasswords.new ? <FaEyeSlash size={18} /> : <FaEye size={18} />}
    </span>
  </div>
</div>


        <button
          onClick={handlePasswordUpdate}
          className="bg-yellow-600 text-white px-4 py-2 rounded hover:bg-yellow-700 mt-4"
        >
          Update Password
        </button>
      </div>

 
      <div className="mt-6">
        
            <button
              onClick={handleCreateAccount}
              className="text-blue-600 hover:underline"
            >
              Create new account
            </button>
      </div>
    </div>
  );
}
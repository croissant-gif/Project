'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function ManageAccount() {
  const [user, setUser] = useState(null);
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
        setFormData(data); // For edit fields
      } else {
        setError(data.message || "Failed to load user data.");
      }
    };

    fetchUser();
  }, [username]);

  // Handle form input changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle password input change
  const handlePasswordChange = (e) => {
    setPasswordForm({ ...passwordForm, [e.target.name]: e.target.value });
  };

  // Submit updates to user info
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

  // Submit password update
 const handlePasswordUpdate = async () => {
  // Clear previous messages
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
    setError(''); // Clear any previous error
    setPasswordForm({ currentPassword: '', newPassword: '' }); // Optional: reset inputs
  } else {
    setError(data.message || 'Password update failed.');
    setMessage(''); // Clear success message
  }
};
  // Delete account
  const handleDelete = async () => {
    const confirm = window.confirm('Are you sure you want to delete your account? This action cannot be undone.');

    if (!confirm) return;

    const res = await fetch('/api/todos/account', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username }),
    });

    const data = await res.json();

    if (res.ok) {
      localStorage.clear();
      router.push('/login');
    } else {
      setError(data.message || 'Failed to delete account.');
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
        {/* Name */}
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

        {/* Last Name */}
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

        {/* Username */}
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

      {/* Password Change - Horizontal Layout */}
      <div className="mt-6 space-y-6">
        <h2 className="text-lg font-semibold">Change Password</h2>
        
        <div className="flex space-x-4">
          {/* Current Password */}
          <div className="w-1/2">
            <label htmlFor="currentPassword" className="block text-sm font-semibold text-gray-700">Current Password</label>
            <input
              name="currentPassword"
              type="password"
              id="currentPassword"
              placeholder="Enter your current password"
              value={passwordForm.currentPassword}
              onChange={handlePasswordChange}
              className="w-full p-2 border rounded mt-1"
            />
          </div>

          {/* New Password */}
          <div className="w-1/2">
            <label htmlFor="newPassword" className="block text-sm font-semibold text-gray-700">New Password</label>
            <input
              name="newPassword"
              type="password"
              id="newPassword"
              placeholder="Enter your new password"
              value={passwordForm.newPassword}
              onChange={handlePasswordChange}
              className="w-full p-2 border rounded mt-1"
            />
          </div>
        </div>

        <button
          onClick={handlePasswordUpdate}
          className="bg-yellow-600 text-white px-4 py-2 rounded hover:bg-yellow-700 mt-4"
        >
          Update Password
        </button>
      </div>

      {/* Delete Account */}
      <div className="mt-6">
        <button
          onClick={handleDelete}
          className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
        >
          Delete Account
        </button>
      </div>
    </div>
  );
}
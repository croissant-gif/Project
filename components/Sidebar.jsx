'use client';
import Link from 'next/link';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export const Sidebar = () => {
  const [fullName, setFullName] = useState('');
  const [ip, setIp] = useState(null);
  const [isCollapsed, setIsCollapsed] = useState(true); // Sidebar collapse
  const [isIpVisible, setIsIpVisible] = useState(false); // NEW: IP visibility
  const router = useRouter();
useEffect(() => {
  // Get the stored full name from localStorage
  const storedName = localStorage.getItem("name");
  const storedLastName = localStorage.getItem("lastName");

  if (storedName || storedLastName) {
    const full = `${storedName || ''} ${storedLastName || ''}`.trim();
    setFullName(full); // Set the combined full name
  }

  // Fetch the IP address from the server-side API
  const fetchIp = async () => {
    try {
      const response = await fetch('/api/todos/ip');
      const data = await response.json();
      setIp(data.ip); // Set the fetched IP
    } catch (error) {
      console.error('Error fetching IP:', error);
    }
  };

  fetchIp(); // Call the function to fetch the IP
}, []);

  const handleLogout = () => {
    // Clear the localStorage to remove the username and name
    localStorage.removeItem('username');
    localStorage.removeItem('name');
    
    // Redirect to the login page
    router.push('/login');
  };

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed); // Toggle the sidebar state
  };

  return (
      <section className="  flex h-screen   font-montserrat">
    
      <div className={`bg-gradient-to-b from-blue-500 to-blue-300  shadow-lg ${isCollapsed ? 'w-20 ' : 'w-60   '}  transform transition-width duration-300 ease-in-out `}>
         {/* Title at Top */}
         <div className={`px-3 py-2 w-full transition-all duration-300 flex justify-center ${isCollapsed ? 'opacity-0 h-0 overflow-hidden' : 'opacity-100 h-auto'}`}>
          <h1 className="text-white font-montserrat text-sm text-center">
            HOUSEKEEPING MANAGEMENT SYSTEM
          </h1>
        </div>
      <div className="px-4 py-5">
        
    {/* Hamburger Button to toggle sidebar */}
    <div className="w-full flex justify-start px-4 pt-1">
    <button 
      onClick={toggleSidebar} 
      className="text-white text-xl focus:outline-none transform active:scale-95"
    >
      <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
        <path fillRule="evenodd" d="M3 5.25a.75.75 0 0 1 .75-.75h16.5a.75.75 0 0 1 .75.75v1.5a.75.75 0 0 1-.75.75H3a.75.75 0 0 1-.75-.75V5.25zm0 6a.75.75 0 0 1 .75-.75h16.5a.75.75 0 0 1 .75.75v1.5a.75.75 0 0 1-.75.75H3a.75.75 0 0 1-.75-.75V11.25zm0 6a.75.75 0 0 1 .75-.75h16.5a.75.75 0 0 1 .75.75v1.5a.75.75 0 0 1-.75.75H3a.75.75 0 0 1-.75-.75V17.25z" clipRule="evenodd" />
      </svg>
    </button>
  </div>


  {/* Admin Label */}
  <div className={`px-4 py-2 w-full text-white text-lg text-center font-semibold font-montserrat transition-all duration-300 ${isCollapsed ? 'opacity-0 h-0 overflow-hidden' : 'opacity-100 h-auto'}`}>
    ADMIN
  </div>
</div>

        {/* User's Full Name Display */}
        <div className={`px-7 py-3 text-white text-lg  font-semibold font-montserrat ${isCollapsed ? 'hidden' : 'block'}`}>
          {fullName ? `Hello, ${fullName}` : 'Hello, Guest'}
        </div>

        {/* Sidebar Links */}
        <div className={`flex flex-col ${isCollapsed ? 'space-y-3' : 'space-y-5'}`}>
          <Link href="/rooms">
            <div className='flex items-center px-6 py-3 text-white  font-semibold font-montserrat hover:bg-blue-300 transition duration-300'>
              {/* ROOMS Icon */}
              <svg className="w-5 h-5 mx-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                <path d="M19.006 3.705a.75.75 0 1 0-.512-1.41L6 6.838V3a.75.75 0 0 0-.75-.75h-1.5A.75.75 0 0 0 3 3v4.93l-1.006.365a.75.75 0 0 0 .512 1.41l16.5-6Z" />
                <path fillRule="evenodd" d="M3.019 11.114 18 5.667v3.421l4.006 1.457a.75.75 0 1 1-.512 1.41l-.494-.18v8.475h.75a.75.75 0 0 1 0 1.5H2.25a.75.75 0 0 1 0-1.5H3v-9.129l.019-.007ZM18 20.25v-9.566l1.5.546v9.02H18Zm-9-6a.75.75 0 0 0-.75.75v4.5c0 .414.336.75.75.75h3a.75.75 0 0 0 .75-.75V15a.75.75 0 0 0-.75-.75H9Z" clipRule="evenodd" />
              </svg>
              <span className={`${isCollapsed ? 'hidden' : 'block'}`}>ROOMS</span> {/* Text hidden on collapse */}
            </div>
          </Link>

          {/* Other Links */}
          <Link href="/roomitems">
            <div className='flex items-center px-6 py-3 text-white  font-semibold font-montserrat hover:bg-blue-300 transition duration-300'>
              {/* INVENTORY Icon */}
              <svg className="w-5 h-5 mx-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                <path d="M11.644 1.59a.75.75 0 0 1 .712 0l9.75 5.25a.75.75 0 0 1 0 1.32l-9.75 5.25a.75.75 0 0 1-.712 0l-9.75-5.25a.75.75 0 0 1 0-1.32l9.75-5.25Z" />
                <path d="m3.265 10.602 7.668 4.129a2.25 2.25 0 0 0 2.134 0l7.668-4.13 1.37.739a.75.75 0 0 1 0 1.32l-9.75 5.25a.75.75 0 0 1-.71 0l-9.75-5.25a.75.75 0 0 1 0-1.32l1.37-.738Z" />
                <path d="m10.933 19.231-7.668-4.13-1.37.739a.75.75 0 0 0 0 1.32l9.75 5.25c.221.12.489.12.71 0l9.75-5.25a.75.75 0 0 0 0-1.32l-1.37-.738-7.668 4.13a2.25 2.25 0 0 1-2.134-.001Z" />
              </svg>
              <span className={`${isCollapsed ? 'hidden' : 'block'}`}>ROOM ITEMS</span> {/* Text hidden on collapse */}
            </div>
          </Link>

          {/* Other Links and LOGOUT button */}
          <Link href="/staffs">
            <div className='flex items-center px-6 py-3 text-white  font-semibold font-montserrat hover:bg-blue-300 transition duration-300'>
              {/* STAFFS Icon */}
              <svg className="w-5 h-5 mx-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                <path fillRule="evenodd" d="M7.5 6a4.5 4.5 0 1 1 9 0 4.5 4.5 0 0 1-9 0ZM3.751 20.105a8.25 8.25 0 0 1 16.498 0 .75.75 0 0 1-.437.695A18.683 18.683 0 0 1 12 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 0 1-.437-.695Z" clipRule="evenodd" />
              </svg>
              <span className={`${isCollapsed ? 'hidden' : 'block'}`}>STAFFS</span> {/* Text hidden on collapse */}
            </div>
          </Link>

          
            <Link href="manage">
            <div className='flex items-center px-6 py-3 text-white font-semibold hover:bg-blue-300 transition duration-300'>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-6">
  <path fillRule="evenodd" d="M18.685 19.097A9.723 9.723 0 0 0 21.75 12c0-5.385-4.365-9.75-9.75-9.75S2.25 6.615 2.25 12a9.723 9.723 0 0 0 3.065 7.097A9.716 9.716 0 0 0 12 21.75a9.716 9.716 0 0 0 6.685-2.653Zm-12.54-1.285A7.486 7.486 0 0 1 12 15a7.486 7.486 0 0 1 5.855 2.812A8.224 8.224 0 0 1 12 20.25a8.224 8.224 0 0 1-5.855-2.438ZM15.75 9a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z" clipRule="evenodd" />
</svg>


              <span className={`${isCollapsed ? 'hidden' : 'block'}`}>ACCOUNT</span>
            </div>
          </Link>


          {/* LOGOUT Button */}
          <div 
            onClick={handleLogout} 
            className='flex items-center px-6 py-3 text-white  font-semibold font-montserrat hover:bg-blue-300 transition duration-300 cursor-pointer'>
            {/* Logout icon */}
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-6">
              <path fillRule="evenodd" d="M16.5 3.75a1.5 1.5 0 0 1 1.5 1.5v13.5a1.5 1.5 0 0 1-1.5 1.5h-6a1.5 1.5 0 0 1-1.5-1.5V15a.75.75 0 0 0-1.5 0v3.75a3 3 0 0 0 3 3h6a3 3 0 0 0 3-3V5.25a3 3 0 0 0-3-3h-6a3 3 0 0 0-3 3V9A.75.75 0 1 0 9 9V5.25a1.5 1.5 0 0 1 1.5-1.5h6ZM5.78 8.47a.75.75 0 0 0-1.06 0l-3 3a.75.75 0 0 0 0 1.06l3 3a.75.75 0 0 0 1.06-1.06l-1.72-1.72H15a.75.75 0 0 0 0-1.5H4.06l1.72-1.72a.75.75 0 0 0 0-1.06Z" clipRule="evenodd" />
            </svg>
            <span className={`${isCollapsed ? 'hidden' : 'block'}`}>LOG OUT</span>
          </div>
          
        </div>
        </div>
        
    </section>
  );
};

export default Sidebar;



{/*
                                 {!isCollapsed && (
                           <div className="px-7 py-5 text-white mt-4">
                        <button
                              onClick={() => setIsIpVisible(prev => !prev)}
                               className="mb-2 text-xl text-white px-2 py-1 rounded hover:bg-white/10 transition"
                               aria-label="Toggle IP visibility"
                              >
                               ⋯
                               </button>

                             {ip ? (
                                <span className={`${isIpVisible ? 'block' : 'hidden'}`}>Connect to staff: {ip}:3001</span>
                             ) : (
                               <span className={`${isIpVisible ? 'block' : 'hidden'}`}>loading</span>
                              )}
                            </div>
                          )}*/}
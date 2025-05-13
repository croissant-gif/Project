'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

const Employees = () => {
  const [employees, setEmployees] = useState([]);
  const [name, setName] = useState('');
  const [message, setMessage] = useState("");
  const [lastName, setLastName] = useState('');
  const [address, setAddress] = useState('');
  const [contactNumber, setContactNumber] = useState('');
  const [schedule, setSchedule] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [isTimeModalOpen, setIsTimeModalOpen] = useState(false);
  const [tempStartTime, setTempStartTime] = useState('');
  const [tempEndTime, setTempEndTime] = useState('');
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false); 
  const router = useRouter();



  useEffect(() => {
    const username = localStorage.getItem("username");
    if (!username) {
      setMessage("You need to log in first.");
      router.push("/login");
      return;
    }
    const fetchEmployees = async () => {
      const response = await fetch('/api/todos/employee');
      const data = await response.json();
      setEmployees(data);
    };
    fetchEmployees();
  }, []);

  const addEmployee = async (e) => {
    e.preventDefault();
    const newEmployee = {
      name,
      lastName,
      address,
      contactNumber,
      schedule,
      username,
      password,
      assignedRooms: [],
    };

    const response = await fetch('/api/todos/employee', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newEmployee),
    });

    const addedEmployee = await response.json();
    setEmployees([...employees, addedEmployee]);
    setName('');
    setLastName('');
    setAddress('');
    setContactNumber('');
    setSchedule('');
    setUsername('');
    setPassword('');
    setIsModalOpen(false); // Close modal after adding
  };

  const removeEmployee = async (id) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this employee?');
    if (confirmDelete) {
      const response = await fetch('/api/todos/employee', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id }),
      });
      if (response.ok) {
        setEmployees(employees.filter((employee) => employee._id !== id));
      }
    }
  };

  const openDetailModal = (employee) => {
    setSelectedEmployee(employee);
    setIsDetailModalOpen(true);  // Open detail modal
  };
  
  const closeDetailModal = () => {
    setSelectedEmployee(null);
    setIsDetailModalOpen(false);  // Close detail modal
  };
  
  // Open and close functions for the time modal
  const openTimeModal = (employee) => {
    setSelectedEmployee(employee);
    setTempStartTime(employee.schedule ? employee.schedule.split(' - ')[0] : '');
    setTempEndTime(employee.schedule ? employee.schedule.split(' - ')[1] : '');
    setIsTimeModalOpen(true);  // Open time modal
  };
  
  const closeTimeModal = () => {
    setTempStartTime('');
    setTempEndTime('');
    setIsTimeModalOpen(false);  // Close time modal
  };

  const saveShift = async () => {
    const updatedEmployee = { ...selectedEmployee, schedule: `${tempStartTime} - ${tempEndTime}` };
    const updatedEmployees = employees.map((employee) =>
      employee._id === selectedEmployee._id ? updatedEmployee : employee
    );
    setEmployees(updatedEmployees);
    setIsTimeModalOpen(false);

    // Optionally, you can also update the employee in the backend
    try {
      const response = await fetch('/api/todos/employee', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ employeeId: selectedEmployee._id, schedule: `${tempStartTime} - ${tempEndTime}` }),
      });
      if (!response.ok) {
        throw new Error('Failed to update schedule');
      }
    } catch (error) {
      console.error('Error updating schedule:', error);
    }
  };

  return (
    <section className="w-full bg-gray-50 min-h-screen  font-montserrat">
      <div className="h-[7%] p-3 bg-zinc-300 flex justify-between items-center shadow-md">
        <h1 className="font-medium text-lg text-black">STAFF MANAGEMENT</h1>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-green-500 text-white p-2 rounded-xl hover:bg-green-600 transition duration-300"
        >
          Add Staff
        </button>
      </div>

      {/* Modal for adding employee */}
      {isModalOpen && !selectedEmployee && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-lg font-semibold mb-4 text-black ">Add New Employee</h2>
            <form onSubmit={addEmployee}>
              <input
                type="text"
                placeholder="First Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="border p-2 rounded w-full shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 text-black"
                required
              />
              <input
                type="text"
                placeholder="Last Name"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="border p-2 rounded w-full shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 mt-2 text-black"
                required
              />
              <input
                type="text"
                placeholder="Address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="border p-2 rounded w-full shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 mt-2 text-black"
                required
              />
              <input
                type="text"
                placeholder="Contact Number"
                value={contactNumber}
                onChange={(e) => setContactNumber(e.target.value)}
                className="border p-2 rounded w-full shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 mt-2 text-black"
                required
              />
              <input
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="border p-2 rounded w-full shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 mt-2 text-black"
                required
              />
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="border p-2 rounded w-full shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 mt-2 text-black"
                required
              />
              <div className="mt-4 flex justify-end">
                <button
                  type="submit"
                  className="bg-green-500 hover:bg-green-600 px-4 py-2 rounded-md transition mr-2 text-black"
                >
                  Add
                </button>
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded-md transition"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {isDetailModalOpen && selectedEmployee && (
  <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
    <div className="bg-white p-6 rounded-lg shadow-lg text-black">
      <h2 className="text-lg font-semibold mb-4">Employee Details</h2>
      <p><strong>Name:</strong> {selectedEmployee.name} {selectedEmployee.lastName}</p>
      <p><strong>Address:</strong> {selectedEmployee.address}</p>
      <p><strong>Contact Number:</strong> {selectedEmployee.contactNumber}</p>
      <p><strong>Username:</strong> {selectedEmployee.username}</p>
      <p><strong>Password:</strong> {selectedEmployee.password}</p>
      <button 
        type="button" 
        onClick={closeDetailModal} 
        className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md transition"
      >
        Close
      </button>
    </div>
  </div>
)}

{isTimeModalOpen && selectedEmployee && (
  <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
    <div className="bg-white p-6 rounded-lg shadow-lg text-black">
      <h2 className="text-lg font-semibold mb-4">Select Shift Time</h2>
      <div className="mb-4">
        <label htmlFor="start-time" className="block text-sm font-medium mb-2">Start Time</label>
        <input
          type="time"
          id="start-time"
          value={tempStartTime}
          onChange={(e) => setTempStartTime(e.target.value)}
          className="border p-2 rounded w-full shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 text-black"
        />
      </div>
      <div className="mb-4">
        <label htmlFor="end-time" className="block text-sm font-medium mb-2">End Time</label>
        <input
          type="time"
          id="end-time"
          value={tempEndTime}
          onChange={(e) => setTempEndTime(e.target.value)}
          className="border p-2 rounded w-full shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 text-black"
        />
      </div>
      <div className="mt-4 flex justify-end">
        <button onClick={saveShift} className="bg-green-500 hover:bg-green-600 px-4 py-2 rounded-md text-black">
          Save
        </button>
        <button onClick={closeTimeModal} className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded-md ml-2 text-black">
          Cancel
        </button>
      </div>
    </div>
  </div>
)}

      {/* Employee Table */}
    {/* Employees Table with consistent styling */}
<div className="overflow-x-auto max-h-[650px] overflow-y-auto font-montserrat">
  <table className="table-auto w-full rounded-2xl m-6 bg-white shadow-lg font-montserrat">
    <thead className="w-full h-12 bg-slate-100">
      <tr>
        <th className="p-3 text-left text-black">Name</th>
        <th className="p-3 text-left text-black">Shift</th>
        <th className="p-3 text-left text-black">Assigned Room</th>
        <th className="p-3 text-left text-black">Actions</th>
      </tr>
    </thead>
    <tbody>
      {employees.map((employee) => (
        <tr key={employee._id} className="hover:bg-gray-100 text-black">
          <td className="px-2 py-3">
            {employee.name} {employee.lastName}
          </td>
          <td
            className="px-2 py-3 cursor-pointer"
            onClick={() => openTimeModal(employee)}
          >
            {employee.schedule || 'Not set'}
          </td>
          <td className="px-2 py-3">
            {employee.assignedRooms.length > 0
              ? employee.assignedRooms.map((room) => room.roomName).join(', ')
              : 'Not assigned'}
          </td>
          <td className="px-2 py-3">
            <button
              onClick={() => openDetailModal(employee)}
              className="text-blue-500 hover:text-blue-700 transition mr-2"
            >
              Details
            </button>
            <button
              onClick={() => removeEmployee(employee._id)}
              className="bg-red-500 text-white p-2 rounded-full hover:bg-red-700 transition duration-300"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="w-5 h-5"
              >
                <path
                  fillRule="evenodd"
                  d="M16.5 4.478v.227a48.816 48.816 0 0 1 3.878.512.75.75 0 1 1-.256 1.478l-.209-.035-1.005 13.07a3 3 0 0 1-2.991 2.77H8.084a3 3 0 0 1-2.991-2.77L4.087 6.66l-.209.035a.75.75 0 0 1-.256-1.478A48.567 48.567 0 0 1 7.5 4.705v-.227c0-1.564 1.213-2.9 2.816-2.951a52.662 52.662 0 0 1 3.369 0c1.603.051 2.815 1.387 2.815 2.951Zm-6.136-1.452a51.196 51.196 0 0 1 3.273 0C14.39 3.05 15 3.684 15 4.478v.113a49.488 49.488 0 0 0-6 0v-.113c0-.794.609-1.428 1.364-1.452Zm-.355 5.945a.75.75 0 1 0-1.5.058l.347 9a.75.75 0 1 0 1.499-.058l-.346-9Zm5.48.058a.75.75 0 1 0-1.498-.058l-.347 9a.75.75 0 0 0 1.5.058l.345-9Z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          </td>
        </tr>
      ))}
    </tbody>
  </table>
</div>

    </section>
  );
};

export default Employees;

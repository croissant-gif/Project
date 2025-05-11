'use client'
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

const RoomSelection = () => {
  const [rooms, setRooms] = useState([]);
  const [message, setMessage] = useState("");
  const [roomName, setRoomName] = useState('');
  const [roomType, setRoomType] = useState('');
  const [isRoomModalOpen, setIsRoomModalOpen] = useState(false);
  const [specialRequestModalOpen, setSpecialRequestModalOpen] = useState(false);
  const [selectedRoomIndex, setSelectedRoomIndex] = useState(null);
  const [specialRequest, setSpecialRequest] = useState('');
  const [employees, setEmployees] = useState([]);
  const [reason, setReason] = useState('');
  const [status, setStatus] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [userConditions, setUserConditions] = useState([]);
  const [newCondition, setNewCondition] = useState('');
  const [isConditionModalOpen, setIsConditionModalOpen] = useState(false);
  const router = useRouter();
  const defaultConditions = [
    'Occupied Clean', 'Occupied Dirty', 'Occupied Ready', 'Vacant Clean', 'Vacant Dirty', 
    'Vacant Ready', 'Check Out', 'No Show', 'Do not Disturb', 'Out of Order', 'Out of Service', 
    'Status Unclear', 'Make up Room', 'Due Out', 'Did Not Check Out', 'House Use', 'Sleep Out'
  ];
//===============================================================================================================================================================================================================================================================
  const [currentPage, setCurrentPage] = useState(1);
  const roomsPerPage = 5; 
  const indexOfLastRoom = currentPage * roomsPerPage;
  const indexOfFirstRoom = indexOfLastRoom - roomsPerPage;
  const currentRooms = rooms.slice(indexOfFirstRoom, indexOfLastRoom);
  const totalPages = Math.ceil(rooms.length / roomsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };
  const renderPageNumbers = () => {
    const pageNumbers = [];
    for (let i = 1; i <= totalPages; i++) {
      pageNumbers.push(
        <button
          key={i}
          onClick={() => handlePageChange(i)}
          className={`px-3 py-1 mx-1 rounded-full ${currentPage === i ? 'bg-blue-500 text-white' : 'bg-gray-500'}`}
        >
          {i}
        </button>
      );
    }
    return pageNumbers;
  };
//=======================================================================================================================================================================================================
  // Fetch the user-added conditions from MongoDB
  const fetchUserConditions = async () => {
    try {
      const response = await fetch('/api/todos/conditions');
      const data = await response.json();
      if (data) {
        setUserConditions(data);
      }
    } catch (error) {
      console.error('Error fetching conditions from MongoDB:', error);
    }
  };
  useEffect(() => {
    const username = localStorage.getItem("username");
    if (!username) {
      setMessage("You need to log in first.");
      router.push("/login");
      return;
    }
    const storedRooms = localStorage.getItem('rooms');

    if (storedRooms) {
      setRooms(JSON.parse(storedRooms));
    } else {
      const fetchRooms = async () => {
        try {
          const response = await fetch('/api/todos/rooms');
          const data = await response.json();
          setRooms(data);
          localStorage.setItem('rooms', JSON.stringify(data));
        } catch (error) {
          console.error('Error fetching rooms:', error);
        }
      };
      fetchRooms();
    }
    
    fetchUserConditions();
  }, []);


  


  {/*============================================================================================================================================================================================================*/}
  const openConditionModal = () => {
    setIsConditionModalOpen(true);
  };
  const closeConditionModal = () => {
    setIsConditionModalOpen(false);
    setNewCondition('');
  };
{/*============================================================================================================================================================================================================*/}
  const addNewCondition = async () => {
    if (newCondition && !userConditions.includes(newCondition)) {
      const updatedConditions = [...userConditions, newCondition];
      setUserConditions(updatedConditions);
      try {
        const response = await fetch('/api/todos/conditions', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ newCondition })
        });

        if (!response.ok) {
          throw new Error('Failed to add condition to MongoDB');
        }
        const data = await response.json();
        console.log('Condition added to MongoDB:', data);
      } catch (error) {
        console.error('Error adding condition to MongoDB:', error);
      }
      closeConditionModal();
    } else {
      alert('Condition already exists or input is empty.');
    }
  };
{/*============================================================================================================================================================================================================*/}
  const deleteCondition = async (conditionToDelete) => {
    const updatedConditions = userConditions.filter(
      (condition) => condition.name !== conditionToDelete.name
    );
    setUserConditions(updatedConditions);
    try {
      const response = await fetch('/api/todos/conditions', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ condition: conditionToDelete.name }), // Only pass the name, not the entire object
      });
      if (!response.ok) {
        throw new Error('Failed to delete condition from MongoDB');
      }
      const data = await response.json();
      console.log('Condition deleted from MongoDB:', data);
    } catch (error) {
      console.error('Error deleting condition from MongoDB:', error);
    }
  };
//=============================================================================================================================================================================================================================
  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const response = await fetch('/api/todos/rooms');
        const data = await response.json();
        const formattedRooms = data.map(room => {
          return {
            ...room,
            startTime: room.startTime ? new Date(room.startTime).toLocaleString() : "No start time",
            finishTime: room.finishTime ? new Date(room.finishTime).toLocaleString() : "No finish time",
          };
        });
        setRooms(formattedRooms);
      } catch (error) {
        console.error('Error fetching rooms:', error);
      }
    };
    const fetchEmployees = async () => {
      try {
        const response = await fetch('/api/todos/employee');
        const data = await response.json();
        setEmployees(data); 
      } catch (error) {
        console.error('Error fetching employees:', error);
      }
    };
  
    fetchRooms();  
    fetchEmployees();
  }, []);
  
{/*============================================================================================================================================================================================================*/}
 const handleSpecialRequestChange = (e) => {
    setSpecialRequest(e.target.value);
  };
  const openSpecialRequestModal = (index) => {
    setSelectedRoomIndex(index);
    setSpecialRequest(rooms[index].specialRequest || ''); 
    setSpecialRequestModalOpen(true);
  };
  const closeSpecialRequestModal = () => {
    setSpecialRequestModalOpen(false);
    setSelectedRoomIndex(null);
    setSpecialRequest('');
  };

  const saveSpecialRequest = async () => {
  const updatedRoom = { ...rooms[selectedRoomIndex], specialRequest };
  try {
    const response = await fetch('/api/todos/rooms', {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        id: updatedRoom._id,
        specialRequest: updatedRoom.specialRequest,
      }), 
    });
    if (!response.ok) {
      throw new Error('Failed to update special request');
    }
    const updatedRooms = [...rooms];
    updatedRooms[selectedRoomIndex] = updatedRoom;
    setRooms(updatedRooms);
    closeSpecialRequestModal();
  } catch (error) {
    console.error('Error saving special request:', error);
  }
};

//=============================================================================================================================================================================================================================
  const handleEmployeeChange = (roomIndex, employeeId) => {
    const updatedRooms = [...rooms];
    const roomId = updatedRooms[roomIndex]._id;
    const previousEmployeeId = updatedRooms[roomIndex].assignedTo;
    if (employeeId && previousEmployeeId !== employeeId) {
      updatedRooms[roomIndex].startTime = null;  
      updatedRooms[roomIndex].finishTime = null;
    }
    updatedRooms[roomIndex].assignedTo = employeeId || null;   
    setRooms(updatedRooms);
    if (!employeeId) {
      if (previousEmployeeId) {
 
        fetch('/api/todos/employee', {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            employeeId: previousEmployeeId,   
            roomId: roomId,          
            action: 'remove',          
          }),
        })
          .then((response) => {
            if (!response.ok) {
              throw new Error('Failed to remove room from previous employee');
            }
            return response.json();
          })
          .then((data) => {
            console.log('Room removed from previous employee:', data);
          })
          .catch((error) => console.error('Error removing room from previous employee:', error));
      }
    } else {
      if (employeeId !== previousEmployeeId) {
        if (previousEmployeeId) {
          fetch('/api/todos/employee', {
            method: 'PATCH',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              employeeId: previousEmployeeId,   
              roomId: roomId,                  
              action: 'remove',              
            }),
          })
            .then((response) => {
              if (!response.ok) {
                throw new Error('Failed to remove room from previous employee');
              }
              return response.json();
            })
            .then((data) => {
              console.log('Room removed from previous employee:', data);
            })
            .catch((error) => console.error('Error removing room from previous employee:', error));
        }
        fetch('/api/todos/employee', {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            employeeId,  
            roomId,    
            action: 'add',  
          }),
        })
          .then((response) => {
            if (!response.ok) {
              throw new Error('Failed to assign room to new employee');
            }
            return response.json();
          })
          .then((data) => {
            console.log('Employee assigned to room successfully:', data);
          })
          .catch((error) => console.error('Error assigning room to new employee:', error));
      }
    }
    fetch('/api/todos/rooms', {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        id: roomId,
        assignedTo: employeeId || null,
        startTime: null,  
        finishTime: null,
      }),
    })
    
    .then((response) => {
      if (!response.ok) {
        throw new Error('Failed to update room assignment');
      }
    })
    .catch((error) => console.error('Error updating room assignment:', error));
  };
//=============================================================================================================================================================================================================================

  const addRoom = async (e) => {
    e.preventDefault();
    const newRoom = {
      roomName,
      roomType,
      specialRequest: '',
      assignedTo: null,
      status: 'Vacant Clean',
      arrivalDate: '',
      departureDate: '',
      arrivalTime: '',
    };

    try {
      const response = await fetch('/api/todos/rooms', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newRoom),
      });

      if (!response.ok) {
        throw new Error('Failed to add room');
      }

      const savedRoom = await response.json();
      setRooms((prevRooms) => [...prevRooms, savedRoom]);
      setRoomName('');
      setRoomType('');
      setIsRoomModalOpen(false);
    } catch (error) {
      console.error('Error adding room:', error);
    }
  };
//=============================================================================================================================================================================================================================
const deleteRoom = async (roomId) => {
  const roomToDelete = rooms.find(room => room._id === roomId);
  if (!roomToDelete) return;

  const isConfirmed = window.confirm(
    `Are you sure you want to delete the room "${roomToDelete.roomName}"? This action cannot be undone.`
  );

  if (!isConfirmed) return;

  try {
    const assignedEmployeeId = roomToDelete.assignedTo;

    if (assignedEmployeeId) {
      const employeeUpdateResponse = await fetch('/api/todos/employee', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          employeeId: assignedEmployeeId,
          roomId: roomToDelete._id,
          action: 'remove',
        }),
      });

      if (!employeeUpdateResponse.ok) {
        throw new Error('Failed to update employee assignedRooms');
      }
    }

    await fetch('/api/todos/roomitems', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ roomId: roomToDelete._id }),
    });

    await fetch('/api/todos/rooms', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: roomToDelete._id }),
    });

    // Remove room from local state
    const updatedRooms = rooms.filter(room => room._id !== roomId);
    setRooms(updatedRooms);

  } catch (error) {
    console.error('Error deleting room and inventory:', error);
  }
};


//=====================================================================================================================================================================================================

const handleRoomChange = async (e, index, field) => {
  const newValue = e.target.value;
  const updatedRooms = [...rooms];
  updatedRooms[index][field] = newValue;
  setRooms(updatedRooms);
  localStorage.setItem('rooms', JSON.stringify(updatedRooms));


  if (newValue === "Out of Order" || newValue === "Out of Service") {
    setSelectedRoomIndex(index);
    setIsModalOpen(true)
    return;  
  }

 
  const updatedRoom = updatedRooms[index];
  try {
    const response = await fetch('/api/todos/rooms', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updatedRoom),
    });

    if (!response.ok) {
      throw new Error('Failed to update room status');
    }
  } catch (error) {
    console.error('Error updating room status:', error);
  }
};


const handleReasonChange = (e) => {
  setReason(e.target.value);
};

const saveReason = async () => {
  if (selectedRoomIndex !== null) {
    const updatedRooms = [...rooms];
    updatedRooms[selectedRoomIndex].reason = reason;
    setRooms(updatedRooms);
    localStorage.setItem('rooms', JSON.stringify(updatedRooms));
    setIsModalOpen(false); 
    const updatedRoom = updatedRooms[selectedRoomIndex];
    try {
      const response = await fetch('/api/todos/rooms', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedRoom),
      });
      if (!response.ok) {
        throw new Error('Failed to update room status');
      }
    } catch (error) {
      console.error('Error updating room status in MongoDB:', error);
    }
  }
};
 //============================================================================================================================================================================================================================= 

  return (
    <section className="w-full h-screen bg-white">
<div className="h-[7%] p-3 bg-zinc-300 flex justify-between items-center shadow-md">
  <h1 className="font-medium text-lg text-black">ROOMS</h1>
  <div className="flex space-x-4">
    <button
      onClick={openConditionModal}
      className="bg-blue-500 text-white p-2 rounded-xl hover:bg-blue-600 transition duration-300"
    >
      Add Room Status
    </button>

    <button
      onClick={() => setIsRoomModalOpen(true)}
      className="bg-green-500 text-white p-2 rounded-xl hover:bg-green-600 transition duration-300 "
    >
      Add Room
    </button>
  </div>
</div>

{/*=============================================================================================================================================================================================================================

  {/* Modal for Reason */}
  {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50  z-20">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-lg font-semibold mb-4 text-black">Reason </h2>
            <textarea
              value={reason}
              onChange={handleReasonChange}
              className="border p-2 rounded w-full h-24 text-black"
              placeholder="Enter the reason for out of order or service"
            ></textarea>
            <div className="mt-4 flex justify-end">
              <button
                onClick={saveReason}
                className="bg-blue-500 text-white px-4 py-2 rounded-md transition mr-2"
              >
                Save
              </button>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="bg-red-500 text-white px-4 py-2 rounded-md transition"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
{/*============================================================================================================================================================================================================================= */}
{/* Modal for Adding New Condition */}
{isConditionModalOpen && (
  <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-20">
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <h2 className="text-lg font-semibold mb-4 text-black">Add New Status</h2>
      
      {/* Input for adding a new condition */}
      <input
        type="text"
        value={newCondition}
        onChange={(e) => setNewCondition(e.target.value)}
        className="border p-2 rounded w-full mb-4 text-black"
        placeholder="Enter new status"
      />
      
      <div className="mt-4 flex justify-end">
        <button
          onClick={addNewCondition}
          className="bg-green-500 text-white px-4 py-2 rounded-md transition mr-2"
        >
          Add
        </button>
        <button
          onClick={closeConditionModal}
          className="bg-red-500 text-white px-4 py-2 rounded-md transition"
        >
          Cancel
        </button>
      </div>

      <h3 className="mt-4 font-semibold text-black">Your Added Status:</h3>
      <ul className="mt-2 text-gray-600">
        {userConditions.map((condition) => (
          <li key={condition._id || condition} className="flex justify-between items-center">
            {condition.name || condition}  
            
            <button
              onClick={() => deleteCondition(condition)}  // Use the entire condition object for deletion
              className="text-red-500 ml-2"
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  </div>
)}
 {/*============================================================================================================================================================================================================================= 
       {/* Special Request Modal */}
       {specialRequestModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-20">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-lg font-semibold mb-4 text-black">Special Request</h2>
            <textarea
              value={specialRequest}
              onChange={handleSpecialRequestChange}
              className="border p-2 rounded w-full h-24 text-black"
              placeholder="Enter special request..."
            ></textarea>
            <div className="mt-4 flex justify-end">
              <button onClick={saveSpecialRequest} className="bg-blue-500 text-white px-4 py-2 rounded-md transition mr-2">
                Save
              </button>
              <button
                type="button"
                onClick={() => setSpecialRequestModalOpen(false)}
                className="bg-red-500 text-white px-4 py-2 rounded-md transition"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal for Adding Room */}
      {isRoomModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50  z-20">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-lg font-semibold mb-4 text-black">Add New Room</h2>
            <form onSubmit={addRoom}>
              <input
                type="text"
                placeholder="Room Name"
                value={roomName}
                onChange={(e) => setRoomName(e.target.value)}
                className="border p-2 rounded w-full shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 text-black"
                required
              />
              <select
                value={roomType}
                onChange={(e) => setRoomType(e.target.value)}
                className="border p-2 rounded w-full shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 mt-2 text-black"
                required
              >
                <option value="">Select Room Type</option>
                <option value="Junior Suite">Junior Suite</option>
                <option value="Superior">Superior</option>
                <option value="Deluxe">Deluxe</option>
                <option value="Ambassador">Ambassador</option>
                <option value="Ambassador Suite">Ambassador Suite</option>
                <option value="Deluxe 1 King Bed">Deluxe 1 King Bed</option>
                <option value="Superior 1 King Bed">Superior 1 King Bed</option>
                <option value="Deluxe 2 Beds">Deluxe 2 Beds</option>
                <option value="Superior 2 Beds">Superior 2 Beds</option>
                <option value="Premium">Premium</option>
                <option value="Premium Suite"> Premium Suite</option>
                <option value="Standard">Standard</option>
                <option value="Ocean front">Ocean front</option>
              </select>
              <div className="mt-4 flex justify-end">
                <button type="submit" className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md transition mr-2">
                  Add
                </button>
                <button
                  type="button"
                  onClick={() => setIsRoomModalOpen(false)}
                  className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md transition"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}


{specialRequestModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-lg font-semibold mb-4 text-black">Special Request</h2>
            <textarea
              value={specialRequest}
              onChange={handleSpecialRequestChange}
              className="border p-2 rounded w-full h-24 text-black"
              placeholder="Enter special request..."
            ></textarea>
            <div className="mt-4 flex justify-end">
              <button onClick={saveSpecialRequest} className="bg-blue-500 text-white px-4 py-2 rounded-md transition mr-2">
                Save
              </button>
              <button
                type="button"
                onClick={() => setSpecialRequestModalOpen(false)}
                className="bg-red-500 text-white px-4 py-2 rounded-md transition"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
{/*============================================================================================================================================================================================================*/}
      {/* Rooms Table */}
      <div className="overflow-x-auto max-h-[650px] overflow-y-auto">
      <table className="table-auto w-full rounded-2xl m-6 bg-white shadow-lg">
      <thead className="w-full h-12 bg-slate-100">
            <tr>
              <th className="p-3 text-left text-black">Room Name</th>
              <th className="p-3 text-left text-black">Room Type</th>
              <th className="p-3 text-left text-black">Status</th>
              <th className="p-3 text-left text-black">Arrival Date</th>
              <th className="p-3 text-left text-black">Departure Date</th>
              <th className="p-3 text-left text-black">Arrival Time</th>
              <th className="p-3 text-left text-black">Assigned To</th>
              <th className="p-3 text-left text-black">Actions</th>
            </tr>
          </thead>
          <tbody>
            {rooms.map((room, index) => (
              <tr
                key={room._id}
                className={`hover:bg-gray-100 text-black ${room.status === "CLEANING" ? "bg-green-100" : ""} 
                  ${room.status === "Out of Order" || room.status === "Out of Service" ? "bg-red-200" : ""}`}
              >
                <td className="px-2 py-3">{room.roomName}</td>
                <td className="px-2 py-3">{room.roomType}</td>
                <td className="px-2 py-3">
                  <select
                    value={room.status}
                    onChange={(e) => handleRoomChange(e, index, 'status')}
                    className="border border-slate-300 rounded p-1 text-sm"
                  >
                    {room.status === "CLEANING" && (
                      <option value="CLEANING" disabled>
                        CLEANING...
                      </option>
                    )}
                    {defaultConditions.map((condition, index) => (
                      <option key={index} value={condition}>
                        {condition}
                      </option>
                    ))}
                    {userConditions.map((condition, index) => (
                      <option key={index} value={condition.name || condition}>
                        {condition.name || condition}
                      </option>
                    ))}
                  </select>

        {/* Display Reason if Status is OOO or OOS */}
        {(room.status === 'Out of Order' || room.status === 'Out of Service') && room.reason && (
          <p className="mt-1 text-sm text-gray-600">Reason: {room.reason}</p>
        )}
      </td>

      {/* Arrival and Departure Dates */}
      <td className="px-2 py-3">
        <input
          type="date"
          value={room.arrivalDate ? new Date(room.arrivalDate).toISOString().split('T')[0] : ''}
          onChange={(e) => handleRoomChange(e, index, 'arrivalDate')}
          className="border border-slate-300 rounded p-1 text-sm"
        />
      </td>
      <td className="px-2 py-3">
        <input
          type="date"
          value={room.departureDate ? new Date(room.departureDate).toISOString().split('T')[0] : ''}
          onChange={(e) => handleRoomChange(e, index, 'departureDate')}
          className="border border-slate-300 rounded p-1 text-sm"
        />
      </td>

      {/* Arrival Time */}
      <td className="px-2 py-3">
        <input
          type="time"
          value={room.arrivalTime}
          onChange={(e) => handleRoomChange(e, index, 'arrivalTime')}
          className="border border-slate-300 rounded p-1 text-sm"
        />
      </td>

      {/* Employee Assignment */}
      <td className="px-2 py-3">
  <select
    value={room.assignedTo || ''}
    onChange={(e) => handleEmployeeChange(index, e.target.value)}
    className='w-32 border border-slate-200 rounded pl-1 pr-1 py-2'
  >
    <option value="">No assigned</option>
    {employees.map((employee) => (
      <option key={employee._id} value={employee._id}>
        {employee.name}
      </option>
    ))}
  </select>

  {/* Display Start Time if Available */}
  {room.startTime && !isNaN(new Date(room.startTime).getTime()) && (
    <>
      <p className="mt-1 text-sm text-gray-600">
        Start Time: {new Date(room.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
      </p>
    </>
  )}

  {/* Display Finish Time if Available */}
  {room.finishTime && !isNaN(new Date(room.finishTime).getTime()) && (
    <>
      <p className="mt-1 text-sm text-gray-600">
        Finish Time: {new Date(room.finishTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
      </p>
    </>
  )}
</td>

      {/* Buttons for Special Request and Deletion */}
      <td className="px-2 py-3">
        <button
          onClick={() => {
            setSelectedRoomIndex(index);
            setSpecialRequest(room.specialRequest || ''); // Pre-fill if any special request
            setSpecialRequestModalOpen(true);
          }}
          className={`p-2 rounded-full transition duration-300 ${room.specialRequest ? 'bg-green-500 text-white hover:bg-green-600' : 'bg-gray-500 text-white hover:bg-gray-600'}`}
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-5 h-5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 9.75a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H8.25m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H12m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0h-.375m-13.5 3.01c0 1.6 1.123 2.994 2.707 3.227 1.087.16 2.185.283 3.293.369V21l4.184-4.183a1.14 1.14 0 0 1 .778-.332 48.294 48.294 0 0 0 5.83-.498c1.585-.233 2.708-1.626 2.708-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0 0 12 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018Z" />
          </svg>
        </button>

        <button
         onClick={() => deleteRoom(room._id)}
          className="bg-red-500 text-white p-2 rounded-full hover:bg-red-700 transition duration-300"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
            <path fillRule="evenodd" d="M16.5 4.478v.227a48.816 48.816 0 0 1 3.878.512.75.75 0 1 1-.256 1.478l-.209-.035-1.005 13.07a3 3 0 0 1-2.991 2.77H8.084a3 3 0 0 1-2.991-2.77L4.087 6.66l-.209.035a.75.75 0 0 1-.256-1.478A48.567 48.567 0 0 1 7.5 4.705v-.227c0-1.564 1.213-2.9 2.816-2.951a52.662 52.662 0 0 1 3.369 0c1.603.051 2.815 1.387 2.815 2.951Zm-6.136-1.452a51.196 51.196 0 0 1 3.273 0C14.39 3.05 15 3.684 15 4.478v.113a49.488 49.488 0 0 0-6 0v-.113c0-.794.609-1.428 1.364-1.452Zm-.355 5.945a.75.75 0 1 0-1.5.058l.347 9a.75.75 0 1 0 1.499-.058l-.346-9Zm5.48.058a.75.75 0 1 0-1.498-.058l-.347 9a.75.75 0 0 0 1.5.058l.345-9Z" clipRule="evenodd" />
          </svg>
        </button>
      </td>
    </tr>
  ))}
</tbody>
        </table>
{/*============================================================================================================================================================================================================*/}
      </div>   
   

    </section>
  );
};

export default RoomSelection;

'use client'
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

const RoomSelection = () => {
  const [rooms, setRooms] = useState([]);
  const [message, setMessage] = useState("");
  const [roomName, setRoomName] = useState('');
  const [roomType, setRoomType] = useState('');
  const [viewScheduleModal, setViewScheduleModal] = useState(false);
const [selectedScheduleRoom, setSelectedScheduleRoom] = useState(null);
  const [isRoomModalOpen, setIsRoomModalOpen] = useState(false);
  const [specialRequestModalOpen, setSpecialRequestModalOpen] = useState(false);
  const [selectedRoomIndex, setSelectedRoomIndex] = useState(null);
  const [assignmentMap, setAssignmentMap] = useState({});
  const [scheduleData, setScheduleData] = useState(null);
const [isLoadingSchedule, setIsLoadingSchedule] = useState(false);
  const [specialRequest, setSpecialRequest] = useState('');
  const [employees, setEmployees] = useState([]);
  const [reason, setReason] = useState('');
  const [status, setStatus] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
   const [isReasonModalOpen, setIsReasonModalOpen] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [userConditions, setUserConditions] = useState([]);
  const [newCondition, setNewCondition] = useState('');
  const [isConditionModalOpen, setIsConditionModalOpen] = useState(false);
  const router = useRouter();
  const defaultConditions = [
    'Occupied Clean', 'Occupied Dirty', 'Occupied Ready', 'Vacant Clean', 'Vacant Dirty', 
    'Vacant Ready', 'Check Out', 'No Show', 'Do not Disturb', 'Out of Order', 'Out of Service', 
    'Status Unclear', 'Make up Room', 'Due Out', 'Did Not Check Out', 'House Use', 'Sleep Out'
  ];
 
   // 🆕 Added for assignment modal
 
const [selectedEmployeeId, setSelectedEmployeeId] = useState(null);
const [schedule_date, setScheduleDate] = useState('');

const [schedule_start, setScheduleStart] = useState('');
const [schedule_finish, setScheduleFinish] = useState('');
 
 

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


  
useEffect(() => {
  localStorage.removeItem('rooms');
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
      const formattedRooms = data.map(room => ({
        ...room,
        startTime: room.startTime ? new Date(room.startTime).toLocaleString() : "No start time",
        finishTime: room.finishTime ? new Date(room.finishTime).toLocaleString() : "No finish time",
      }));
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

  // Fetch immediately on component mount
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

  // 🆕 Open modal if employee is being assigned
  if (employeeId && employeeId !== previousEmployeeId) {
    setSelectedRoomIndex(roomIndex);
    setSelectedEmployeeId(employeeId);
    setIsModalOpen(true);
  }

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

 
    const updatedRooms = rooms.filter(room => room._id !== roomId);
    setRooms(updatedRooms);

  } catch (error) {
    console.error('Error deleting room and inventory:', error);
  }
};


//=====================================================================================================================================================================================================

const handleRoomChange = async (e, index, field) => {
  const value = e.target.value;
  const updatedRooms = [...rooms];
  const room = updatedRooms[index];

  // 🧠 Detect when status is being changed
  if (field === "status") {
    const previousStatus = room.status;

    // Update the status locally
    room.status = value;

    // ✅ If the old status was Out of Order/Service and the new one isn't — clear the reason
    if (
      (previousStatus === "Out of Order" || previousStatus === "Out of Service") &&
      (value !== "Out of Order" && value !== "Out of Service")
    ) {
      room.reason = ""; // clear it locally

      // Also clear it in the database
      try {
        await fetch("/api/todos/rooms", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            _id: room._id,
            status: value,
            reason: "", // clear it server-side
          }),
        });
      } catch (error) {
        console.error("Error clearing reason when changing status:", error);
      }

      setRooms(updatedRooms);
      localStorage.setItem("rooms", JSON.stringify(updatedRooms));
      return;
    }

    // 🧩 If new status is Out of Order/Service → open modal (existing logic)
    if (value === "Out of Order" || value === "Out of Service") {
      setSelectedRoomIndex(index);
      setIsReasonModalOpen(true);
      return;
    }
  }

  // ✅ Default behavior for other fields
  room[field] = value;
  setRooms(updatedRooms);
  localStorage.setItem("rooms", JSON.stringify(updatedRooms));

  // Persist to DB for normal field changes
  try {
    await fetch("/api/todos/rooms", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(room),
    });
  } catch (error) {
    console.error("Error updating room:", error);
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
    setIsReasonModalOpen(false); 
    const updatedRoom = updatedRooms[selectedRoomIndex];
    try {
      const response = await fetch('/api/todos/rooms', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
    body: JSON.stringify({
  _id: updatedRoom._id, // ✅ ensure ID field is present
  status: updatedRoom.status,
  reason: updatedRoom.reason,
}),

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
  <section className="w-full bg-gray-50 min-h-screen font-montserrat">
  <div className="h-[7%] p-3 bg-zinc-300 flex justify-between items-center shadow-md">
  <h1 className="font-medium text-lg text-black font-montserrat">ROOMS</h1>
  <div className="flex space-x-4">
<button
  onClick={openConditionModal}
  className="bg-blue-500 text-white p-2 rounded-xl hover:bg-blue-600 transition duration-200 font-montserrat transform active:scale-95"
>
  Add Room Status
</button>
    <button
      onClick={() => setIsRoomModalOpen(true)}
      className="bg-green-500 text-white p-2 rounded-xl hover:bg-green-600 transition duration-300 font-montserrat transform active:scale-95"
    >
      Add Room
    </button>
  </div>
 </div>

{/*=============================================================================================================================================================================================================================

  {/* Modal for Reason */}
  {isReasonModalOpen && !selectedRoom && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50  z-20">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-lg font-semibold mb-4 text-black font-montserrat">Reason </h2>
            <textarea
              value={reason}
              onChange={handleReasonChange}
              className="border p-2 rounded w-full h-24 text-black font-montserrat"
              placeholder="Enter the reason for out of order or service "
            ></textarea>
            <div className="mt-4 flex justify-end font-montserrat">
              <button
                onClick={saveReason}
                className="bg-blue-500 text-white px-4 py-2 rounded-md transition mr-2 font-montserrat transform active:scale-95"
              >
                Save
              </button>
              <button
                type="button"
                onClick={() => setIsReasonModalOpen(false)}
                className="bg-red-500 text-white px-4 py-2 rounded-md transition font-montserrat transform active:scale-95"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

  
{/*============================================================================================================================================================================================================================= */}
{/* Modal for Adding New Condition */}
{isConditionModalOpen &&   (
  <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-20">
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <h2 className="text-lg font-semibold mb-4 text-black font-montserrat">Add New Status</h2>
      
      {/* Input for adding a new condition */}
      <input
        type="text"
        value={newCondition}
        onChange={(e) => setNewCondition(e.target.value)}
        className="border p-2 rounded w-full mb-4 text-black font-montserrat"
        placeholder="Enter new status"
      />
      
      <div className="mt-4 flex justify-end">
        <button
          onClick={addNewCondition}
          className="bg-green-500 text-white px-4 py-2 rounded-md transition mr-2 font-montserrat transform active:scale-95"
        >
          Add
        </button>
        <button
          onClick={closeConditionModal}
          className="bg-red-500 text-white px-4 py-2 rounded-md transition font-montserrat transform active:scale-95"
        >
          Cancel
        </button>
      </div>

      <h3 className="mt-4 font-semibold text-black font-montserrat">Your Added Status:</h3>
      <ul className="mt-2 text-gray-600 font-montserrat">
        {userConditions.map((condition) => (
          <li key={condition._id || condition} className="flex justify-between items-center">
            {condition.name || condition}  
            
            <button
              onClick={() => deleteCondition(condition)}  // Use the entire condition object for deletion
              className="text-red-500 ml-2 font-montserrat transform active:scale-95"
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
       {specialRequestModalOpen &&   (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-20">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-lg font-semibold mb-4 text-black font-montserrat">Special Request</h2>
            <textarea
              value={specialRequest}
              onChange={handleSpecialRequestChange}
              className="border p-2 rounded w-full h-24 text-black font-montserrat"
              placeholder="Enter special request..."
            ></textarea>
            <div className="mt-4 flex justify-end   font-montserrat">
              <button onClick={saveSpecialRequest} className="bg-blue-500 text-white px-4 py-2 rounded-md transition mr-2 transform active:scale-95">
                Save
              </button>
              <button
                type="button"
                onClick={() => setSpecialRequestModalOpen(false)}
                className="bg-red-500 text-white px-4 py-2 rounded-md transition transform active:scale-95"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal for Adding Room */}
      {isRoomModalOpen &&   (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50  z-20 font-montserrat">
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
                <button type="submit" className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md transition mr-2 transform active:scale-95">
                  Add
                </button>
                <button
                  type="button"
                  onClick={() => setIsRoomModalOpen(false)}
                  className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md transition transform active:scale-95"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}


{specialRequestModalOpen &&   (
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
              <button onClick={saveSpecialRequest} className="bg-blue-500 text-white px-4 py-2 rounded-md transition mr-2 font-montserrat transform active:scale-95">
                Save
              </button>
              <button
                type="button"
                onClick={() => setSpecialRequestModalOpen(false)}
                className="bg-red-500 text-white px-4 py-2 rounded-md transition transform active:scale-95"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
{/*============================================================================================================================================================================================================*/}
    {viewScheduleModal && selectedScheduleRoom && (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div className="bg-white p-6 rounded shadow-lg w-[300px]">
      <h2 className="text-lg font-semibold mb-4">Assigned Cleaning Schedule</h2>

      {isLoadingSchedule ? (
        <p>Loading...</p>
      ) : scheduleData ? (
        <>
          <p className="mb-2 text-sm">
            <strong>Date:</strong> {scheduleData.schedule_date}
          </p>
          <p className="mb-2 text-sm">
            <strong>Start Time:</strong> {scheduleData.schedule_start}
          </p>
          <p className="mb-4 text-sm">
            <strong>Finish Time:</strong> {scheduleData.schedule_finish}
          </p>
        </>
      ) : (
        <p className="text-sm text-red-500">No schedule data found.</p>
      )}

      <div className="flex justify-end">
        <button
          onClick={() => {
            setViewScheduleModal(false);
            setSelectedScheduleRoom(null);
            setScheduleData(null);
          }}
          className="bg-gray-300 px-3 py-1 rounded hover:bg-gray-400"
        >
          Close
        </button>
      </div>
    </div>
  </div>
)}



     {isModalOpen && (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div className="bg-white p-6 rounded shadow-lg w-[300px]">
      <h2 className="text-lg font-semibold mb-4">Assign Cleaning Time</h2>

      <div className="mb-2">
        <label className="block text-sm">Date:</label>
        <input
          type="date"
          value={schedule_date}
onChange={(e) => setScheduleDate(e.target.value)}

          className="w-full border rounded p-1"
        />
      </div>

      <div className="mb-2">
        <label className="block text-sm">Start Time:</label>
        <input
          type="time"
         value={schedule_start}
onChange={(e) => setScheduleStart(e.target.value)}

          className="w-full border rounded p-1"
        />
      </div>

      <div className="mb-4">
        <label className="block text-sm">Finish Time:</label>
        <input
          type="time"
       value={schedule_finish}
onChange={(e) => setScheduleFinish(e.target.value)}

          className="w-full border rounded p-1"
        />
      </div>

      <div className="flex justify-end gap-2">
        <button
          onClick={() => setIsModalOpen(false)}
          className="bg-gray-300 px-3 py-1 rounded"
        >
          Cancel
        </button>

        <button
          onClick={async () => {
            const updatedRooms = [...rooms];
            const selectedRoom = updatedRooms[selectedRoomIndex];

            // Update local state
           selectedRoom.assignmentDetails = {
  schedule_date,
  schedule_start,
  schedule_finish,
};
selectedRoom.schedule_start = schedule_start;
selectedRoom.schedule_finish = schedule_finish;

            setRooms(updatedRooms);

            // Persist to backend
            try {
              const response = await fetch('/api/todos/employee', {
                method: 'PATCH',
                headers: {
                  'Content-Type': 'application/json',
                },
               body: JSON.stringify({
  employeeId: selectedEmployeeId,
  roomId: selectedRoom._id,
  action: 'add',
  schedule_date,
  schedule_start,
  schedule_finish,
}),

              });

              if (!response.ok) {
                throw new Error('Failed to assign room with time');
              }

              const result = await response.json();
              console.log('Room assigned with time:', result);
            } catch (error) {
              console.error('Error assigning room with time:', error);
            }

            // Reset modal state
            setIsModalOpen(false);
          setScheduleDate('');
 setScheduleStart('');
 setScheduleFinish('');
          }}
          className="bg-blue-600 text-white px-3 py-1 rounded"
       disabled={!schedule_date || !schedule_start || !schedule_finish}

        >
          Save
        </button>
      </div>
    </div>
  </div>
)}


     
      {/* Rooms Table */}
      <div className="overflow-x-auto max-h-[650px] overflow-y-auto font-montserrat">
  <table className="table-auto w-full rounded-2xl m-6 bg-white shadow-lg font-montserrat">
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
  onClick={async () => {
    if (!room.assignedTo) return;

    setIsLoadingSchedule(true);

    try {
     const response = await fetch(`/api/todos/employee?id=${room.assignedTo}`);

      if (!response.ok) throw new Error("Failed to fetch employee data");

      const employee = await response.json();

      const assignedRoom = employee.assignedRooms?.find((r) => {
        const roomIdFromMongo = typeof r.roomId === 'object' ? r.roomId.$oid || r.roomId : r.roomId;
        return roomIdFromMongo === room._id;
      });

      if (assignedRoom) {
        setScheduleData(assignedRoom); // Save the schedule info to modal state
      } else {
        setScheduleData(null);
      }
    } catch (error) {
      console.error("Error fetching schedule data:", error);
      setScheduleData(null);
    } finally {
      setIsLoadingSchedule(false);
      setSelectedScheduleRoom(room); // Show the modal anyway
      setViewScheduleModal(true);
    }
  }}
  disabled={!room.assignedTo}
  className={`p-2 rounded-full ml-1 transition duration-300 ${
    room.assignedTo
      ? "bg-blue-500 text-white hover:bg-blue-600"
      : "bg-gray-300 text-gray-500 cursor-not-allowed"
  }`}
  title={
    room.assignedTo
      ? "View or Assign Cleaning Schedule"
      : "Assign employee first"
  }
>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="w-5 h-5"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
    />
  </svg>
</button>


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
      </div>   
   

    </section>
  );
};

export default RoomSelection;


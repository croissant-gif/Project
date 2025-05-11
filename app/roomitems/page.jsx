'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

const InventoryPage = () => {
  const [rooms, setRooms] = useState([]);
  const [inventories, setInventories] = useState([]);
  const [selectedRoom, setSelectedRoom] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [customPresetName, setCustomPresetName] = useState(''); 
  const [isDeleteMode, setIsDeleteMode] = useState(false); 
  const [customPresetPrice, setCustomPresetPrice] = useState(''); 
const [selectedCategory, setSelectedCategory] = useState('');
  const [activeCategory, setActiveCategory] = useState("mini-bar");
  const itemsPerPage = 99;
  const categories = ["bathroom", "living-room", "mini-bar"];
  const router = useRouter();
  const [message, setMessage] = useState("");


  // To store dynamically added preset items
  const [dynamicPresetItems, setDynamicPresetItems] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
        setDynamicPresetItems(data); // Update state with the fetched data
      } catch (err) {
        setError(err.message); // Handle any errors
      } finally {
        setLoading(false); // Set loading to false after the fetch completes
      }
    };

    fetchPresetItems(); // Call the function to fetch the items
  }, []);  

 
  if (error) {
    return <div>Error: {error}</div>;
  }

  
  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const response = await fetch('/api/todos/rooms');
        if (response.ok) {
          const data = await response.json();
          setRooms(data);
        } else {
          console.error('Failed to fetch rooms');
        }
      } catch (error) {
        console.error('Error fetching rooms:', error);
      }
    };

    fetchRooms();
  }, []);
//=============================================================================================================================================================================================================================

useEffect(() => {
  if (rooms.length > 0 && selectedRoom) {
    const fetchInventories = async () => {
      const roomId = rooms[selectedRoom - 1]?._id; 

      if (!roomId) {
        console.error('Room ID is invalid');
        return;
      }

      try {
        const response = await fetch(`/api/todos/roomitems?roomId=${roomId}`);
        if (response.ok) {
          const data = await response.json();
          setInventories((prevInventories) => {
            const updatedInventories = [...prevInventories];
            updatedInventories[selectedRoom - 1] = data;
            return updatedInventories;
          });
        } else {
          console.error('Failed to fetch inventory for room', roomId);
        }
      } catch (error) {
        console.error('Failed to fetch inventories', error);
      }
    };

    fetchInventories();
  }
}, [rooms, selectedRoom]);


//=============================================================================================================================================================================================================================

  useEffect(() => {
    const storedDynamicPresetItems = localStorage.getItem('dynamicPresetItems');
    if (storedDynamicPresetItems) {
      setDynamicPresetItems(JSON.parse(storedDynamicPresetItems));
    }
  }, []);


//=============================================================================================================================================================================================================================
const deletePresetItem = async (id) => {
  try {
    // Send DELETE request to backend to remove the item from MongoDB
    const response = await fetch('/api/todos/presetitem', {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ id }), // Send the id of the item to delete
    });

    if (response.ok) {
      // Remove the item from the state if the deletion is successful
      const updatedPresetItems = dynamicPresetItems.filter(item => item._id !== id);
      setDynamicPresetItems(updatedPresetItems);
      localStorage.setItem('dynamicPresetItems', JSON.stringify(updatedPresetItems));
    } else {
      const result = await response.json();
      alert(result.message || 'Failed to delete preset item.');
    }
  } catch (error) {
    console.error('Error deleting preset item:', error);
    alert('Failed to delete preset item.');
  }
};

const toggleDeleteMode = () => {
  setIsDeleteMode((prev) => !prev);
};



  //=============================================================================================================================================================================================================================

  const addPresetItem = async (item) => {
    const updatedInventories = [...inventories];
    const currentRoomInventory = updatedInventories[selectedRoom - 1] || [];
    const existingItemIndex = currentRoomInventory.findIndex(existingItem => existingItem.name === item.name);
    // If item exists, increase its quantity and update the total price
    if (existingItemIndex !== -1) {
      currentRoomInventory[existingItemIndex].quantity += 1;
      currentRoomInventory[existingItemIndex].totalPrice = currentRoomInventory[existingItemIndex].quantity * currentRoomInventory[existingItemIndex].price; 
    } else {
      currentRoomInventory.push({ ...item, quantity: 1, totalPrice: item.price });
    }
    updatedInventories[selectedRoom - 1] = currentRoomInventory;
    setInventories(updatedInventories);
    localStorage.setItem('inventories', JSON.stringify(updatedInventories));
  
    const selectedRoomId = rooms[selectedRoom - 1]?._id;
  
    if (!selectedRoomId) {
      console.error('Room ID is not valid or not found');
      return;
    }
  
    try {
      const response = await fetch('/api/todos/roomitems', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          roomId: selectedRoomId,
          item: { ...item, quantity: 1, totalPrice: item.price }
        }),
      });
  
      if (!response.ok) {
        console.error('Failed to add item');
      }
    } catch (error) {
      console.error('Error while adding preset item:', error);
    }
  };
  

//=============================================================================================================================================================================================================================

  // Function to handle adding a new preset item dynamically
  const addCustomPresetItem = async () => {
    if (customPresetName && customPresetPrice && selectedCategory) {
      const newPresetItem = {
        name: `${customPresetName}`,
        price: parseFloat(customPresetPrice),
        quantity: 1,
        category: selectedCategory,
      };
  
      try {
        // Send the newPresetItem to the backend to save it in MongoDB
        const response = await fetch('/api/todos/presetitem', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(newPresetItem),
        });
  
        const result = await response.json();
  
        if (response.ok) {
          // Update the local state if the item was successfully added
          setDynamicPresetItems((prevItems) => [...prevItems, result]);
          setCustomPresetName('');
          setCustomPresetPrice('');
          setSelectedCategory('');
          setIsModalOpen(false);
        } else {
          alert(result.message || 'Failed to save the item.');
        }
      } catch (error) {
        console.error('Error adding preset item:', error);
        alert('Failed to save the item.');
      }
    } else {
      alert('Please provide a name, price, and select a category for the custom preset item.');
    }
  };
  
//=============================================================================================================================================================================================================================

  const toggleModal = () => {
    setIsModalOpen(prev => !prev);
  };
//=============================================================================================================================================================================================================================
const deleteItem = async (itemId) => {
  if (window.confirm('Are you sure you want to delete this item?')) {
    const updatedInventories = [...inventories];
    const roomId = rooms[selectedRoom - 1]?._id;

    if (!roomId) {
      console.error('Invalid room ID');
      return;
    }

    // Find the item in the inventories based on the itemId
    const itemIndex = updatedInventories[selectedRoom - 1].findIndex(item => item._id === itemId);
    if (itemIndex === -1) {
      console.error('Item not found');
      return;
    }

    // Remove the item from the inventories array
    updatedInventories[selectedRoom - 1].splice(itemIndex, 1);
    setInventories(updatedInventories);
    localStorage.setItem('inventories', JSON.stringify(updatedInventories));

    try {
      const response = await fetch('/api/todos/roomitems', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ roomId, itemId }), 
      });
      if (!response.ok) {
        console.error('Failed to delete item from the database');
        // Revert the item removal in case of failure
        updatedInventories[selectedRoom - 1].splice(itemIndex, 0, updatedInventories[selectedRoom - 1][itemIndex]);
        setInventories(updatedInventories);
      } else {
        console.log('Item deleted successfully');
      }
    } catch (error) {
      console.error('Error deleting item from the database:', error);
    }
  }
};

//=============================================================================================================================================================================================================================
const deleteAllItems = async () => {
  if (window.confirm('Are you sure you want to delete all items from this room?')) {
    const updatedInventories = [...inventories];
    const roomId = rooms[selectedRoom - 1]?._id;
    if (!roomId) {
      console.error('Invalid room ID');
      return;
    }
    updatedInventories[selectedRoom - 1] = [];
    setInventories(updatedInventories);
    localStorage.setItem('inventories', JSON.stringify(updatedInventories));
    try {
      const response = await fetch('/api/todos/roomitems', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ roomId }),
      });
      if (!response.ok) {
        console.error('Failed to delete all items from the database');
        alert('Failed to delete all items from the database. Please try again.');
        updatedInventories[selectedRoom - 1] = inventories[selectedRoom - 1];
        setInventories(updatedInventories);
      } else {
        console.log('All items deleted successfully');
      }
    } catch (error) {
      console.error('Error deleting all items from the database:', error);
      alert('Error occurred while deleting items. Please try again later.');
    }
  }
};
//=============================================================================================================================================================================================================================

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentRoomInventory = inventories[selectedRoom - 1] || [];
  const currentItems = currentRoomInventory.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(currentRoomInventory.length / itemsPerPage);

  return (
    <section className='w-full bg-gray-100'>
      <div className='h-[7%] p-3 bg-zinc-300 flex justify-between items-center shadow-md'>
        <h1 className='font-medium text-lg text-black'>ROOM ITEMS</h1>
        
       
        <div className="flex gap-4 items-center">
 {/*//===============================================================================================================================================================================================================     
  
          {/* Add Custom Preset Item Button */}
          <button
            onClick={toggleModal}
            className="bg-blue-500 text-white p-2 rounded-xl hover:bg-blue-600 transition duration-300"
          >
            Add Item
          </button>
  
          <button
            onClick={toggleDeleteMode}
         
             className="bg-red-500 text-white p-2 rounded-xl hover:bg-red-600 transition duration-300"
          >
            {isDeleteMode ? 'Cancel Delete' : 'Delete Preset Items'}
          </button>
        </div>
      </div>
    {/* Modal for adding custom preset items */}
{isModalOpen && (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-20">
    <div className="bg-white p-6 rounded-md w-96">
      <h3 className="text-lg font-semibold mb-4 text-black">Add Custom Preset Item</h3>
      
      {/* Item Name Input */}
      <input
        type="text"
        value={customPresetName}
        onChange={(e) => setCustomPresetName(e.target.value)}
        placeholder="New Preset Item Name"
        className="border rounded p-2 w-full mb-4 text-black"
      />
      
      {/* Item Price Input */}
      <input
        type="number"
        value={customPresetPrice}
        onChange={(e) => setCustomPresetPrice(e.target.value)}
        placeholder="Item Price"
        className="border rounded p-2 w-full mb-4 text-black"
      />

      {/* Category Selection */}
      <select
        value={selectedCategory}
        onChange={(e) => setSelectedCategory(e.target.value)}
        className="border rounded p-2 w-full mb-4 text-black "
      >
        <option value="">Select Category</option>
        <option value="bathroom">Bathroom</option>
        <option value="living-room">Living Room</option>
        <option value="mini-bar">Mini Bar</option>
      </select>
      
      {/* Add Item Button */}
      <button
        onClick={addCustomPresetItem}
        className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600 transition duration-300 text-sm w-full"
      >
        Add Item
      </button>
      
      {/* Close Button */}
      <button
        onClick={toggleModal}
        className="bg-gray-500 text-white p-2 rounded mt-4 hover:bg-gray-600 transition duration-300 text-sm w-full"
      >
        Close
      </button>
    </div>
  </div>  
)}
<div>   
   </div>
{/*=============================================================================================================================================================================================================================*/}
     
  {/* Rest of the page content */}
<div className="container mx-auto p-6">
  <div className="mb-6 flex flex-col md:flex-row items-center justify-center gap-4">
    
    {/* Total Price for All Items */}
    {currentItems.length > 0 && (
      <div className="text-left md:text-left">
        <p className="text-black font-semibold">
          Total Price for All Items: ₱{
            currentItems
              .reduce((sum, item) => sum + (item.totalPrice || 0), 0)
              .toFixed(2)
          }
        </p>
      </div>
    )}

    
    <div className="flex justify-center w-full">
      <div className="bg-white shadow-md rounded-lg p-4 flex flex-col items-center max-w-sm w-full">
        <label className="block mb-2 text-md font-semibold text-black">Select Room:</label>
        <select
          value={selectedRoom}
          onChange={(e) => {
            setSelectedRoom(Number(e.target.value));
            setCurrentPage(1);
          }}
          className="border rounded p-1 w-full text-black"
        >
          {rooms.map((room, index) => (
            <option key={index} value={index + 1}>
              {room.roomName}
            </option>
          ))}
        </select>
      </div>
    </div>
  </div>
 

         
{/*==========================================================================================================================================================================================================*/}
      
 {/* Category buttons */}
 <div className="mb-4">
        {categories.map((category, index) => (
          <button
            key={index}
            onClick={() => setActiveCategory(category)}
            className={`rounded-md p-2 m-2 text-sm ${
              activeCategory === category
                ? "bg-blue-500 text-white"
                : "bg-gray-200 text-black"
            }`}
          >
            {category.replace("-", " ").toUpperCase()}
          </button>
        ))}
      </div>
        {/* Preset Items Section */}
        <div className="mb-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-7 gap-2 w-full">
      {/* Render dynamic preset items based on active category */}
      {dynamicPresetItems
        .filter((item) => item.category === activeCategory)
        .map((item) => (

        <div
  key={item._id}
  className="relative w-full" // <-- added "relative" here
>
  <button
    onClick={() => addPresetItem(item)}
    className="rounded-md p-2 bg-blue-500 text-white hover:bg-blue-600 transition duration-300 text-sm w-full"
  >
    {item.name} ₱{item.price}
  </button>

  {isDeleteMode && (
    <button
      onClick={() => {
        const confirmDelete = window.confirm("Are you sure you want to delete this item?");
        if (confirmDelete) {
          deletePresetItem(item._id);
        }
      }}
      className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full hover:bg-red-600 transition duration-300 text-xs z-10"
    >
      X
    </button>
  )}
</div>

        ))}
    </div>
{/*==========================================================================================================================================================================================================*/}       
    {/* Inventory Table */}
{/* Inventory Table */}
<table className="table-auto border border-gray-300 w-full bg-white shadow-md rounded-md text-sm">
  <thead>
    <tr className="bg-gray-200 text-black">
      <th className="border border-gray-300 p-1">Item</th>
      <th className="border border-gray-300 p-1">Quantity</th>
      <th className="border border-gray-300 p-1">Total Price</th>
      <th className="border border-gray-300 p-1">Actions</th>
    </tr>
  </thead>
  <tbody>
  {currentItems.length === 0 ? (
    <tr>
      <td colSpan="4" className="text-center text-black p-2">
        No items in inventory
      </td>
    </tr>
  ) : (
    currentItems
      .filter((item) => item.category === activeCategory) // Filter items by active category
      .map((item, index) => (
        <tr key={item._id}> {/* Use item._id here instead of index */}
          <td className="border border-gray-300 p-1 text-black">{item.name}</td>
          <td className="border border-gray-300 p-1 text-black">{item.quantity}</td>
          <td className="border border-gray-300 p-1 text-black">
            {item.totalPrice ? `₱${item.totalPrice.toFixed(2)}` : "N/A"}
          </td>
          <td className="border border-gray-300 p-1 text-black">
            <button
              onClick={() => deleteItem(item._id)} // Pass _id for deletion
              className="text-red-500 hover:text-red-700 transition duration-300 text-sm"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                <path fillRule="evenodd" d="M16.5 4.478v.227a48.816 48.816 0 0 1 3.878.512.75.75 0 1 1-.256 1.478l-.209-.035-1.005 13.07a3 3 0 0 1-2.991 2.77H8.084a3 3 0 0 1-2.991-2.77L4.087 6.66l-.209.035a.75.75 0 0 1-.256-1.478A48.567 48.567 0 0 1 7.5 4.705v-.227c0-1.564 1.213-2.9 2.816-2.951a52.662 52.662 0 0 1 3.369 0c1.603.051 2.815 1.387 2.815 2.951Zm-6.136-1.452a51.196 51.196 0 0 1 3.273 0C14.39 3.05 15 3.684 15 4.478v.113a49.488 49.488 0 0 0-6 0v-.113c0-.794.609-1.428 1.364-1.452Zm-.355 5.945a.75.75 0 1 0-1.5.058l.347 9a.75.75 0 1 0 1.499-.058l-.346-9Zm5.48.058a.75.75 0 1 0-1.498-.058l-.347 9a.75.75 0 0 0 1.5.058l.345-9Z" clipRule="evenodd" />
              </svg>
            </button>
          </td>
        </tr>
      ))
  )}
</tbody>


</table>

{/* Total Price for Active Category */}
{currentItems.length > 0 && (
  <div className="mt-4 text-right">
    <p className="text-black font-semibold">
      Total Price for {activeCategory}: ₱{
        currentItems
          .filter((item) => item.category === activeCategory) // Filter items by active category
          .reduce((sum, item) => sum + (item.totalPrice || 0), 0)
          .toFixed(2)
      }
    </p>
  </div>
)}


{/*==========================================================================================================================================================================================================*/}
    
        
        {/* Delete All Items Button */}
        <div className="mt-4">
          <button 
            onClick={deleteAllItems}
            className="bg-red-500 text-white p-2 rounded-md hover:bg-red-600 transition duration-300 text-sm"
          >
            Delete All Items
          </button>
        </div>
      </div>
    </section>
  );
  
  
};

export default InventoryPage;

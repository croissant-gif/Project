import dbConnect from '../../../../utils/dbConnect';
import Employee from '../../../../models/Employee';
import Rooms from '../../../../models/Rooms'; // Import the Room model

dbConnect();

// GET all employees
// GET all employees and populate the assignedRooms with room names
export async function GET() {
  try {
    const employees = await Employee.find({})
      .populate({
        path: 'assignedRooms',  // Correctly specify 'roomId' as the reference to populate
        select: 'roomName'             // Select only the 'roomName' from the Room model
      });

    return new Response(JSON.stringify(employees), { status: 200 });
  } catch (error) {
    console.error(error);  // Log the error for debugging
    return new Response('Failed to fetch employees', { status: 500 });
  }
}


// POST a new employee
export async function POST(request) {
  const body = await request.json();

  try {
    // Destructure the incoming body to get fields including password
    const { name, lastName, address, contactNumber, schedule, username, password } = body;

    // Create the new employee with plain text password
    const employee = new Employee({
      name,
      lastName,
      address,
      contactNumber,
      schedule,
      assignedRooms: [],  // Initialize empty assignedRooms array
      username,  // Store the username
      password,  // Store the plain text password
    });

    // Save the employee to the database
    await employee.save();

    // Respond with the newly created employee
    return new Response(JSON.stringify(employee), { status: 201 });
  } catch (error) {
    console.error(error); // Log error for debugging
    return new Response('Failed to create employee', { status: 400 });
  }
}

// DELETE an employee by ID
export async function DELETE(request) {
  const body = await request.json();
  try {
    const { id } = body; // Expecting the employee ID in the request body
    await Employee.findByIdAndDelete(id);
    return new Response(null, { status: 204 }); // No content to return on success
  } catch (error) {
    return new Response('Failed to delete employee', { status: 500 });
  }
}




export async function PATCH(request) {
  const { employeeId, roomId, schedule, action } = await request.json();

  try {
    // Find the employee by ID
    const employee = await Employee.findById(employeeId);

    if (!employee) {
      return new Response('Employee not found', { status: 404 });
    }
 
    if (schedule) {
      employee.schedule = schedule;
    }

    // Handle room assignment or unassignment
    if (roomId) {
      const room = await Rooms.findById(roomId);
      if (!room) {
        return new Response('Room not found', { status: 404 });
      }

      // Create the room assignment object
      const roomAssignment = {
        roomId: room._id,
        roomName: room.roomName,
        roomType: room.roomType,
        specialRequest: room.specialRequest,
        status: room.status,  
        arrivalDate: room.arrivalDate,
        departureDate: room.departureDate,
        arrivalTime: room.arrivalTime,
      };

      if (action === 'add') {
        // If adding a room and the employee isn't already assigned to this room
        if (!employee.assignedRooms.some(r => r.roomId.toString() === roomId)) {
          employee.assignedRooms.push(roomAssignment);
        }

        // Update the room's assignedTo field to the employee's ID
        await Rooms.findByIdAndUpdate(roomId, { $set: { assignedTo: employeeId } });
      }

      if (action === 'remove') {
        // If removing the room from the employee's assignedRooms, remove the whole object
        employee.assignedRooms = employee.assignedRooms.filter(r => r.roomId.toString() !== roomId);

        // Set the room's assignedTo field back to null
        await Rooms.findByIdAndUpdate(roomId, { $set: { assignedTo: null } });
      }
    } else {
      // If no roomId is provided, unassign the employee from all rooms by removing the entire objects
      employee.assignedRooms = [];

      // Remove the assignedTo reference from all rooms
      await Rooms.updateMany(
        { assignedTo: employeeId },
        { $set: { assignedTo: null } }
      );
    }

    // Save the updated employee document
    await employee.save();

    return new Response(JSON.stringify(employee), { status: 200 });

  } catch (error) {
    console.error(error); // Log the error for debugging
    return new Response('Failed to assign room or update schedule for employee', { status: 500 });
  }
}
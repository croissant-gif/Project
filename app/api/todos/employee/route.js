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
    const employee = await Employee.findById(employeeId);

    if (!employee) {
      return new Response('Employee not found', { status: 404 });
    }

    // Update schedule if provided
    if (schedule) {
      employee.schedule = schedule;
    }

    // Only handle room assignment/unassignment if roomId and action are present
    if (roomId && action) {
      const room = await Rooms.findById(roomId);
      if (!room) {
        return new Response('Room not found', { status: 404 });
      }

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
        if (!employee.assignedRooms.some(r => r.roomId.toString() === roomId)) {
          employee.assignedRooms.push(roomAssignment);
        }
        await Rooms.findByIdAndUpdate(roomId, { $set: { assignedTo: employeeId } });
      }

      if (action === 'remove') {
        employee.assignedRooms = employee.assignedRooms.filter(r => r.roomId.toString() !== roomId);
        await Rooms.findByIdAndUpdate(roomId, { $set: { assignedTo: null } });
      }
    }

    await employee.save();

    return new Response(JSON.stringify(employee), { status: 200 });

  } catch (error) {
    console.error(error);
    return new Response('Failed to assign room or update schedule for employee', { status: 500 });
  }
}
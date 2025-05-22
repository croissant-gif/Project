import dbConnect from '../../../../utils/dbConnect';
import Employee from '../../../../models/Employee';
import Rooms from '../../../../models/Rooms';  

dbConnect();

// GET all employees
 
export async function GET() {
  try {
    const employees = await Employee.find({})
      .populate({
        path: 'assignedRooms',  
        select: 'roomName'            
      });

    return new Response(JSON.stringify(employees), { status: 200 });
  } catch (error) {
    console.error(error);  
    return new Response('Failed to fetch employees', { status: 500 });
  }
}


// POST a new employee
export async function POST(request) {
  const body = await request.json();

  try {
    
    const { name, lastName, address, contactNumber, schedule, username, password } = body;

   
    const employee = new Employee({
      name,
      lastName,
      address,
      contactNumber,
      schedule,
      assignedRooms: [],   
      username,  
      password,  
    });

    
    await employee.save();

    
    return new Response(JSON.stringify(employee), { status: 201 });
  } catch (error) {
    console.error(error); 
    return new Response('Failed to create employee', { status: 400 });
  }
}

 
export async function DELETE(request) {
  const body = await request.json();
  try {
    const { id } = body; 
    await Employee.findByIdAndDelete(id);
    return new Response(null, { status: 204 }); 
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

    
    if (schedule) {
      employee.schedule = schedule;
    }

    
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
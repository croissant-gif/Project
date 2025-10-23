import dbConnect from '../../../../utils/dbConnect';
import Employee from '../../../../models/Employee';
import Rooms from '../../../../models/Rooms';

dbConnect();

// GET all employees
export async function GET(request) {
  await dbConnect();

  const { searchParams } = new URL(request.url);
  const employeeId = searchParams.get('id');

  try {
    if (employeeId) {
      const employee = await Employee.findById(employeeId);

      if (!employee) {
        return new Response('Employee not found', { status: 404 });
      }

      return new Response(JSON.stringify(employee), { status: 200 });
    }

    // If no ID is provided, return all employees
    const employees = await Employee.find({}).populate({
      path: 'assignedRooms',
      select: 'roomName',
    });

    return new Response(JSON.stringify(employees), { status: 200 });
  } catch (error) {
    console.error(error);
    return new Response('Failed to fetch employee(s)', { status: 500 });
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

// DELETE employee
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

// PATCH employee (assign/remove room, update schedule, save date/time)
export async function PATCH(request) {
 const { employeeId, roomId, schedule, action, schedule_date, schedule_start, schedule_finish } = await request.json();


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
       schedule_date: schedule_date || null,
schedule_start: schedule_start || null,
schedule_finish: schedule_finish || null,

      };

      if (action === 'add') {
        const alreadyAssigned = employee.assignedRooms.find(
          (r) => r.roomId.toString() === roomId
        );

        if (!alreadyAssigned) {
          employee.assignedRooms.push(roomAssignment);
        } else {
          // Update existing assignment time if room is already assigned
         alreadyAssigned.schedule_date = schedule_date || alreadyAssigned.schedule_date;
alreadyAssigned.schedule_start = schedule_start || alreadyAssigned.schedule_start;
alreadyAssigned.schedule_finish = schedule_finish || alreadyAssigned.schedule_finish;

        }

        await Rooms.findByIdAndUpdate(roomId, { $set: { assignedTo: employeeId } });
      }

      if (action === 'remove') {
        employee.assignedRooms = employee.assignedRooms.filter(
          (r) => r.roomId.toString() !== roomId
        );

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

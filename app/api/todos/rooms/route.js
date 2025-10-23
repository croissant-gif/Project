import dbConnect from '../../../../utils/dbConnect'; 
import Rooms from '../../../../models/Rooms';  

dbConnect();

export async function GET() {
  try {
    const rooms = await Rooms.find({});
    return new Response(JSON.stringify(rooms), { status: 200 });
  } catch (error) {
    console.error('Error fetching rooms:', error);
    return new Response('Failed to fetch rooms', { status: 500 });
  }
}


export async function POST(request) {
  const body = await request.json();

  const {
    roomName,
    roomType,
    specialRequest = '',
    assignedTo = null,
    status = '',
    arrivalDate = null,
    departureDate = null,
    arrivalTime = '',
    schedule_start = '',
    schedule_finish = '',
    schedule_date = '',
  } = body;

  if (!roomName || !roomType) {
    return new Response('Room name and type are required', { status: 400 });
  }

  try {
    const newRoom = await Rooms.create({
      roomName,
      roomType,
      specialRequest,
      assignedTo,
      status,
      arrivalDate,
      departureDate,
      arrivalTime,
      schedule_start,
      schedule_finish,
      schedule_date,
      // Add createdAt field for consistency
      createdAt: new Date(),
    });

    return new Response(JSON.stringify(newRoom), { status: 201 });
  } catch (error) {
    console.error('Error creating room:', error);
    return new Response('Failed to create room', { status: 500 });
  }
}
 
export async function DELETE(request) {
  const body = await request.json();
  const { id } = body;

  if (!id) {
    return new Response('Room ID is required', { status: 400 });
  }

  try {
    const deletedRoom = await Rooms.findByIdAndDelete(id); 
    if (!deletedRoom) {
      return new Response('Room not found', { status: 404 });
    }

    return new Response(null, { status: 204 }); 
  } catch (error) {
    console.error('Error deleting room:', error);
    return new Response('Failed to delete room', { status: 500 });
  }
}

export async function PUT(request) {
  const body = await request.json();
  const { _id, roomName, roomType, status, arrivalDate, departureDate, arrivalTime, assignedTo, reason } = body;

  if (!_id) {
    return new Response('Room ID is required', { status: 400 });
  }

  try {
        const updatedRoom = await Rooms.findByIdAndUpdate(
      _id, 
      { roomName, roomType, status, arrivalDate, departureDate, arrivalTime, assignedTo, reason }, 
      { new: true }  
    );

    if (!updatedRoom) {
      return new Response('Room not found', { status: 404 });
    }

    return new Response(JSON.stringify(updatedRoom), { status: 200 });
  } catch (error) {
    console.error('Error updating room:', error);
    return new Response('Failed to update room', { status: 500 });
  }
}

 

export async function PATCH(request) {
  const body = await request.json();
  const { id, assignedTo, specialRequest, startTime, finishTime } = body;

  const updateData = {};
  if (assignedTo !== undefined) {
    updateData.assignedTo = assignedTo;
  }
  if (specialRequest !== undefined) {
    updateData.specialRequest = specialRequest;
  }
  
  if (startTime !== undefined) {
    updateData.startTime = startTime;
  }
  if (finishTime !== undefined) {
    updateData.finishTime = finishTime;
  }

  try {
    const updatedRoom = await Rooms.findByIdAndUpdate(
      id,
      updateData,
      { new: true }
    );

    if (!updatedRoom) {
      return new Response('Room not found', { status: 404 });
    }


    if (assignedTo === null && updatedRoom.assignedTo) {
      const previousEmployeeId = updatedRoom.assignedTo;
      await Employees.findByIdAndUpdate(
        previousEmployeeId,
        { $pull: { assignedRooms: id } }
      );
    }

    return new Response(JSON.stringify(updatedRoom), { status: 200 });
  } catch (error) {
    console.error('Error updating room details:', error);
    return new Response('Failed to update room details', { status: 500 });
  }
}

import mongoose from 'mongoose';

const roomSchema = new mongoose.Schema(
  {
    roomName: { type: String, required: true },
    roomType: { type: String, required: true },
    specialRequest: { type: String, default: '' },
    assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'Employee', default: null },
    status: { type: String, default: 'Vacant Clean' },
    arrivalDate: { type: Date, default: null },
    departureDate: { type: Date, default: null },
    arrivalTime: { type: String, default: '' },
    reason: { type: String, default: '' },
    startTime: { type: Date, default: null },  
    finishTime: { type: Date, default: null },  
    createdAt: { type: Date, default: Date.now },
    condition: { type: String, default: '' },
         schedule_date: { type: String, default: '' },         // Date of assignment (e.g. '2025-08-05')
      schedule_start: { type: String, default: '' },   // e.g. '09:00'
      schedule_finish: { type: String, default: '' },
  },
  {
    timestamps: true,
  }
);

const Room = mongoose.models.Room || mongoose.model('Room', roomSchema);

export default Room;

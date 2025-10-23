import mongoose from 'mongoose';

const EmployeeSchema = new mongoose.Schema({
  name: { type: String, required: true },
  lastName: { type: String, required: true },
  address: { type: String, required: true },
  contactNumber: { type: String, required: true },
  schedule: { type: String, default: 'Not assigned' },
  assignedRooms: [
    { 
      roomId: { type: mongoose.Schema.Types.ObjectId, ref: 'Room' }, 
      roomName: { type: String },
      roomType: { type: String },
      status: { type: String },
      arrivalDate: { type: Date },
      departureDate: { type: Date },
      arrivalTime: { type: String },
      specialRequest: { type: String },

      // 🆕 New time-related fields
      schedule_date: { type: String },         // Date of assignment (e.g. '2025-08-05')
      schedule_start: { type: String },    // e.g. '09:00'
      schedule_finish: { type: String }    // e.g. '11:30'
    }
  ],
  username: { type: String, required: true },
  password: { type: String, required: true },
}, { timestamps: true });

export default mongoose.models.Employee || mongoose.model('Employee', EmployeeSchema);

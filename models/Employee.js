import mongoose from 'mongoose';

const EmployeeSchema = new mongoose.Schema({
  name: { type: String, required: true },
  lastName: { type: String, required: true },
  address: { type: String, required: true },
  contactNumber: { type: String, required: true },
  schedule: { type: String, default: 'Not assigned' },
  assignedRooms: [{ 
    roomId: { type: mongoose.Schema.Types.ObjectId, ref: 'Room' }, 
    roomName: { type: String },
    roomType: { type: String },
    status: { type: String },
    arrivalDate: { type: Date },
    departureDate: { type: Date },
    arrivalTime: { type: String},
    specialRequest: {type: String},
    
     
    
    
  }],
  username: { type: String, required: true },
  password: { type: String, required: true },
}, { timestamps: true });

export default mongoose.models.Employee || mongoose.model('Employee', EmployeeSchema);

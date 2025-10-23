    import mongoose from 'mongoose';

const CleaningLogSchema = new mongoose.Schema({
  roomId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Room',
    required: true,
  },
  roomName: String,
  user: String,
  status: String,
  startTime: Date,
  finishTime: Date,
}, {
  timestamps: true, // includes createdAt and updatedAt
});

export default mongoose.models.CleaningLog || mongoose.model('CleaningLog', CleaningLogSchema);

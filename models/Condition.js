import mongoose from 'mongoose';

const ConditionSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Condition = mongoose.models.Condition || mongoose.model('Condition', ConditionSchema);

export default Condition;

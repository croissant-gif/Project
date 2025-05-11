// models/PresetItem.js
import mongoose from 'mongoose';

const presetItemSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    price: { type: Number, required: true },
    quantity: { type: Number, default: 1 },
    category: { type: String, required: true },
  },
  { timestamps: true }
);

export default mongoose.models.PresetItem || mongoose.model('PresetItem', presetItemSchema);

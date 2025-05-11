 
import mongoose from 'mongoose';

 
const AccountSchema = new mongoose.Schema({
  name: { type: String, required: true },
  lastName: { type: String, required: true },
  username: { type: String, required: true, unique: true },  
  password: { type: String, required: true }, 
}, { timestamps: true });

export default mongoose.models.Account || mongoose.model('Account', AccountSchema);

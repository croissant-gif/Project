import mongoose from 'mongoose';

 
const ItemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  quantity: { type: Number, required: true, default: 1 },
  price: { type: Number, required: true }, 
  category: { type: String, required: true }, 
  totalPrice: { type: Number },  
});
 
ItemSchema.pre('save', function(next) {
  if (this.quantity && this.price) {
    this.totalPrice = this.price * this.quantity; 
  }
  next();  
});

 
const InventorySchema = new mongoose.Schema({
  roomId: { type: String, required: true, unique: true },  
  inventory: [ItemSchema], 
});
 
InventorySchema.index({ roomId: 1 });

 
const Inventory = mongoose.models.Inventory || mongoose.model('Inventory', InventorySchema);

export default Inventory;

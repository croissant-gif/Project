import dbConnect from '../../../../utils/dbConnect';
import Inventory from '../../../../models/Inventory';
import mongoose from 'mongoose'; 

 
dbConnect();

//=================================================================================================================================================================================
export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const roomId = searchParams.get('roomId'); 

  if (!roomId) {
    return new Response('Room ID is required', { status: 400 });
  }

  try {
 
    let inventory = await Inventory.findOne({ roomId });

    if (!inventory) {
      
      return new Response('Inventory not found for this room', { status: 404 });
    }

    
    return new Response(JSON.stringify(inventory.inventory), { status: 200 });
  } catch (error) {
    console.error('Error fetching inventory:', error);
    return new Response('Failed to fetch inventory', { status: 500 });
  }
}


//=================================================================================================================================================================================
export async function POST(request) {
  const body = await request.json();
  try {
    const { roomId, item } = body;
 
    if (!item || !item.name || !item.quantity) {
      return new Response('Item must have a name and quantity', { status: 400 });
    }

 
    const inventory = await Inventory.findOne({ roomId });

    if (inventory) {
   
      const existingItemIndex = inventory.inventory.findIndex(
        (existingItem) => existingItem.name === item.name
      );

      if (existingItemIndex !== -1) {
        
        inventory.inventory[existingItemIndex].quantity += item.quantity;
        await inventory.save();
      } else {
        
        inventory.inventory.push(item);
        await inventory.save();
      }

      return new Response(JSON.stringify(inventory.inventory), { status: 201 });
    } else {
  
      const newInventory = new Inventory({
        roomId,
        inventory: [item],
      });
      await newInventory.save();
      return new Response(JSON.stringify(newInventory.inventory), { status: 201 });
    }
  } catch (error) {
    console.error('Error adding item to inventory:', error);
    return new Response('Failed to add item: ' + error.message, { status: 400 });
  }
}



//=================================================================================================================================================================================
export async function DELETE(request) {
  const body = await request.json();

  try {
    const { roomId, itemId } = body;

 
    if (!roomId) {
      return new Response('Room ID is required', { status: 400 });
    }

   
    if (itemId) {
      await Inventory.updateOne(
        { roomId },  
        { $pull: { inventory: { _id: new mongoose.Types.ObjectId(itemId) } } } 
      );
      return new Response(null, { status: 204 }); 
    }

    
    
    await Inventory.deleteOne({ roomId });  

    return new Response(null, { status: 204 });  
  } catch (error) {
    console.error('Error deleting item(s) or inventory:', error);
    return new Response('Failed to delete item(s) or inventory', { status: 500 });
  }
}

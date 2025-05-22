import dbConnect from '../../../../utils/dbConnect';  
import Condition from '../../../../models/Condition';   

 
dbConnect();


export async function GET() {
  try {
    const conditions = await Condition.find({});   
    return new Response(JSON.stringify(conditions), { status: 200 });
  } catch (error) {
    console.error('Error fetching conditions:', error);
    return new Response('Failed to fetch conditions', { status: 500 });
  }
}

 
export async function POST(request) {
  const body = await request.json();
  const { newCondition } = body;

  if (!newCondition) {
    return new Response('Condition name is required', { status: 400 });
  }

  try {
    const conditionExists = await Condition.findOne({ name: newCondition });
    if (conditionExists) {
      return new Response('Condition already exists', { status: 400 });
    }

    const newConditionObj = new Condition({
      name: newCondition,
    });

    await newConditionObj.save();

    return new Response(JSON.stringify(newConditionObj), { status: 201 });
  } catch (error) {
    console.error('Error creating condition:', error);
    return new Response('Failed to create condition', { status: 500 });
  }
}

// DELETE handler to delete a condition
export async function DELETE(request) {
  try {
    const { condition } = await request.json();  

    if (!condition) {
      return new Response('Condition name is required', { status: 400 });
    }

 
    const deletedCondition = await Condition.deleteOne({ name: condition });

    if (deletedCondition.deletedCount === 1) {
      return new Response('Condition deleted successfully', { status: 200 });
    } else {
      return new Response('Condition not found', { status: 404 });
    }
  } catch (error) {
    console.error('Error deleting condition:', error);
    return new Response('Failed to delete condition', { status: 500 });
  }
}
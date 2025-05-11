import dbConnect from '../../../utils/dbConnect';
import Todo from '../../../models/Todo';

dbConnect();

export async function GET() {
  try {
    const todos = await Todo.find({});
    return new Response(JSON.stringify(todos), { status: 200 });
  } catch (error) {
    return new Response('Failed to fetch todos', { status: 500 });
  }
}

export async function POST(request) {
  const body = await request.json();
  try {
    const todo = await Todo.create(body);
    return new Response(JSON.stringify(todo), { status: 201 });
  } catch (error) {
    return new Response('Failed to create todo', { status: 400 });
  }
}

export async function DELETE(request) {
  const body = await request.json();
  try {
    const { id } = body; // Expecting the todo ID in the request body
    await Todo.findByIdAndDelete(id);
    return new Response(null, { status: 204 }); // No content to return on success
  } catch (error) {
    return new Response('Failed to delete todo', { status: 500 });
  }
}

export async function PATCH(request) {
  const body = await request.json();

  const { id, assignedTo, startTime, finishTime } = body;

  try {
    // Update the todo with new data. Even if values are null, this will overwrite them.
    const updatedTodo = await Todo.findByIdAndUpdate(
      id,
      {
        assignedTo,
        startTime: startTime === undefined ? undefined : startTime,
        finishTime: finishTime === undefined ? undefined : finishTime,
      },
      { new: true }
    );

    if (!updatedTodo) {
      return new Response('Todo not found', { status: 404 });
    }

    return new Response(JSON.stringify(updatedTodo), { status: 200 });
  } catch (error) {
    console.error('PATCH error:', error);
    return new Response('Failed to update todo', { status: 500 });
  }
}

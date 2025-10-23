// app/api/cleaningLogs/route.js

import dbConnect from '@/utils/dbConnect';
import CleaningLog from '@/models/CleaningLog';

export async function GET() {
  await dbConnect();
  try {
    const logs = await CleaningLog.find().sort({ createdAt: -1 });
    return new Response(JSON.stringify(logs), { status: 200 });
  } catch (error) {
    return new Response('Failed to fetch cleaning logs', { status: 500 });
  }
}

export async function DELETE(request) {
  await dbConnect();
  try {
    const { id } = await request.json();
    await CleaningLog.findByIdAndDelete(id);
    return new Response(null, { status: 204 });
  } catch (error) {
    console.error('Error deleting cleaning log:', error);
    return new Response('Failed to delete cleaning log', { status: 500 });
  }
}
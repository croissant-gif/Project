// pages/api/presetItems.js

import dbConnect from '../../../../utils/dbConnect';
import PresetItem from '../../../../models/PresetItem';

dbConnect();

export async function GET() {
  try {
    const presetItems = await PresetItem.find({});
    return new Response(JSON.stringify(presetItems), { status: 200 });
  } catch (error) {
    return new Response('Failed to fetch preset items', { status: 500 });
  }
}

export async function POST(request) {
  const body = await request.json();
  try {
    const presetItem = await PresetItem.create(body);
    return new Response(JSON.stringify(presetItem), { status: 201 });
  } catch (error) {
    return new Response('Failed to create preset item', { status: 400 });
  }
}


export async function DELETE(request) {
    const body = await request.json();
    try {
      const { id } = body; 
      await PresetItem.findByIdAndDelete(id);
      return new Response(null, { status: 204 });  
    } catch (error) {
      console.error('Failed to delete preset item:', error);
      return new Response('Failed to delete preset item', { status: 500 });
    }
  }
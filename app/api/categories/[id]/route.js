import { NextResponse } from 'next/server';
import Category from '@/lib/models/Category';
import { dbConnect } from '@/lib/dbConnect';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

// Handle preflight
export async function OPTIONS() {
  return NextResponse.json({}, { status: 200, headers: corsHeaders });
}

export async function GET(_, { params }) {
  await dbConnect();
  const category = await Category.findById(params.id);
  if (!category) return NextResponse.json({ error: 'Not found' }, { status: 404, headers: corsHeaders });
  return NextResponse.json(category, { headers: corsHeaders });
}

export async function PUT(req, { params }) {
  await dbConnect();
  const data = await req.json();
  const updated = await Category.findByIdAndUpdate(params.id, data, { new: true });
  return NextResponse.json(updated, { headers: corsHeaders });
}

export async function DELETE(_, { params }) {
  await dbConnect();
  await Category.findByIdAndDelete(params.id);
  return NextResponse.json({ message: 'Deleted successfully' }, { headers: corsHeaders });
}

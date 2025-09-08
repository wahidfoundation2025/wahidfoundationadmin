import { NextResponse } from 'next/server';
import { dbConnect } from '@/lib/dbConnect';
import Blog from '@/lib/models/blog';
import mongoose from 'mongoose';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*', // change to your frontend domain in prod
  'Access-Control-Allow-Methods': 'GET, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

// ✅ GET single blog
export async function GET(req, { params }) {
  await dbConnect();
  const { id } = params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return NextResponse.json({ error: 'Invalid ID' }, { status: 400, headers: corsHeaders });
  }

  const blog = await Blog.findById(id);
  if (!blog) {
    return NextResponse.json({ error: 'Blog not found' }, { status: 404, headers: corsHeaders });
  }

  return NextResponse.json(blog, { headers: corsHeaders });
}

// ✅ PUT update blog
export async function PUT(req, { params }) {
  await dbConnect();
  const { id } = params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return NextResponse.json({ error: 'Invalid ID' }, { status: 400, headers: corsHeaders });
  }

  const data = await req.json();

  // Remove 'history' if present in body to avoid conflict
  const { history, ...updateData } = data;

  const updated = await Blog.findByIdAndUpdate(id, updateData, {
    new: true,
    runValidators: true,
  });

  if (!updated) {
    return NextResponse.json({ error: 'Blog not found' }, { status: 404, headers: corsHeaders });
  }

  return NextResponse.json(updated, { headers: corsHeaders });
}

// ✅ DELETE blog
export async function DELETE(req, { params }) {
  await dbConnect();
  const { id } = params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return NextResponse.json({ error: 'Invalid ID' }, { status: 400, headers: corsHeaders });
  }

  const deleted = await Blog.findByIdAndDelete(id);

  if (!deleted) {
    return NextResponse.json({ error: 'Blog not found' }, { status: 404, headers: corsHeaders });
  }

  return NextResponse.json({ message: 'Blog deleted successfully' }, { headers: corsHeaders });
}

// ✅ OPTIONS preflight
export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}

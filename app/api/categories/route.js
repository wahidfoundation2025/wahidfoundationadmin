import { NextResponse } from 'next/server';
import Category from '@/lib/models/Category';
import { dbConnect } from '@/lib/dbConnect';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

// Handle preflight requests
export async function OPTIONS() {
  return NextResponse.json({}, { status: 200, headers: corsHeaders });
}

export async function GET() {
  await dbConnect();
  const categories = await Category.find();
  return NextResponse.json(categories, { headers: corsHeaders });
}

export async function POST(req) {
  await dbConnect();
  const data = await req.json();
  const category = await Category.create(data);
  return NextResponse.json(category, { status: 201, headers: corsHeaders });
}

import { NextResponse } from 'next/server';
import { dbConnect } from '@/lib/dbConnect';
import Blog from '@/lib/models/blog';

// ✅ Common CORS headers
const corsHeaders = {
  'Access-Control-Allow-Origin': '*', // you can restrict this to your domain
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

// ✅ Handle GET (fetch all blogs)
export async function GET() {
  await dbConnect();
  const blogs = await Blog.find().sort({ createdAt: -1 });
  return NextResponse.json(blogs, { headers: corsHeaders });
}

// ✅ Handle POST (create a blog)
export async function POST(req) {
  await dbConnect();
  const body = await req.json();
  const blog = await Blog.create(body);
  return NextResponse.json(blog, { headers: corsHeaders });
}

// ✅ Handle OPTIONS (CORS preflight)
export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}

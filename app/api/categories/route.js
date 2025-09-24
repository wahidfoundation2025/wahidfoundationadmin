import { NextResponse } from "next/server";
import Category from "@/lib/models/Category";
import { dbConnect } from "@/lib/dbConnect";

import { corsHeaders } from "../../layout";

// Handle preflight requests
export async function OPTIONS() {
  return NextResponse.json({}, { status: 200, headers: corsHeaders });
}

export async function GET() {
  await dbConnect();
  const categories = await Category.find();
  return NextResponse.json(categories, { status: 200, headers: corsHeaders });
}

export async function POST(req) {
  await dbConnect();
  const data = await req.json();
  const category = await Category.create(data);
  return NextResponse.json(category, { status: 201, headers: corsHeaders });
}

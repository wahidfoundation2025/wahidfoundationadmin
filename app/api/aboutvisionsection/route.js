import { dbConnect } from "../../../lib/dbConnect";
import { NextResponse } from "next/server";
import AboutVisionSection from "@/lib/models/aboutvisionsection";

import { corsHeaders } from "../../layout";

// CORS preflight handler
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: corsHeaders,
  });
}

// GET the single vision section (singleton)
export async function GET() {
  await dbConnect();
  const data = await AboutVisionSection.findOne({});
  return NextResponse.json(data, {
    status: 200,
    headers: corsHeaders,
  });
}

// UPSERT the single vision section
export async function POST(req) {
  await dbConnect();
  const body = await req.json();
  const updated = await AboutVisionSection.findOneAndUpdate({}, body, {
    new: true,
    upsert: true,
  });
  return NextResponse.json(updated, {
    status: 200,
    headers: corsHeaders,
  });
}

// DELETE the single vision section
export async function DELETE() {
  await dbConnect();
  await AboutVisionSection.deleteMany({});
  return NextResponse.json(
    { success: true },
    {
      status: 200,
      headers: corsHeaders,
    }
  );
}

import { dbConnect } from "../../../lib/dbConnect";
import { NextResponse } from "next/server";
import AboutValuesSection from "@/lib/models/aboutvaluessection";

import { corsHeaders } from '../../layout';

// CORS preflight handler
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: corsHeaders,
  });
}

// GET the single values section (singleton)
export async function GET() {
  await dbConnect();
  const data = await AboutValuesSection.findOne({});
  return NextResponse.json(data, {
    status: 200,
    headers: corsHeaders,
  });
}

// UPSERT the single values section
export async function POST(req) {
  await dbConnect();
  const body = await req.json();
  console.log("Incoming body.cards:", body.cards);
  const updated = await AboutValuesSection.findOneAndUpdate({}, body, {
    new: true,
    upsert: true,
  });
  console.log("Updated document:", updated);
  return NextResponse.json(updated, {
    status: 200,
    headers: corsHeaders,
  });
}

// DELETE the single values section
export async function DELETE() {
  await dbConnect();
  await AboutValuesSection.deleteMany({});
  return NextResponse.json(
    { success: true },
    {
      status: 200,
      headers: corsHeaders,
    }
  );
}

import { dbConnect } from "../../../lib/dbConnect";
import ImpactStatContent from "../../../lib/models/homeimpactsection";
import { NextResponse } from "next/server";

import { corsHeaders } from "../../layout";

// CORS preflight handler
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: corsHeaders,
  });
}

// GET the single impact section (singleton)
export async function GET() {
  await dbConnect();
  const data = await ImpactStatContent.findOne({});
  return NextResponse.json(data, {
    status: 200,
    headers: corsHeaders,
  });
}

// UPSERT the single impact section
export async function POST(req) {
  await dbConnect();
  const body = await req.json();
  const updated = await ImpactStatContent.findOneAndUpdate({}, body, {
    new: true,
    upsert: true,
  });
  return NextResponse.json(updated, {
    status: 200,
    headers: corsHeaders,
  });
}

// DELETE the single impact section
export async function DELETE() {
  await dbConnect();
  await ImpactStatContent.deleteMany({});
  return NextResponse.json(
    { success: true },
    {
      status: 200,
      headers: corsHeaders,
    }
  );
}

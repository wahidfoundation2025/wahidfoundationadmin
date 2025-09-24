import { dbConnect } from "../../../lib/dbConnect";
import { NextResponse } from "next/server";
import AboutHeroSection from "@/lib/models/aboutherosection";

import { corsHeaders } from '../../layout';

// CORS preflight handler
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: corsHeaders,
  });
}

// GET the single hero section (singleton)
export async function GET() {
  await dbConnect();
  const data = await AboutHeroSection.findOne({});
  return NextResponse.json(data, {
    status: 200,
    headers: corsHeaders,
  });
}

// UPSERT the single hero section
export async function POST(req) {
  try {
    await dbConnect();
    const body = await req.json();

    const updated = await AboutHeroSection.findOneAndUpdate({}, body, {
      new: true,
      upsert: true,
    });

    return NextResponse.json(updated, {
      status: 200,
      headers: corsHeaders,
    });
  } catch (err) {
    console.error("POST /aboutherosection error:", err);
    return NextResponse.json(
      { error: "Failed to save hero section" },
      { status: 500, headers: corsHeaders }
    );
  }
}


// DELETE the single hero section
export async function DELETE() {
  await dbConnect();
  await AboutHeroSection.deleteMany({});
  return NextResponse.json(
    { success: true },
    {
      status: 200,
      headers: corsHeaders,
    }
  );
}

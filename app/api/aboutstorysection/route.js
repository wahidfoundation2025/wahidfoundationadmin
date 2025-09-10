import { dbConnect } from "../../../lib/dbConnect";
import { NextResponse } from "next/server";
import AboutStorySection from "@/lib/models/aboutstorysection";

// CORS preflight handler
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET,POST,DELETE,OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type,Authorization",
    },
  });
}

// GET the single story section (singleton)
export async function GET() {
  await dbConnect();
  const data = await AboutStorySection.findOne({});
  return NextResponse.json(data, {
    headers: {
      "Access-Control-Allow-Origin": "*",
    },
  });
}

// UPSERT the single story section
export async function POST(req) {
  await dbConnect();
  const body = await req.json();
  const updated = await AboutStorySection.findOneAndUpdate({}, body, {
    new: true,
    upsert: true,
  });
  return NextResponse.json(updated, {
    headers: {
      "Access-Control-Allow-Origin": "*",
    },
  });
}

// DELETE the single story section
export async function DELETE() {
  await dbConnect();
  await AboutStorySection.deleteMany({});
  return NextResponse.json(
    { success: true },
    {
      headers: {
        "Access-Control-Allow-Origin": "*",
      },
    }
  );
}

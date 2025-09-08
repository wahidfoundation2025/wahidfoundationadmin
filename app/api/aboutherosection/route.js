import { dbConnect } from "../../../lib/dbConnect";
import AboutHeroSection from "@/lib/models/aboutherosection";
import { NextResponse } from "next/server";

// CORS preflight handler
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": "https://www.wahid.org.in",
      "Access-Control-Allow-Methods": "GET",
      "Access-Control-Allow-Headers": "Content-Type,Authorization",
    },
  });
}

// GET the single hero section (singleton)
export async function GET() {
  await dbConnect();
  const data = await AboutHeroSection.findOne({});
  return NextResponse.json(data, {
    headers: {
      "Access-Control-Allow-Origin": "https://www.wahid.org.in",
    },
  });
}

// UPSERT the single hero section
export async function POST(req) {
  await dbConnect();
  const body = await req.json();

  // Remove 'history' if present in body to avoid conflict
  const { history, ...updateData } = body;
  const updated = await AboutHeroSection.findOneAndUpdate(
    {},
    updateData, // no 'history' here
    { new: true, upsert: true }
  );

  return NextResponse.json(updated, {
    headers: {
      "Access-Control-Allow-Origin": "https://www.wahid.org.in",
    },
  });
}

// DELETE the single hero section
export async function DELETE() {
  await dbConnect();
  await AboutHeroSection.deleteMany({});
  return NextResponse.json(
    { success: true },
    {
      headers: {
        "Access-Control-Allow-Origin": "https://www.wahid.org.in",
      },
    }
  );
}

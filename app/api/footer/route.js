// app/api/cms/footer/route.js
import { dbConnect } from "@/lib/dbConnect";
import FooterSettings from "@/lib/models/footerSettings";
import { NextResponse } from "next/server";

import { corsHeaders } from "../../layout";

// CORS Preflight
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: corsHeaders,
  });
}

export async function PUT(req) {
  console.log("PUT Footer Settings");
  await dbConnect();
  const body = await req.json();
  const existing = await FooterSettings.findOne({});

  if (!existing) {
    return NextResponse.json({ error: "Footer not found" }, { status: 404 });
  }

  const updated = await FooterSettings.findOneAndUpdate({}, body, {
    new: true,
  });
  return NextResponse.json(updated, {
    status: 200,
    headers: corsHeaders,
  });
}
// GET Footer Settings (singleton)
export async function GET() {
  await dbConnect();
  const data = await FooterSettings.findOne({});
  return NextResponse.json(data, {
    status: 200,
    headers: corsHeaders,
  });
}

// POST (Upsert) Footer Settings
export async function POST(req) {
  await dbConnect();
  const body = await req.json();
  const updated = await FooterSettings.findOneAndUpdate({}, body, {
    new: true,
    upsert: true,
  });
  return NextResponse.json(updated, {
    status: 200,
    headers: corsHeaders,
  });
}

// DELETE Footer Settings (reset)
export async function DELETE() {
  await dbConnect();
  await FooterSettings.deleteMany({});
  return NextResponse.json(
    { success: true },
    {
      status: 200,
      headers: corsHeaders,
    }
  );
}

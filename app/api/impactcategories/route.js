// app/api/impactcategories/route.js
import { dbConnect } from "@/lib/dbConnect";
import ImpactCategoriesDoc from "@/lib/models/impactcategories";
import { NextResponse } from "next/server";

// Handle CORS
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

export async function GET() {
  await dbConnect();
  const doc = await ImpactCategoriesDoc.findOne({});
  return NextResponse.json(doc || { section: {}, categories: [] });
}

export async function POST(req) {
  await dbConnect();
  const body = await req.json();

  const updated = await ImpactCategoriesDoc.findOneAndUpdate(
    {},
    body,
    { new: true, upsert: true }
  );

  return NextResponse.json(updated);
}

export async function DELETE() {
  await dbConnect();

  const cleared = await ImpactCategoriesDoc.findOneAndUpdate(
    {},
    { section: { title: "", subtitle: "" }, categories: [] },
    { new: true, upsert: true }
  );

  return NextResponse.json(cleared);
}

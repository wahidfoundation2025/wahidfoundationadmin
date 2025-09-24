// app/api/impactcategories/route.js
import { dbConnect } from "@/lib/dbConnect";
import ImpactCategoriesDoc from "@/lib/models/impactcategories";
import { NextResponse } from "next/server";

import { corsHeaders } from "../../layout";

// Handle CORS preflight
export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: corsHeaders });
}

export async function GET() {
  await dbConnect();
  const doc = await ImpactCategoriesDoc.findOne({});
  return NextResponse.json(doc || { section: {}, categories: [] }, {
    status: 200,
    headers: corsHeaders,
  });
}

export async function POST(req) {
  await dbConnect();
  const body = await req.json();

  const updated = await ImpactCategoriesDoc.findOneAndUpdate({}, body, {
    new: true,
    upsert: true,
  });

  return NextResponse.json(updated, { status: 200, headers: corsHeaders });
}

export async function DELETE() {
  await dbConnect();

  const cleared = await ImpactCategoriesDoc.findOneAndUpdate(
    {},
    { section: { title: "", subtitle: "" }, categories: [] },
    { new: true, upsert: true }
  );

  return NextResponse.json(cleared, { status: 200, headers: corsHeaders });
}

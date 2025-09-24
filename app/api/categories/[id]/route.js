import { NextResponse } from "next/server";
import Category from "@/lib/models/Category";
import { dbConnect } from "@/lib/dbConnect";

import { corsHeaders } from "../../../layout";

// Handle preflight
export async function OPTIONS() {
  return NextResponse.json({}, { status: 200, headers: corsHeaders });
}

export async function GET(req, props) {
  const { params } = await props;
  await dbConnect();
  const category = await Category.findById(params.id);
  if (!category)
    return NextResponse.json(
      { error: "Not found" },
      { status: 404, headers: corsHeaders }
    );
  return NextResponse.json(category, { status: 200, headers: corsHeaders });
}

export async function PUT(req, props) {
  const { params } = await props;
  await dbConnect();
  const data = await req.json();
  const updated = await Category.findByIdAndUpdate(params.id, data, {
    new: true,
  });
  return NextResponse.json(updated, { headers: corsHeaders });
}

export async function DELETE(req, props) {
  const { params } = await props;
  await dbConnect();
  await Category.findByIdAndDelete(params.id);
  return NextResponse.json(
    { message: "Deleted successfully" },
    { status: 200, headers: corsHeaders }
  );
}

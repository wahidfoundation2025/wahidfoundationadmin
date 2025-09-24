import { dbConnect } from "@/lib/dbConnect";
import ImpactStory from "../../../lib/models/ImpactStory";

import { corsHeaders } from "../../layout";

export async function OPTIONS() {
  return new Response(null, {
    status: 204,
    headers: corsHeaders,
  });
}

export async function GET() {
  await dbConnect();
  const stories = await ImpactStory.find().sort({ createdAt: -1 });
  return new Response(JSON.stringify(stories), {
    status: 200,
    headers: corsHeaders,
  });
}

export async function POST(req) {
  await dbConnect();
  const data = await req.json();
  const story = await ImpactStory.create(data);
  return new Response(JSON.stringify(story), {
    status: 201,
    headers: corsHeaders,
  });
}

// DELETE: /api/impact-stories?id=<id>
export async function DELETE(req) {
  await dbConnect();
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  if (!id) {
    return new Response(JSON.stringify({ error: "Missing id" }), {
      status: 400,
      headers: corsHeaders,
    });
  }
  await ImpactStory.findByIdAndDelete(id);
  return new Response(JSON.stringify({ success: true }), {
    status: 200,
    headers: corsHeaders,
  });
}

import { dbConnect } from "../../../lib/dbConnect";
import VolunteerPosition from "../../../lib/models/VolunteerPosition";

import { corsHeaders } from "../../layout";

export async function OPTIONS() {
  return new Response(null, {
    status: 204,
    headers: corsHeaders,
  });
}

export async function GET() {
  await dbConnect();
  const positions = await VolunteerPosition.find();
  return new Response(JSON.stringify(positions), {
    status: 200,
    headers: corsHeaders,
  });
}

export async function POST(req) {
  await dbConnect();
  const data = await req.json();
  const position = await VolunteerPosition.create(data);
  return new Response(JSON.stringify(position), {
    status: 201,
    headers: corsHeaders,
  });
}

// DELETE: /api/volunteer-positions?id=<id>
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
  await VolunteerPosition.findByIdAndDelete(id);
  return new Response(JSON.stringify({ success: true }), {
    status: 200,
    headers: corsHeaders,
  });
}

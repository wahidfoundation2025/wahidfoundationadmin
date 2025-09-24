import { dbConnect } from "../../../lib/dbConnect";
import Volunteer from "../../../lib/models/volunteer";

import { corsHeaders } from "../../layout";

// Handle CORS preflight
export async function OPTIONS() {
  return new Response(null, {
    status: 204,
    headers: corsHeaders,
  });
}

// GET: List all volunteers
export async function GET() {
  await dbConnect();
  const volunteers = await Volunteer.find();
  return new Response(JSON.stringify(volunteers), {
    status: 200,
    headers: corsHeaders,
  });
}

// POST: Create a new volunteer
export async function POST(req) {
  await dbConnect();
  const data = await req.json();
  const volunteer = await Volunteer.create(data);
  return new Response(JSON.stringify(volunteer), {
    status: 201,
    headers: corsHeaders,
  });
}

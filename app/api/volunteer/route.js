import { dbConnect } from '../../../lib/dbConnect'
import Volunteer from "../../../lib/models/volunteer";

// Handle CORS preflight
export async function OPTIONS() {
  return new Response(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    },
  });
}

// GET: List all volunteers
export async function GET() {
  await dbConnect();
  const volunteers = await Volunteer.find();
  return new Response(JSON.stringify(volunteers), {
    status: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Content-Type": "application/json",
    },
  });
}

// POST: Create a new volunteer
export async function POST(req) {
  await dbConnect();
  const data = await req.json();
  const volunteer = await Volunteer.create(data);
  return new Response(JSON.stringify(volunteer), {
    status: 201,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Content-Type": "application/json",
    },
  });
}
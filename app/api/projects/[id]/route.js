import { dbConnect } from "@/lib/dbConnect";
import Project from "@/lib/models/Project";

// CORS headers
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET,PUT,DELETE,OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

// OPTIONS handler (for preflight requests)
export async function OPTIONS() {
  return new Response(null, {
    status: 204,
    headers: corsHeaders,
  });
}

export async function GET(_, { params }) {
  await dbConnect();
  const project = await Project.findById(params.id);
  if (!project) {
    return new Response(JSON.stringify({ error: "Not found" }), {
      status: 404,
      headers: corsHeaders,
    });
  }
  return new Response(JSON.stringify(project), {
    status: 200,
    headers: corsHeaders,
  });
}

export async function PUT(req, { params }) {
  await dbConnect();
  const body = await req.json();
  const updatedProject = await Project.findByIdAndUpdate(params.id, body, {
    new: true,
  });
  return new Response(JSON.stringify(updatedProject), {
    status: 200,
    headers: corsHeaders,
  });
}

export async function DELETE(_, { params }) {
  await dbConnect();
  await Project.findByIdAndDelete(params.id);
  return new Response(JSON.stringify({ message: "Project deleted" }), {
    status: 200,
    headers: corsHeaders,
  });
}

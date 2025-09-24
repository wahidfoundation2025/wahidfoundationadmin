import { dbConnect } from "@/lib/dbConnect";
import Project from "@/lib/models/Project";

import { corsHeaders } from "../../../layout";

// OPTIONS handler (for preflight requests)
export async function OPTIONS() {
  return new Response(null, {
    status: 204,
    headers: corsHeaders,
  });
}

export async function GET(req, props) {
  const { params } = await props;
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

export async function PUT(req, props) {
  const { params } = await props;
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

export async function DELETE(req, props) {
  const { params } = await props;
  await dbConnect();

  await Project.findByIdAndDelete(params.id);

  return new Response(JSON.stringify({ message: "Project deleted" }), {
    status: 200,
    headers: corsHeaders,
  });
}

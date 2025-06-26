// app/api/projects/[id]/route.js
import { dbConnect } from "@/lib/dbConnect";
import Project from "@/lib/models/Project";

export async function GET(_, { params }) {
  await dbConnect();
  const project = await Project.findById(params.id);
  if (!project) return Response.json({ error: "Not found" }, { status: 404 });
  return Response.json(project);
}

export async function PUT(req, { params }) {
  await dbConnect();
  const body = await req.json();
  const updatedProject = await Project.findByIdAndUpdate(params.id, body, {
    new: true,
  });
  return Response.json(updatedProject);
}

export async function DELETE(_, { params }) {
  await dbConnect();
  await Project.findByIdAndDelete(params.id);
  return Response.json({ message: "Project deleted" });
}

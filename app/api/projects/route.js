// app/api/projects/route.js
import { dbConnect } from "@/lib/dbConnect";
import Project from "@/lib/models/Project";

export async function GET() {
  await dbConnect();
  const projects = await Project.find({});
  return Response.json(projects);
}

export async function POST(req) {
  try {
    await dbConnect();
    const body = await req.json();
    const newProject = new Project(body);
    await newProject.save();
    return Response.json(newProject, { status: 201 });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 400 });
  }
}

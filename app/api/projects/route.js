// app/api/projects/route.js
import { dbConnect } from "@/lib/dbConnect";
import Project from "@/lib/models/Project";

export async function GET(req) {
  await dbConnect();

  const url = new URL(req.url);
  const search = url.searchParams.get('search') || '';
  const status = url.searchParams.get('status');
  const page = parseInt(url.searchParams.get('page') || '1');
  const limit = parseInt(url.searchParams.get('limit') || '10');

  const query = {
    ...(search && { title: { $regex: search, $options: 'i' } }),
    ...(status && { status }),
  };

  const [totalCount, activeCount, completedCount, projects] = await Promise.all([
    Project.countDocuments(query),
    Project.countDocuments({ status: 'Active' }),
    Project.countDocuments({ status: 'completed' }),
    Project.find(query)
      .skip((page - 1) * limit)
      .limit(limit),
  ]);

  return Response.json({
    projects,
    totalPages: Math.ceil(totalCount / limit),
    totalCount,
    activeCount,
    completedCount,
  });
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

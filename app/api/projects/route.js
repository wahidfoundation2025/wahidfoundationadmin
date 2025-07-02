import { dbConnect } from "@/lib/dbConnect";
import Project from "@/lib/models/Project";

// GET Projects
export async function GET(req) {
  await dbConnect();

  const url = new URL(req.url);
  const search = url.searchParams.get("search") || "";
  const status = url.searchParams.get("status");
  const page = parseInt(url.searchParams.get("page") || "1");
  const limit = parseInt(url.searchParams.get("limit") || "10");

  const query = {
    ...(search && { title: { $regex: search, $options: "i" } }),
    ...(status && { status }),
  };

  const [totalCount, activeCount, completedCount, projects] = await Promise.all([
    Project.countDocuments(query),
    Project.countDocuments({ status: "Active" }),
    Project.countDocuments({ status: "Completed" }), // ✅ fix typo
    Project.find(query).skip((page - 1) * limit).limit(limit),
  ]);

  return new Response(JSON.stringify({
    projects,
    totalPages: Math.ceil(totalCount / limit),
    totalCount,
    activeCount,
    completedCount,
  }), {
    status: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Content-Type": "application/json",
    },
  });
}

// POST New Project
export async function POST(req) {
  try {
    await dbConnect();
    const body = await req.json();
    const newProject = new Project(body);
    await newProject.save();

    return new Response(JSON.stringify(newProject), {
      status: 201,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 400,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Content-Type": "application/json",
      },
    });
  }
}

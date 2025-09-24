import { dbConnect } from "@/lib/dbConnect";
import Project from "@/lib/models/Project";

import { corsHeaders } from "../../layout";

// GET Projects
export async function GET(req) {
  await dbConnect();

  const url = new URL(req.url);
  const search = url.searchParams.get("search") || "";
  const donationType = url.searchParams.get("donation_type"); // new filter
  const page = parseInt(url.searchParams.get("page") || "1");
  const limit = parseInt(url.searchParams.get("limit") || "10");

  // Base query: must be Active
  const query = {
    status: "Active",
    ...(search && { title: { $regex: search, $options: "i" } }),
    ...(donationType && { "donationOptions.type": donationType }),
  };

  const [totalCount, activeCount, completedCount, projects] = await Promise.all(
    [
      Project.countDocuments(query),
      Project.countDocuments({ status: "Active" }),
      Project.countDocuments({ status: "Completed" }),
      Project.find(query)
        .skip((page - 1) * limit)
        .limit(limit),
    ]
  );

  return new Response(
    JSON.stringify({
      projects,
      totalPages: Math.ceil(totalCount / limit),
      totalCount,
      activeCount,
      completedCount,
    }),
    {
      status: 200,
      headers: corsHeaders,
    }
  );
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
      headers: corsHeaders,
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 400,
      headers: corsHeaders,
    });
  }
}

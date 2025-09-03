// app/api/project/slug/[slug]/route.js
import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/dbConnect";
import Project from "@/lib/models/Project";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*", // ⚠️ change this to frontend domain in production
  "Access-Control-Allow-Methods": "GET, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

// ✅ GET projectId from slug
export async function GET(req, { params }) {
  await dbConnect();
  console.log(params)

  const { slugname } = params;
  const slug = slugname
  console.log("Received slug:", slugname);

  if (!slug) {
    return NextResponse.json(
      { error: "Slug is required" },
      { status: 400, headers: corsHeaders }
    );
  }

  const project = await Project.findOne({ slug }).select("_id slug");

  if (!project) {
    return NextResponse.json(
      { error: "Project not found" },
      { status: 404, headers: corsHeaders }
    );
  }

  return NextResponse.json(
    { projectId: project._id, slug: project.slug },
    { headers: corsHeaders }
  );
}

// ✅ OPTIONS (CORS preflight)
export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}

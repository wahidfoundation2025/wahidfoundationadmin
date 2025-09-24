import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/dbConnect";
import Blog from "@/lib/models/blog";

import { corsHeaders } from "../../layout";

// Simple slug generation function
function generateSlug(title) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

// Handle GET (fetch all blogs)
export async function GET() {
  try {
    await dbConnect();
    const blogs = await Blog.find().sort({ createdAt: -1 });
    return NextResponse.json(blogs, { status: 200, headers: corsHeaders });
  } catch (error) {
    console.error("GET /api/blogs error:", error);
    return NextResponse.json(
      { error: "Failed to fetch blogs", details: error.message },
      { status: 500, headers: corsHeaders }
    );
  }
}

// Handle POST (create a blog)
export async function POST(req) {
  try {
    console.log("Received POST request to /api/blogs");
    await dbConnect();
    const body = await req.json();
    console.log("Request body:", body);

    // Validate required fields
    const requiredFields = ["title", "content", "authorName"];
    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json(
          { error: `Missing required field: ${field}` },
          { status: 400, headers: corsHeaders }
        );
      }
    }

    // Generate slug from title
    let slug = generateSlug(body.title);
    let slugSuffix = 1;
    while (await Blog.findOne({ slug })) {
      slug = `${generateSlug(body.title)}-${slugSuffix}`;
      slugSuffix++;
    }
    body.slug = slug;

    // Rename 'category' to 'categories' to match BlogSchema
    if (body.category) {
      body.categories = body.category;
      delete body.category;
    }

    // Validate schemaMarkup if provided
    if (body.schemaMarkup) {
      try {
        body.schemaMarkup = JSON.parse(body.schemaMarkup);
      } catch (error) {
        return NextResponse.json(
          { error: "Invalid schemaMarkup: must be valid JSON" },
          { status: 400, headers: corsHeaders }
        );
      }
    }

    // Create blog
    const blog = await Blog.create(body);
    return NextResponse.json(blog, { status: 201, headers: corsHeaders });
  } catch (error) {
    console.error("POST /api/blogs error:", error);
    return NextResponse.json(
      { error: "Failed to create blog", details: error.message },
      { status: 400, headers: corsHeaders }
    );
  }
}

// Handle OPTIONS (CORS preflight)
export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}

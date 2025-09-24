import { NextResponse } from "next/server";
import cloudinary from "@/lib/cloudinary";

import { corsHeaders } from "../../layout";

// Handle CORS preflight
export async function OPTIONS() {
  return NextResponse.json({}, { status: 200, headers: corsHeaders });
}

export async function POST(req) {
  const formData = await req.formData();
  const file = formData.get("file");

  if (!file) {
    return NextResponse.json(
      { error: "No file uploaded" },
      { status: 400, headers: corsHeaders }
    );
  }

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  const uploadResult = await new Promise((resolve, reject) => {
    cloudinary.uploader
      .upload_stream({ resource_type: "image" }, (error, result) => {
        if (error) return reject(error);
        resolve(result);
      })
      .end(buffer);
  });

  return NextResponse.json(
    { url: uploadResult.secure_url },
    { status: 200, headers: corsHeaders }
  );
}

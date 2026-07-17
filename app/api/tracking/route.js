import { dbConnect } from "@/lib/dbConnect";
import TrackingSettings from "@/lib/models/trackingSettings";
import { corsHeaders } from "../../layout";

export async function OPTIONS() {
  return new Response(null, { status: 204, headers: corsHeaders });
}

// GET /api/tracking -> the (singleton) tracking settings
export async function GET() {
  await dbConnect();
  let settings = await TrackingSettings.findOne({ key: "global" });
  if (!settings) {
    settings = await TrackingSettings.create({ key: "global" });
  }
  return new Response(JSON.stringify(settings), {
    status: 200,
    headers: corsHeaders,
  });
}

// PUT /api/tracking -> upsert the tracking settings
export async function PUT(req) {
  await dbConnect();
  const body = await req.json();
  const update = {
    ga4Id: body.ga4Id || "",
    gtmId: body.gtmId || "",
    metaPixelId: body.metaPixelId || "",
    customScripts: Array.isArray(body.customScripts) ? body.customScripts : [],
  };
  const settings = await TrackingSettings.findOneAndUpdate(
    { key: "global" },
    { $set: update },
    { new: true, upsert: true, setDefaultsOnInsert: true }
  );
  return new Response(JSON.stringify(settings), {
    status: 200,
    headers: corsHeaders,
  });
}

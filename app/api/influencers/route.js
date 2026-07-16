import { dbConnect } from "@/lib/dbConnect";
import Influencer from "@/lib/models/influencer";
import Donation from "@/lib/models/donation";
import { corsHeaders } from "../../layout";

export async function OPTIONS() {
  return new Response(null, { status: 204, headers: corsHeaders });
}

function slugify(str) {
  return String(str || "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 24);
}

// GET /api/influencers -> influencers with donation stats (count + total raised)
export async function GET() {
  await dbConnect();

  const influencers = await Influencer.find().sort({ createdAt: -1 }).lean();

  // Aggregate successful donations per influencer code.
  const stats = await Donation.aggregate([
    { $match: { influencerCode: { $exists: true, $ne: null, $ne: "" } } },
    {
      $group: {
        _id: "$influencerCode",
        donations: { $sum: 1 },
        totalRaised: { $sum: "$amount" },
      },
    },
  ]);
  const statMap = {};
  stats.forEach((s) => {
    statMap[s._id] = { donations: s.donations, totalRaised: s.totalRaised };
  });

  const withStats = influencers.map((inf) => ({
    ...inf,
    donations: statMap[inf.code]?.donations || 0,
    totalRaised: statMap[inf.code]?.totalRaised || 0,
  }));

  return new Response(JSON.stringify(withStats), {
    status: 200,
    headers: corsHeaders,
  });
}

// POST /api/influencers -> create an influencer (auto-generates a unique code)
export async function POST(req) {
  await dbConnect();
  try {
    const body = await req.json();
    if (!body.name) {
      return new Response(JSON.stringify({ error: "Name is required" }), {
        status: 400,
        headers: corsHeaders,
      });
    }

    // Build a unique code: slug of provided code/name + short random suffix.
    let base = slugify(body.code || body.name) || "ref";
    let code = base;
    for (let i = 0; i < 6; i++) {
      const exists = await Influencer.findOne({ code });
      if (!exists) break;
      code = `${base}-${Math.random().toString(36).slice(2, 6)}`;
    }

    const influencer = await Influencer.create({
      name: body.name,
      code,
      email: body.email || "",
      phone: body.phone || "",
      notes: body.notes || "",
      active: body.active !== false,
    });

    return new Response(JSON.stringify(influencer), {
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

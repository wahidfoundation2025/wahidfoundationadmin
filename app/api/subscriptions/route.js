import { dbConnect } from "../../../lib/dbConnect";
import Donation from "../../../lib/models/donation";
import { corsHeaders } from "../../layout";

export async function OPTIONS() {
  return new Response(null, { status: 204, headers: corsHeaders });
}

// GET /api/subscriptions?email=... -> latest donation per recurring subscription
export async function GET(req) {
  await dbConnect();
  const { searchParams } = new URL(req.url);
  const email = searchParams.get("email");

  const match = {
    subscriptionId: { $exists: true, $ne: null },
    ...(email ? { email } : {}),
  };

  const donations = await Donation.find(match).sort({ createdAt: -1 });

  // One entry per subscription (latest charge represents it).
  const bySub = new Map();
  for (const d of donations) {
    if (!bySub.has(d.subscriptionId)) bySub.set(d.subscriptionId, d);
  }

  return new Response(JSON.stringify(Array.from(bySub.values())), {
    status: 200,
    headers: corsHeaders,
  });
}

// POST /api/subscriptions -> update status of all donations for a subscription
export async function POST(req) {
  await dbConnect();
  const { subscriptionId, status } = await req.json();

  if (!subscriptionId) {
    return new Response(JSON.stringify({ message: "subscriptionId required" }), {
      status: 400,
      headers: corsHeaders,
    });
  }

  const result = await Donation.updateMany(
    { subscriptionId },
    { $set: { subscriptionStatus: status || "cancelled" } }
  );

  return new Response(
    JSON.stringify({ success: true, modified: result.modifiedCount }),
    { status: 200, headers: corsHeaders }
  );
}

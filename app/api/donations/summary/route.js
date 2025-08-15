import { dbConnect } from '../../../../lib/dbConnect'
import Donation from '../../../../lib/models/donation'

export async function GET(req) {
  await dbConnect();

  // CORS headers
  const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
  };

  // Handle preflight OPTIONS request
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 204, headers: corsHeaders });
  }

  try {
    const summary = await Donation.aggregate([
      {
        $group: {
          _id: "$projectId",
          totalCollected: { $sum: "$amount" },
          totalDonors: { $addToSet: "$email" } // unique donors by email
        }
      },
      {
        $project: {
          _id: 1,
          totalCollected: 1,
          totalDonors: { $size: "$totalDonors" }
        }
      }
    ]);

    return new Response(
      JSON.stringify({ success: true, data: summary }),
      { status: 200, headers: corsHeaders }
    );
  } catch (err) {
    console.error(err);
    return new Response(
      JSON.stringify({ success: false, message: "Failed to get donations summary" }),
      { status: 500, headers: corsHeaders }
    );
  }
}

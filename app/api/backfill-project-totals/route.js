// One-off maintenance route: recomputes each project's `collected` (and
// `completion`) from the sum of its existing donation records. Idempotent.
import { dbConnect } from "@/lib/dbConnect";
import Donation from "@/lib/models/donation";
import Project from "@/lib/models/Project";
import { corsHeaders } from "../../layout";

export async function GET() {
  await dbConnect();

  const sums = await Donation.aggregate([
    { $match: { projectId: { $ne: null } } },
    {
      $group: {
        _id: "$projectId",
        total: { $sum: "$amount" },
        count: { $sum: 1 },
      },
    },
  ]);

  const results = [];
  for (const s of sums) {
    try {
      const proj = await Project.findById(s._id);
      if (!proj) continue;
      proj.collected = s.total;
      if (proj.totalRequired > 0) {
        proj.completion = Math.min(
          100,
          Math.round((s.total / proj.totalRequired) * 100)
        );
      }
      await proj.save();
      results.push({
        project: proj.title,
        collected: s.total,
        donations: s.count,
        completion: proj.completion,
      });
    } catch (e) {
      results.push({ projectId: String(s._id), error: e.message });
    }
  }

  return new Response(
    JSON.stringify({ updated: results.length, results }),
    { status: 200, headers: corsHeaders }
  );
}

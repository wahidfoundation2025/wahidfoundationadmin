import { dbConnect } from "@/lib/dbConnect";
import Donation from "@/lib/models/donation";
import Project from "@/lib/models/Project";
import { corsHeaders } from "../../../../layout";

export async function OPTIONS() {
  return new Response(null, { status: 204, headers: corsHeaders });
}

// GET /api/donations/by-email/<email> -> all of a donor's donations
// (one-time + every recurring auto-charge), newest first, with project title.
export async function GET(req, props) {
  const { params } = await props;
  const email = decodeURIComponent(params.email);
  await dbConnect();

  // Ensure Project model is registered for populate.
  void Project;

  const donations = await Donation.find({ email })
    .populate("projectId", "title slug")
    .sort({ createdAt: -1 })
    .lean();

  // Normalize project info onto each row.
  const rows = donations.map((d) => ({
    ...d,
    projectTitle:
      (d.projectId && typeof d.projectId === "object" && d.projectId.title) ||
      d.projectName ||
      null,
    projectId:
      d.projectId && typeof d.projectId === "object"
        ? d.projectId._id
        : d.projectId,
  }));

  return new Response(JSON.stringify(rows), {
    status: 200,
    headers: corsHeaders,
  });
}

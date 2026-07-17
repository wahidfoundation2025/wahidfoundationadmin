import { dbConnect } from "@/lib/dbConnect";
import Donation from "@/lib/models/donation";
import Project from "@/lib/models/Project";
import Donor from "@/lib/models/donor";
import { corsHeaders } from "../../layout";

export async function OPTIONS() {
  return new Response(null, { status: 204, headers: corsHeaders });
}

// GET /api/analytics?from=ISO&to=ISO
// Every figure below respects the requested date range (the dashboard's
// global filter). Omit from/to for all-time.
export async function GET(req) {
  await dbConnect();

  const url = new URL(req.url);
  const fromStr = url.searchParams.get("from");
  const toStr = url.searchParams.get("to");

  const match = {};
  if (fromStr || toStr) {
    match.createdAt = {};
    if (fromStr) match.createdAt.$gte = new Date(fromStr);
    if (toStr) match.createdAt.$lte = new Date(toStr);
  }

  const [
    totalsAgg,
    byProjectAgg,
    byTypeAgg,
    byFrequencyAgg,
    byInfluencerAgg,
    timeseriesAgg,
    recent,
    activeProjects,
    completedProjects,
    totalDonorsAllTime,
  ] = await Promise.all([
    Donation.aggregate([
      { $match: match },
      {
        $group: {
          _id: null,
          raised: { $sum: "$amount" },
          donations: { $sum: 1 },
          donors: { $addToSet: "$email" },
        },
      },
      {
        $project: {
          _id: 0,
          raised: 1,
          donations: 1,
          donors: { $size: "$donors" },
        },
      },
    ]),
    Donation.aggregate([
      { $match: match },
      {
        $group: {
          _id: "$projectId",
          amount: { $sum: "$amount" },
          donations: { $sum: 1 },
          donors: { $addToSet: "$email" },
        },
      },
      {
        $project: {
          amount: 1,
          donations: 1,
          donors: { $size: "$donors" },
        },
      },
      { $sort: { amount: -1 } },
    ]),
    Donation.aggregate([
      { $match: match },
      {
        $group: {
          _id: "$donationType",
          amount: { $sum: "$amount" },
          donations: { $sum: 1 },
        },
      },
      { $sort: { amount: -1 } },
    ]),
    Donation.aggregate([
      { $match: match },
      {
        $group: {
          _id: {
            $cond: [
              { $eq: ["$donationFrequency", "One-Time"] },
              "One-Time",
              "Recurring",
            ],
          },
          amount: { $sum: "$amount" },
          donations: { $sum: 1 },
        },
      },
    ]),
    Donation.aggregate([
      {
        $match: {
          ...match,
          influencerName: { $nin: [null, ""] },
        },
      },
      {
        $group: {
          _id: "$influencerName",
          amount: { $sum: "$amount" },
          donations: { $sum: 1 },
        },
      },
      { $sort: { amount: -1 } },
      { $limit: 8 },
    ]),
    Donation.aggregate([
      { $match: match },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          amount: { $sum: "$amount" },
          donations: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]),
    Donation.find(match).sort({ createdAt: -1 }).limit(8).lean(),
    Project.countDocuments({ status: "Active" }),
    Project.countDocuments({ status: "Completed" }),
    Donor.countDocuments({}),
  ]);

  // Resolve project titles for the project-level table.
  const projects = await Project.find({}, "title slug totalRequired").lean();
  const projById = {};
  projects.forEach((p) => {
    projById[String(p._id)] = p;
  });

  // Donations whose project was deleted (or had none) collapse into a single
  // catch-all row instead of one row per dangling id.
  const known = [];
  const orphan = {
    projectId: "",
    title: "General / Unassigned",
    slug: null,
    totalRequired: 0,
    amount: 0,
    donations: 0,
    donors: 0,
  };
  byProjectAgg.forEach((r) => {
    const p = projById[String(r._id)];
    if (p) {
      known.push({
        projectId: String(r._id),
        title: p.title,
        slug: p.slug || null,
        totalRequired: p.totalRequired || 0,
        amount: r.amount || 0,
        donations: r.donations || 0,
        donors: r.donors || 0,
      });
    } else {
      orphan.amount += r.amount || 0;
      orphan.donations += r.donations || 0;
      orphan.donors += r.donors || 0;
    }
  });
  const byProject = [...known, ...(orphan.donations ? [orphan] : [])].sort(
    (a, b) => b.amount - a.amount
  );

  const t = totalsAgg[0] || { raised: 0, donations: 0, donors: 0 };
  const totals = {
    raised: t.raised || 0,
    donations: t.donations || 0,
    donors: t.donors || 0,
    avg: t.donations ? Math.round((t.raised || 0) / t.donations) : 0,
  };

  return new Response(
    JSON.stringify({
      range: { from: fromStr || null, to: toStr || null },
      totals,
      byProject,
      byType: byTypeAgg.map((r) => ({
        type: r._id || "Unknown",
        amount: r.amount,
        donations: r.donations,
      })),
      byFrequency: byFrequencyAgg.map((r) => ({
        frequency: r._id,
        amount: r.amount,
        donations: r.donations,
      })),
      byInfluencer: byInfluencerAgg.map((r) => ({
        name: r._id,
        amount: r.amount,
        donations: r.donations,
      })),
      timeseries: timeseriesAgg.map((r) => ({
        date: r._id,
        amount: r.amount,
        donations: r.donations,
      })),
      recent,
      projects: { active: activeProjects, completed: completedProjects },
      donorsAllTime: totalDonorsAllTime,
    }),
    { status: 200, headers: corsHeaders }
  );
}

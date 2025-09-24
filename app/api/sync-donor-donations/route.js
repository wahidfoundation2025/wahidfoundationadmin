import { dbConnect } from "../../../lib/dbConnect";
import Donation from "../../../lib/models/donation";
import Donor from "../../../lib/models/donor";

import { corsHeaders } from "../../layout";

// Handle preflight requests
export async function OPTIONS() {
  return new Response(null, { status: 200, headers: corsHeaders });
}

export async function POST() {
  await dbConnect();
  const donations = await Donation.find();
  // Group donations by donor email
  const donorMap = {};
  for (const donation of donations) {
    if (!donorMap[donation.email]) {
      donorMap[donation.email] = {
        name: donation.name,
        email: donation.email,
        profilePicture: "",
        donations: [],
        totalDonated: 0,
        projectsDonatedTo: new Set(),
      };
    }
    donorMap[donation.email].donations.push(donation._id);
    donorMap[donation.email].totalDonated += donation.amount;
    if (donation.projectId) {
      donorMap[donation.email].projectsDonatedTo.add(
        donation.projectId.toString()
      );
    }
  }

  let created = 0;
  for (const email in donorMap) {
    const donor = donorMap[email];
    // Upsert: create if not exists, else update
    await Donor.findOneAndUpdate(
      { email: donor.email },
      {
        name: donor.name,
        email: donor.email,
        profilePicture: donor.profilePicture,
        donations: donor.donations,
        totalProjects: donor.projectsDonatedTo.size,
        totalDonated: donor.totalDonated,
        projectsDonatedTo: Array.from(donor.projectsDonatedTo),
        taxReceipts: [],
      },
      { upsert: true }
    );
    created++;
  }

  return new Response(
    JSON.stringify({
      message: `Donor population complete! Upserted: ${created}`,
    }),
    {
      status: 200,
      headers: corsHeaders,
    }
  );
}

import { dbConnect } from '../../../lib/dbConnect'
import Donation from '../../../lib/models/donation'
import Donor from '../../../lib/models/donor'

export async function OPTIONS() {
  return new Response(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET,POST,OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  })
}

export async function GET() {
  await dbConnect()
  const donations = await Donation.find().sort({ createdAt: -1 })
  return new Response(JSON.stringify(donations), {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Content-Type': 'application/json',
    },
  })
}

export async function POST(req) {
  await dbConnect()
  const data = await req.json()
  const donation = await Donation.create(data)

  // Donor logic
  let donor = await Donor.findOne({ email: data.email })
  if (donor) {
    donor.totalDonated += data.amount
    donor.donations = donor.donations || []
    // Add donationId if not already present
    if (!donor.donations.some((id) => id.toString() === donation._id.toString())) {
      donor.donations.push(donation._id)
    }
    if (data.projectId && (!donor.projectsDonatedTo || !donor.projectsDonatedTo.includes(data.projectId))) {
      donor.totalProjects += 1
      donor.projectsDonatedTo = donor.projectsDonatedTo || []
      donor.projectsDonatedTo.push(data.projectId)
    }
    await donor.save()
  } else {
    donor = await Donor.create({
      name: data.name,
      email: data.email,
      profilePicture: '', // Set if available
      totalDonated: data.amount,
      totalProjects: data.projectId ? 1 : 0,
      projectsDonatedTo: data.projectId ? [data.projectId] : [],
      donations: [donation._id],
    })
  }

  return new Response(JSON.stringify(donation), {
    status: 201,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Content-Type': 'application/json',
    },
  })
}
